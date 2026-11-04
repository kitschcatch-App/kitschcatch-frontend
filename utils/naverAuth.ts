/**
 * 유틸: 네이버 브라우저 로그인 콜백 처리
 * 역할: 백엔드가 발급한 authorizationUrl을 외부 브라우저로 연 뒤, 앱 딥링크(kitschcatch://...)로
 *       돌아오는 콜백 URL에서 authorizationCode를 꺼냅니다. (네이버는 SDK access token 직접 전달 미지원)
 */
import { Linking } from 'react-native';

export type NaverCallback = { code: string; state: string } | { error: string; state?: string };

const getParam = (url: string, key: string) => {
  const m = url.match(new RegExp(`[?&#]${key}=([^&#]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
};

/** 콜백 URL 파싱. 네이버 콜백이 아니면 null */
export const parseNaverCallback = (url: string): NaverCallback | null => {
  const state = getParam(url, 'state');
  const code = getParam(url, 'code');
  if (code && state) return { code, state };
  const error = getParam(url, 'error');
  if (error) return { error, state };
  return null;
};

export const NAVER_CANCELLED = 'NAVER_CANCELLED';

/** 같은 state의 콜백이 올 때까지 대기해 authorizationCode를 반환. 사용자가 거부하면 NAVER_CANCELLED로 reject */
export const waitForNaverCode = (state: string) =>
  new Promise<string>((resolve, reject) => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const cb = parseNaverCallback(url);
      if (!cb || (cb.state && cb.state !== state)) return;
      sub.remove();
      if ('code' in cb) resolve(cb.code);
      else reject(new Error(NAVER_CANCELLED)); // ponytail: error 종류 구분 없이 취소로 처리
    });
  });
