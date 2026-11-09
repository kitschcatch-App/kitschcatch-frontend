/**
 * 유틸: 자동 로그인 판정 (autoLogin)
 * 역할: 저장된 토큰으로 세션이 유효한지 확인합니다. LoginScreen이 로고 애니메이션 후 호출해 Home으로 넘깁니다.
 */
import { secureStorage } from './secureStorage';
import { userAPI } from '../api/apiClient';

// 토큰이 있고, 서버가 세션을 인정(만료 시 인터셉터가 refresh 시도)하며, 프로필 등록까지 끝난 경우 true.
// 네트워크 오류(응답 없음)는 로그아웃시키지 않고 true(홈 진입).
export const isAutoLoginValid = async (): Promise<boolean> => {
  try {
    if (!(await secureStorage.getItem('accessToken'))) return false;
    const res = await userAPI.getMe();
    return res.data?.data?.profileRegistered !== false;
  } catch (e: any) {
    return !e.response;
  }
};
