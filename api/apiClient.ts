/**
 * 파일: apiClient.ts
 * 역할: axios를 사용하여 네트워크 요청(API 연동) 공통 로직을 모듈화한 파일입니다.
 */
import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 안드로이드 에뮬레이터 로컬 백엔드 연동 주소 (10.0.2.2)
// 실기기나 iOS 등 환경에 따라 나중에는 환경변수(.env)로 분리하는 것이 좋습니다.
const BASE_URL = 'http://10.0.2.2:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── 요청 인터셉터: 모든 요청 헤더에 Access Token 자동 추가 ───────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Refresh Token 자동 갱신을 위한 내부 상태 ──────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// 갱신 완료 후 대기 중이던 요청들을 일괄 처리
const processQueue = (error: any, newToken: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(newToken!);
    }
  });
  failedQueue = [];
};

// ─── 응답 인터셉터: 401 발생 시 Refresh Token으로 Access Token 자동 갱신 ────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Refresh Token 엔드포인트 자체가 401이면 즉시 로그아웃 처리 (무한 루프 방지)
    if (originalRequest.url?.includes('/auth/token/refresh')) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 갱신 중이면 대기열에 추가 후 갱신 완료 시 재시도
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        // 저장된 refreshToken이 없으면(미로그인) 갱신 시도 없이 원래 401 에러 그대로 전달
        // → 토큰 삭제 없이 조용히 reject (기존: "No refresh token stored" 에러를 새로 throw해 혼란 유발)
        if (!storedRefreshToken) {
          isRefreshing = false;
          processQueue(null, null);
          return Promise.reject(error);
        }

        // apiClient 인터셉터를 우회해 순수 axios로 직접 호출 (중복 인터셉터 방지)
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/token/refresh`,
          { refreshToken: storedRefreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료 → 저장된 토큰 전부 삭제 (로그인 화면으로 이동은 각 화면에서 처리)
        processQueue(refreshError, null);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── 인증 전용 axios 인스턴스 (인터셉터 없음) ────────────────────────────────────
// authAPI는 로그인 전에 호출되므로 토큰 갱신 인터셉터를 거치면 안 됩니다.
const authClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── 인증 관련 API ──────────────────────────────────────────────────────────────
export const authAPI = {
  // [Step 1] 카카오 OIDC 로그인용 Nonce 발급
  getNonce: () =>
    authClient.post('/auth/kakao/nonce'),

  // [Step 2] 카카오 모바일 로그인: ID Token + Nonce 검증 후 JWT 발급
  loginWithKakao: (idToken: string, nonce: string) =>
    authClient.post('/auth/kakao/mobile-login', { idToken, nonce }),
};

// ─── 상품 관련 API ──────────────────────────────────────────────────────────────
export const productAPI = {
  // 상품 목록 조회
  getPostList: (config?: AxiosRequestConfig) =>
    apiClient.get('/posts', config),

  // 상품 상세 정보 조회
  getPostDetail: (productId: string | number, config?: AxiosRequestConfig) =>
    apiClient.get(`/posts/${productId}`, config),

  // 상품 등록
  createPost: (data: any, config?: AxiosRequestConfig) =>
    apiClient.post('/posts', data, config),

  // 상품 수정
  updatePost: (postId: string | number, data: any, config?: AxiosRequestConfig) =>
    apiClient.patch(`/posts/${postId}`, data, config),

  // S3 Presigned URL 발급 (다중 파일)
  getPresignedUrls: (images: { originalFileName: string; contentType: string }[]) =>
    apiClient.post('/posts/images/presigned-urls', { images }),
};