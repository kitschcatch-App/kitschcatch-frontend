// 네이버 인증 브라우저를 열고 현재 로그인 시도에 해당하는 HTTPS 콜백을 기다린다.
import { Linking } from 'react-native';

export const NAVER_CANCELLED = 'NAVER_CANCELLED';
export const NAVER_EXPIRED = 'NAVER_EXPIRED';

const authorizeEndpoint = 'https://nid.naver.com/oauth2.0/authorize';

type NaverAuthorization = {
  authorizationUrl: string;
  state: string;
  expiresIn: number;
};

export const openNaverAuthorization = async (
  { authorizationUrl, state, expiresIn }: NaverAuthorization,
  signal: AbortSignal,
): Promise<string> => {
  const authorizeQuery = new URLSearchParams(authorizationUrl.slice(authorizeEndpoint.length + 1));
  const callbacks = authorizeQuery.getAll('redirect_uri');
  const callback = callbacks[0];
  if (
    !authorizationUrl.startsWith(authorizeEndpoint + '?') ||
    callbacks.length !== 1 ||
    !/^https:\/\/[a-z0-9.-]+\/api\/auth\/naver\/callback$/i.test(callback) ||
    !state || authorizeQuery.get('state') !== state ||
    !Number.isInteger(expiresIn) || expiresIn <= 0 || expiresIn > 300
  ) {
    throw new Error('NAVER_INVALID_AUTHORIZATION');
  }
  if (signal.aborted) throw new Error(NAVER_CANCELLED);

  return new Promise<string>((resolve, reject) => {
    const deadline = Date.now() + expiresIn * 1000;
    let settled = false;
    const cleanup = () => {
      if (settled) return false;
      settled = true;
      sub.remove();
      clearTimeout(timer);
      signal.removeEventListener('abort', cancel);
      return true;
    };
    const fail = (reason: string) => {
      if (cleanup()) reject(new Error(reason));
    };
    const cancel = () => fail(NAVER_CANCELLED);
    const sub = Linking.addEventListener('url', ({ url }) => {
      if (!url.startsWith(callback + '?') || url.includes('#')) return;

      let query: URLSearchParams;
      try {
        query = new URLSearchParams(url.slice(callback.length + 1));
      } catch {
        return;
      }
      const states = query.getAll('state');
      if (states.length !== 1 || states[0] !== state) return;
      if (Date.now() >= deadline) {
        fail(NAVER_EXPIRED);
        return;
      }

      const errors = query.getAll('error');
      const codes = query.getAll('code');
      if (errors.length === 1 && errors[0] && codes.length === 0) {
        fail(errors[0] === 'access_denied' ? NAVER_CANCELLED : 'NAVER_AUTHORIZATION_FAILED');
      } else if (errors.length === 0 && codes.length === 1 && codes[0]) {
        if (cleanup()) resolve(codes[0]);
      }
    });
    const timer = setTimeout(() => fail(NAVER_EXPIRED), expiresIn * 1000);
    signal.addEventListener('abort', cancel);
    Linking.openURL(authorizationUrl).catch(() => fail('NAVER_BROWSER_OPEN_FAILED'));
  });
};
