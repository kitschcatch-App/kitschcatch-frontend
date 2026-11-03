// 인증 URL 위조·state 재사용·만료 및 브라우저/재시작 콜백의 실제 교환 호출을 검증한다.
import { Linking } from 'react-native';
import { authAPI } from '../api/apiClient';
import { secureStorage } from '../utils/secureStorage';
import {
  NAVER_CALLBACK,
  parseNaverCallback,
  validateNaverAuthorization,
  startNaverLogin,
  resumeNaverLogin,
  cancelNaverLogin,
} from '../utils/naverOAuth';
jest.mock('../api/apiClient', () => ({
  authAPI: { getNaverState: jest.fn(), loginWithNaver: jest.fn() },
}));
jest.mock('../utils/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));
const state = 'a'.repeat(43);
const callback = `${NAVER_CALLBACK}?code=naver-code&state=${state}`;
const data = {
  state,
  expiresIn: 300,
  authorizationUrl: `https://nid.naver.com/oauth2.0/authorize?response_type=code&state=${state}&redirect_uri=${encodeURIComponent(
    NAVER_CALLBACK,
  )}`,
};
const values = new Map<string, string>();
let listener: (event: { url: string }) => void;
const remove = jest.fn();
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
beforeEach(() => {
  jest.clearAllMocks();
  values.clear();
  (secureStorage.getItem as jest.Mock).mockImplementation(
    async key => values.get(key) ?? null,
  );
  (secureStorage.setItem as jest.Mock).mockImplementation(
    async (key, value) => {
      values.set(key, value);
    },
  );
  (secureStorage.removeItem as jest.Mock).mockImplementation(async key => {
    values.delete(key);
  });
  (authAPI.getNaverState as jest.Mock).mockResolvedValue({ data: { data } });
  (authAPI.loginWithNaver as jest.Mock).mockResolvedValue({
    data: { data: { accessToken: 'app-token' } },
  });
  jest
    .spyOn(Linking, 'addEventListener')
    .mockImplementation((_event, handler) => {
      listener = handler;
      return { remove } as unknown as ReturnType<
        typeof Linking.addEventListener
      >;
    });
  jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
});
afterEach(() => cancelNaverLogin());
test('인증 URL의 제공자·콜백·state 위조를 거절한다', () => {
  expect(validateNaverAuthorization(data).state).toBe(state);
  for (const authorizationUrl of [
    data.authorizationUrl.replace('nid.naver.com', 'evil.example'),
    data.authorizationUrl.replace(
      encodeURIComponent(NAVER_CALLBACK),
      encodeURIComponent('https://evil.example'),
    ),
    data.authorizationUrl + '&state=other',
  ])
    expect(() =>
      validateNaverAuthorization({ ...data, authorizationUrl }),
    ).toThrow();
});
test('콜백 주소와 state를 확인하고 중복·만료·취소를 거절한다', () => {
  const pending = validateNaverAuthorization(data);
  expect(parseNaverCallback(callback, pending)).toEqual({
    authorizationCode: 'naver-code',
    state,
  });
  expect(
    parseNaverCallback(
      callback.replace('dev-kitschcatch.p-e.kr', 'evil.example'),
      pending,
    ),
  ).toBeNull();
  for (const url of [
    callback + '&state=other',
    callback.replace(state, 'b'.repeat(43)),
    callback + '&error=access_denied',
    callback + '#fragment',
  ])
    expect(() => parseNaverCallback(url, pending)).toThrow();
  expect(() =>
    parseNaverCallback(callback, { ...pending, expiresAt: Date.now() - 1 }),
  ).toThrow();
});
test('브라우저 열기 전에 저장·구독하고 동일 콜백의 코드를 한 번만 교환한다', async () => {
  const flight = startNaverLogin();
  await flush();
  expect(Linking.openURL).toHaveBeenCalledWith(data.authorizationUrl);
  expect(values.has('naverPendingLogin')).toBe(true);
  listener({ url: callback });
  listener({ url: callback });
  await flight;
  expect(authAPI.loginWithNaver).toHaveBeenCalledTimes(1);
  expect(authAPI.loginWithNaver).toHaveBeenCalledWith('naver-code', state);
  expect(remove).toHaveBeenCalled();
  expect(values.size).toBe(0);
});
test('취소하면 구독과 보관된 state를 제거하고 코드를 제출하지 않는다', async () => {
  const flight = startNaverLogin();
  const failure = flight.catch(error => error);
  await flush();
  cancelNaverLogin();
  expect(await failure).toBeInstanceOf(Error);
  expect(values.size).toBe(0);
  expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
  expect(remove).toHaveBeenCalled();
});
test('앱 재시작 콜백은 저장한 state를 소비하고 재사용을 거절한다', async () => {
  values.set(
    'naverPendingLogin',
    JSON.stringify(validateNaverAuthorization(data)),
  );
  await resumeNaverLogin(callback);
  expect(authAPI.loginWithNaver).toHaveBeenCalledWith('naver-code', state);
  await expect(resumeNaverLogin(callback)).rejects.toThrow();
  expect(authAPI.loginWithNaver).toHaveBeenCalledTimes(1);
});
test('요청하지 않은 앱 콜백은 교환하지 않는다', async () => {
  await expect(resumeNaverLogin(callback)).rejects.toThrow();
  expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
});

test('만료 및 브라우저 열기 실패 시 요청을 정리한다', async () => {
  (Linking.openURL as jest.Mock).mockRejectedValueOnce(
    new Error('browser unavailable'),
  );
  await expect(startNaverLogin()).rejects.toThrow('browser unavailable');
  expect(values.size).toBe(0);
  expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
  values.set(
    'naverPendingLogin',
    JSON.stringify({ state, expiresAt: Date.now() - 1 }),
  );
  await expect(resumeNaverLogin(callback)).rejects.toThrow();
  expect(values.size).toBe(0);
  expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
});

test('진행 중 다른 링크를 무시하고 잘못된 state는 교환 전에 거절한다', async () => {
  const flight = startNaverLogin();
  const failure = flight.catch(error => error);
  await flush();
  listener({ url: 'https://unrelated.example' });
  expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
  listener({ url: callback.replace(state, 'b'.repeat(43)) });
  expect(await failure).toBeInstanceOf(Error);
  expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
  expect(values.size).toBe(0);
});
