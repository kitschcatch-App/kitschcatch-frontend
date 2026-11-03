// 네이버 인증 URL과 콜백을 엄격히 검사하고 일회용 로그인 요청을 연결한다.
import { Linking } from 'react-native';
import { authAPI } from '../api/apiClient';
import { secureStorage } from './secureStorage';

export const NAVER_CALLBACK =
  'https://dev-kitschcatch.p-e.kr/api/auth/naver/callback';
const PENDING_KEY = 'naverPendingLogin';
type Pending = { state: string; expiresAt: number };
export class NaverLoginError extends Error {
  constructor(public kind: 'cancelled' | 'invalid' | 'expired') {
    super(`Naver login ${kind}`);
  }
}
function parameters(query: string): Map<string, string> {
  const values = new Map<string, string>();
  for (const pair of query.split('&')) {
    const index = pair.indexOf('=');
    const key = decodeURIComponent(
      (index < 0 ? pair : pair.slice(0, index)).replace(/\+/g, ' '),
    );
    const value = decodeURIComponent(
      (index < 0 ? '' : pair.slice(index + 1)).replace(/\+/g, ' '),
    );
    if (values.has(key)) throw new NaverLoginError('invalid');
    values.set(key, value);
  }
  return values;
}
export function validateNaverAuthorization(data: {
  state: string;
  authorizationUrl: string;
  expiresIn: number;
}): Pending {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(data.state) ||
    !Number.isInteger(data.expiresIn) ||
    data.expiresIn <= 5 ||
    data.expiresIn > 300 ||
    !data.authorizationUrl.startsWith(
      'https://nid.naver.com/oauth2.0/authorize?',
    ) ||
    data.authorizationUrl.includes('#')
  ) {
    throw new NaverLoginError('invalid');
  }
  const params = parameters(data.authorizationUrl.split('?')[1]);
  if (
    params.get('state') !== data.state ||
    params.get('redirect_uri') !== NAVER_CALLBACK ||
    params.get('response_type') !== 'code'
  )
    throw new NaverLoginError('invalid');
  return {
    state: data.state,
    expiresAt: Date.now() + (data.expiresIn - 5) * 1000,
  };
}
export function parseNaverCallback(
  url: string,
  pending: Pending,
): { authorizationCode: string; state: string } | null {
  if (url.split(/[?#]/)[0] !== NAVER_CALLBACK) return null;
  if (
    url.includes('#') ||
    !Number.isFinite(pending.expiresAt) ||
    pending.expiresAt <= Date.now()
  )
    throw new NaverLoginError('expired');
  const params = parameters(url.split('?')[1] ?? '');
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(pending.state) ||
    params.get('state') !== pending.state
  )
    throw new NaverLoginError('invalid');
  if (params.has('error')) throw new NaverLoginError('cancelled');
  const code = params.get('code');
  if (!code?.trim() || code.length > 2048) throw new NaverLoginError('invalid');
  return { authorizationCode: code, state: pending.state };
}
let generation = 0;
let cancelActive: (() => void) | undefined;
export function cancelNaverLogin() {
  generation += 1;
  cancelActive?.();
}
export async function startNaverLogin() {
  const current = ++generation;
  const {
    data: { data },
  } = await authAPI.getNaverState();
  const pending = validateNaverAuthorization(data);
  if (current !== generation) throw new NaverLoginError('cancelled');
  await secureStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  if (current !== generation) {
    await secureStorage.removeItem(PENDING_KEY);
    throw new NaverLoginError('cancelled');
  }
  return new Promise<Awaited<ReturnType<typeof authAPI.loginWithNaver>>>(
    (resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        subscription.remove();
        clearTimeout(timer);
        cancelActive = undefined;
      };
      const fail = (error: unknown) => {
        if (settled) return;
        settled = true;
        cleanup();
        secureStorage.removeItem(PENDING_KEY).then(() => reject(error), reject);
      };
      const subscription = Linking.addEventListener('url', ({ url }) => {
        if (settled) return;
        try {
          const callback = parseNaverCallback(url, pending);
          if (!callback) return;
          settled = true;
          cleanup();
          secureStorage
            .removeItem(PENDING_KEY)
            .then(() =>
              authAPI.loginWithNaver(
                callback.authorizationCode,
                callback.state,
              ),
            )
            .then(resolve, reject);
        } catch (error) {
          fail(error);
        }
      });
      const timer = setTimeout(
        () => fail(new NaverLoginError('expired')),
        pending.expiresAt - Date.now(),
      );
      cancelActive = () => fail(new NaverLoginError('cancelled'));
      Linking.openURL(data.authorizationUrl).catch(fail);
    },
  );
}
export async function resumeNaverLogin(url: string | null) {
  if (!url || url.split(/[?#]/)[0] !== NAVER_CALLBACK) return null;
  const stored = await secureStorage.getItem(PENDING_KEY);
  await secureStorage.removeItem(PENDING_KEY);
  if (!stored) throw new NaverLoginError('expired');
  const pending: Pending = JSON.parse(stored);
  const callback = parseNaverCallback(url, pending);
  if (!callback) throw new NaverLoginError('invalid');
  return authAPI.loginWithNaver(callback.authorizationCode, callback.state);
}
