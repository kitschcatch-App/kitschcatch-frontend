// 네이버 브라우저 콜백의 출처, 요청 상태 및 정리 동작을 검증한다.
import { Linking } from 'react-native';
import { openNaverAuthorization, NAVER_CANCELLED, NAVER_EXPIRED } from '../utils/naverAuth';

const callback = 'https://dev-kitschcatch.p-e.kr/api/auth/naver/callback';
const state = 'attempt-state';
const authorization = {
  authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize?' +
    'redirect_uri=' + encodeURIComponent(callback) + '&state=' + state,
  state,
  expiresIn: 5,
};

describe('openNaverAuthorization', () => {
  const setup = () => {
    let handler!: (e: { url: string }) => void;
    const remove = jest.fn();
    jest.spyOn(Linking, 'addEventListener').mockImplementation((_, listener) => {
      handler = listener;
      return { remove } as unknown as ReturnType<typeof Linking.addEventListener>;
    });
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const attempt = new AbortController();
    return { emit: (url: string) => handler({ url }), remove, open, attempt };
  };

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('다른 주소, state 없는 오류 및 중복 state를 무시하고 현재 요청의 코드만 반환한다', async () => {
    const { emit, remove, open, attempt } = setup();
    const code = openNaverAuthorization(authorization, attempt.signal);
    expect(open).toHaveBeenCalledWith(authorization.authorizationUrl);
    emit('kitschcatch://naver?code=wrong&state=' + state);
    emit(callback + '/other?code=wrong&state=' + state);
    emit(callback + '?code=wrong&state=other');
    emit(callback + '?error=access_denied');
    emit(callback + '?code=wrong&state=' + state + '&state=other');
    expect(remove).not.toHaveBeenCalled();
    emit(callback + '?code=good%2B1&state=' + state);
    await expect(code).resolves.toBe('good+1');
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('동일한 state의 네이버 동의 거부를 취소로 처리한다', async () => {
    const { emit, remove, attempt } = setup();
    const code = openNaverAuthorization(authorization, attempt.signal);
    emit(callback + '?error=access_denied&state=' + state);
    await expect(code).rejects.toThrow(NAVER_CANCELLED);
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('콜백이 없는 브라우저 종료 이후에도 취소하고 정리할 수 있다', async () => {
    const { remove, attempt } = setup();
    const code = openNaverAuthorization(authorization, attempt.signal);
    attempt.abort();
    await expect(code).rejects.toThrow(NAVER_CANCELLED);
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('대기 시간이 지나면 콜백 리스너를 정리한다', async () => {
    jest.useFakeTimers();
    const { remove, attempt } = setup();
    const code = openNaverAuthorization(authorization, attempt.signal);
    const result = expect(code).rejects.toThrow(NAVER_EXPIRED);
    jest.advanceTimersByTime(5000);
    await result;
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('브라우저를 열지 못하면 콜백 리스너를 정리한다', async () => {
    const { remove, open, attempt } = setup();
    open.mockRejectedValueOnce(new Error('browser unavailable'));
    await expect(openNaverAuthorization(authorization, attempt.signal))
      .rejects.toThrow('NAVER_BROWSER_OPEN_FAILED');
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
