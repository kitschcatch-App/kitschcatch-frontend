import { secureStorage } from './secureStorage';

/** 로그아웃/탈퇴 시 기기에 저장된 로그인 정보를 모두 삭제 */
export const clearSession = () =>
  Promise.all(['accessToken', 'refreshToken', 'userId'].map(key => secureStorage.removeItem(key)));
