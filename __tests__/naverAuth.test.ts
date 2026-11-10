// 네이버 콜백 주소·state 검증과 취소·만료·리스너 정리를 검증한다.
import { Linking } from 'react-native';
import {
  parseNaverCallback,
  startNaverLogin,
  NAVER_CALLBACK_URL,
  NAVER_CANCELLED,
  NAVER_TIMEOUT,
} from '../utils/naverAuth';

const callback = (query: string) => `${NAVER_CALLBACK_URL}?${query}`;
const authorization = (state = 's1') => ({
  state,
  expiresIn: 300,
  authorizationUrl: `https://nid.naver.com/oauth2.0/authorize?state=${state}&redirect_uri=${encodeURIComponent(
    NAVER_CALLBACK_URL,
  )}`,
});

describe('네이버 로그인', () => {
  let emit: (event: { url: string }) => void;
  let remove: jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    remove = jest.fn();
    jest.spyOn(Linking, 'addEventListener').mockImplementation(((
      _: 'url',
      handler: (event: { url: string }) => void,
    ) => {
      emit = handler;
      return { remove };
    }) as unknown as typeof Linking.addEventListener);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('정확한 HTTPS 주소에서 code와 state를 읽는다', () => {
    expect(parseNaverCallback(callback('code=abc%2B1&state=xyz'))).toEqual({
      code: 'abc+1',
      state: 'xyz',
    });
  });
  it.each([
    'https://evil.example/api/auth/naver/callback?code=x&state=s1',
    `${NAVER_CALLBACK_URL}/other?code=x&state=s1`,
    'kitschcatch://naver?code=x&state=s1',
    callback('error=access_denied'),
    callback('code=%ZZ&state=s1'),
    callback('code=x&state=s1&state=s2'),
    callback('code=x&error=denied&state=s1'),
  ])('잘못된 콜백을 거절한다: %s', url => {
    expect(parseNaverCallback(url)).toBeNull();
  });
  it('다른 state는 무시하고 한 번만 완료한 뒤 정리한다', async () => {
    const pending = startNaverLogin(authorization());
    expect(
      (Linking.addEventListener as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan((Linking.openURL as jest.Mock).mock.invocationCallOrder[0]);
    emit({ url: callback('code=other&state=s2') });
    expect(remove).not.toHaveBeenCalled();
    emit({ url: callback('code=good&state=s1') });
    emit({ url: callback('code=duplicate&state=s1') });
    await expect(pending.promise).resolves.toBe('good');
    expect(remove).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });
  it('주소와 state가 맞는 거절만 취소로 처리한다', async () => {
    const pending = startNaverLogin(authorization());
    const result = pending.promise.catch(error => error);
    emit({ url: callback('error=access_denied&state=s2') });
    expect(remove).not.toHaveBeenCalled();
    emit({ url: callback('error=access_denied&state=s1') });
    await expect(result).resolves.toMatchObject({ message: NAVER_CANCELLED });
  });
  it('시간 초과 후 재시도는 새 state만 받는다', async () => {
    const pending = startNaverLogin(authorization());
    const result = pending.promise.catch(error => error);
    jest.advanceTimersByTime(300000);
    await expect(result).resolves.toMatchObject({ message: NAVER_TIMEOUT });
    expect(remove).toHaveBeenCalledTimes(1);
    const next = startNaverLogin(authorization('s2'));
    emit({ url: callback('code=old&state=s1') });
    emit({ url: callback('code=new&state=s2') });
    await expect(next.promise).resolves.toBe('new');
  });
  it('명시적 취소가 리스너와 타이머를 해제한다', async () => {
    const pending = startNaverLogin(authorization());
    const result = pending.promise.catch(error => error);
    pending.cancel();
    pending.cancel();
    await expect(result).resolves.toMatchObject({ message: NAVER_CANCELLED });
    expect(remove).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });
  it('브라우저 열기 실패도 대기를 정리한다', async () => {
    (Linking.openURL as jest.Mock).mockRejectedValue(new Error('open failed'));
    const pending = startNaverLogin(authorization());
    await expect(pending.promise).rejects.toThrow();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });
  it('서버 콜백 설정이 앱과 다르면 브라우저를 열지 않는다', () => {
    expect(() =>
      startNaverLogin({
        ...authorization(),
        authorizationUrl: 'https://evil.example',
      }),
    ).toThrow();
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
