// 네이버 HTTPS 콜백을 현재 로그인 시도와 대조하고 인증 대기를 정리한다.
import { Linking } from 'react-native';

export const NAVER_CALLBACK_URL =
  'https://dev-kitschcatch.p-e.kr/api/auth/naver/callback';
export const NAVER_CANCELLED = 'NAVER_CANCELLED';
export const NAVER_TIMEOUT = 'NAVER_TIMEOUT';
export const NAVER_FAILED = 'NAVER_FAILED';

export type NaverCallback =
  | { code: string; state: string }
  | { error: string; state: string };
export type NaverAuthorization = {
  state: string;
  authorizationUrl: string;
  expiresIn: number;
};

// RN의 URL 구현에 의존하지 않고 중복·손상된 쿼리를 거절한다.
const query = (url: string): Record<string, string> | null => {
  if (url.includes('#') || !url.includes('?')) return null;
  const result: Record<string, string> = Object.create(null);
  try {
    for (const pair of url.slice(url.indexOf('?') + 1).split('&')) {
      const separator = pair.indexOf('=');
      if (separator < 1) return null;
      const decode = (value: string) =>
        decodeURIComponent(value.replace(/\+/g, ' '));
      const key = decode(pair.slice(0, separator));
      if (Object.prototype.hasOwnProperty.call(result, key)) return null;
      result[key] = decode(pair.slice(separator + 1));
    }
    return result;
  } catch {
    return null;
  }
};

export const parseNaverCallback = (url: string): NaverCallback | null => {
  if (url.split('?')[0] !== NAVER_CALLBACK_URL) return null;
  const params = query(url);
  if (!params?.state || (params.code && params.error)) return null;
  if (params.code && params.code.length <= 2048)
    return { code: params.code, state: params.state };
  if (params.error) return { error: params.error, state: params.state };
  return null;
};

export const startNaverLogin = ({
  state,
  authorizationUrl,
  expiresIn,
}: NaverAuthorization) => {
  const params = query(authorizationUrl);
  if (
    authorizationUrl.split('?')[0] !==
      'https://nid.naver.com/oauth2.0/authorize' ||
    params?.state !== state ||
    !state ||
    params?.redirect_uri !== NAVER_CALLBACK_URL ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0
  )
    throw new Error(NAVER_FAILED);

  let cancel = () => {};
  const promise = new Promise<string>((resolve, reject) => {
    let finished = false;
    const finish = (code?: string, error?: string) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      subscription.remove();
      if (code) resolve(code);
      else reject(new Error(error ?? NAVER_FAILED));
    };
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const callback = parseNaverCallback(url);
      if (!callback || callback.state !== state) return;
      if ('code' in callback) finish(callback.code);
      else
        finish(
          undefined,
          callback.error === 'access_denied' ? NAVER_CANCELLED : NAVER_FAILED,
        );
    });
    const timer = setTimeout(
      () => finish(undefined, NAVER_TIMEOUT),
      Math.min(expiresIn, 300) * 1000,
    );
    cancel = () => finish(undefined, NAVER_CANCELLED);
    // 리스너를 등록한 다음 브라우저를 열어 빠른 콜백도 놓치지 않는다.
    try {
      Linking.openURL(authorizationUrl).catch(() =>
        finish(undefined, NAVER_FAILED),
      );
    } catch {
      finish(undefined, NAVER_FAILED);
    }
  });
  return { promise, cancel };
};
