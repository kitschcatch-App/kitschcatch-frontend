/**
 * 파일: apiClient.ts
 * 역할: axios를 사용하여 네트워크 요청(API 연동) 공통 로직을 모듈화한 파일입니다.
 */
import axios, { AxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { secureStorage } from '../utils/secureStorage';
import { getMockApiBody } from './mockData';

const BASE_URL = Config.API_BASE_URL!;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Mock 모드 전역 플래그 (MockModeProvider가 갱신). true면 mock 경로 요청은 네트워크 대신 mockData 응답을 받는다.
let mockEnabled = false;
export const setApiMockEnabled = (value: boolean) => {
  mockEnabled = value;
};

// ─── 요청 인터셉터: 모든 요청 헤더에 Access Token 자동 추가 ───────────────────
apiClient.interceptors.request.use(
  async (config) => {
    if (mockEnabled) {
      const body = getMockApiBody((config.method ?? 'get').toLowerCase(), config.url ?? '', config.data);
      if (body !== undefined) {
        config.adapter = async () => ({ data: body, status: 200, statusText: 'OK', headers: {}, config });
        return config;
      }
    }
    const token = await secureStorage.getItem('accessToken');
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
      await secureStorage.removeItem('accessToken');
      await secureStorage.removeItem('refreshToken');
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
        const storedRefreshToken = await secureStorage.getItem('refreshToken');

        // 저장된 refreshToken이 없으면(미로그인) 갱신 시도 없이 원래 401 에러 그대로 전달
        // → 토큰 삭제 없이 조용히 reject
        if (!storedRefreshToken) {
          isRefreshing = false;
          processQueue(error, null);
          return Promise.reject(error);
        }

        // apiClient 인터셉터를 우회해 순수 axios로 직접 호출 (중복 인터셉터 방지)
        // API 스펙: POST /api/auth/token/refresh (BASE_URL이 이미 /api로 끝남)
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/token/refresh`,
          { refreshToken: storedRefreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        await secureStorage.setItem('accessToken', newAccessToken);
        await secureStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료 → 저장된 토큰 전부 삭제 (로그인 화면으로 이동은 각 화면에서 처리)
        processQueue(refreshError, null);
        await secureStorage.removeItem('accessToken');
        await secureStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── 인증 전용 axios 인스턴스 (인터셉터 없음) ────────────────────────────────────
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

  // [Step 1] 네이버 인증 요청 발급: 서버 state + 브라우저에서 열 authorizationUrl
  getNaverState: () =>
    authClient.post('/auth/naver/state'),

  // [Step 2] 네이버 모바일 로그인: 브라우저 콜백의 authorizationCode + 서버 state 검증 후 JWT 발급
  loginWithNaver: (authorizationCode: string, state: string) =>
    authClient.post('/auth/naver/mobile-login', { authorizationCode, state }),

  // 로그아웃: refresh token 폐기
  logout: (refreshToken: string) =>
    authClient.post('/auth/logout', { refreshToken }),
};

// ─── 회원 관련 API ──────────────────────────────────────────────────────────────
export const userAPI = {
  // 아이디 중복 확인
  checkUsernameAvailability: (username: string) =>
    apiClient.get('/users/username-availability', { params: { username } }),

  // 닉네임 중복 확인
  checkNicknameAvailability: (nickname: string) =>
    apiClient.get('/users/nickname-availability', { params: { nickname } }),

  // 프로필 등록 (회원가입): 아이디, 닉네임, 프로필 이미지 키, 한줄소개
  registerProfile: (data: { username: string; nickname: string; profileImageKey?: string; bio?: string }) =>
    apiClient.post('/users/me/profile', data),

  // 프로필 이미지 업로드 URL 발급
  getProfileImageUploadUrl: (data: { fileName: string; contentType: string; fileSize: number }) =>
    apiClient.post('/users/me/profile/image/presigned-url', data),

  // 회원 탈퇴 (진행 중인 거래가 있으면 409)
  withdraw: () =>
    apiClient.delete('/users/me'),

  // 내 정보 조회
  getMe: () =>
    apiClient.get('/users/me'),

  // 프로필 수정 (변경할 필드만 전달)
  updateProfile: (data: { username?: string; nickname?: string; profileImageKey?: string; bio?: string }) =>
    apiClient.patch('/users/me', data),

  // 내 판매 상품 목록 (status: ON_SALE | RESERVED | SOLD_OUT)
  getMyPosts: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get('/users/me/posts', { params }),

  // 내 판매 주문 / 구매 주문 내역 (status: PENDING | PAID | CANCELED | REFUNDED | PURCHASE_CONFIRMED)
  getSaleOrders: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get('/users/me/sale-orders', { params }),
  getPurchaseOrders: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get('/users/me/purchase-orders', { params }),

  // 다른 회원 공개 프로필 / 거래 신뢰 정보 / 판매 상품 목록
  getUser: (userId: number | string) =>
    apiClient.get(`/users/${userId}`),
  // 사용자가 받은 거래 후기
  getReviews: (userId: number | string, page = 0, size = 20) =>
    apiClient.get(`/users/${userId}/reviews`, { params: { page, size } }),
  getTrustInfo: (userId: number | string) =>
    apiClient.get(`/users/${userId}/trust-info`),
  getUserPosts: (userId: number | string, params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get(`/users/${userId}/posts`, { params }),

  // 사용자 차단 / 차단 해제 / 내 차단 목록(최신순, size 1~100)
  blockUser: (userId: number | string) =>
    apiClient.post(`/users/${userId}/block`),
  unblockUser: (userId: number | string) =>
    apiClient.delete(`/users/${userId}/block`),
  getBlocks: (page = 0, size = 100) =>
    apiClient.get('/users/me/blocks', { params: { page, size } }),

  // 팔로우 / 언팔로우
  follow: (userId: number | string) =>
    apiClient.post(`/users/${userId}/follow`),
  unfollow: (userId: number | string) =>
    apiClient.delete(`/users/${userId}/follow`),

  // 팔로워 / 팔로잉 목록 (totalElements로 개수도 확인)
  getFollowers: (userId: number, page = 0, size = 20) =>
    apiClient.get(`/users/${userId}/followers`, { params: { page, size } }),
  getFollowings: (userId: number, page = 0, size = 20) =>
    apiClient.get(`/users/${userId}/followings`, { params: { page, size } }),
};

// ─── 배송지 API ─────────────────────────────────────────────────────────────────
export interface AddressFields {
  label?: string;
  recipientName?: string;
  recipientPhone?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  deliveryMemo?: string | null;
  isDefault?: boolean;
}

export const addressAPI = {
  // 목록 (기본 배송지 우선)
  list: () => apiClient.get('/users/me/addresses'),
  // 등록 (수령인·연락처·5자리 우편번호·기본주소 필수, 첫 배송지는 자동 기본)
  create: (data: AddressFields) => apiClient.post('/users/me/addresses', data),
  // 부분 수정 (생략=보존, null=삭제, 기본 해제 단독은 409)
  update: (id: number | string, data: AddressFields) =>
    apiClient.patch(`/users/me/addresses/${id}`, data),
  // 삭제 (기본 삭제 시 서버가 다른 배송지를 기본으로 승격)
  remove: (id: number | string) => apiClient.delete(`/users/me/addresses/${id}`),
};

// ─── 상품 관련 API ──────────────────────────────────────────────────────────────
export const productAPI = {
  // 상품 목록 조회
  getPostList: (config?: AxiosRequestConfig) =>
    apiClient.get('/posts', config),

  // 최근 본 상품과 비슷한 상품 추천 (recentPostIds는 최신순 최대 20개, limit 1~20)
  getRecentlyViewedRecommendations: (recentPostIds: number[], limit = 10) =>
    apiClient.post('/posts/recommendations/recently-viewed', { recentPostIds, limit }),

  // 상품 상세 정보 조회
  getPostDetail: (productId: string | number, config?: AxiosRequestConfig) =>
    apiClient.get(`/posts/${productId}`, config),

  // 상품 등록
  createPost: (data: any, config?: AxiosRequestConfig) =>
    apiClient.post('/posts', data, config),

  // 상품 삭제 (본인 게시글)
  deletePost: (postId: string | number) =>
    apiClient.delete(`/posts/${postId}`),

  // 상품 수정
  updatePost: (postId: string | number, data: any, config?: AxiosRequestConfig) =>
    apiClient.patch(`/posts/${postId}`, data, config),

  // S3 Presigned URL 발급 (다중 파일)
  getPresignedUrls: (images: { originalFileName: string; contentType: string }[]) =>
    apiClient.post('/posts/images/presigned-urls', { images }),

  // 내 관심 상품 목록 (페이지네이션)
  getFavoritePosts: (page = 0, size = 20) =>
    apiClient.get('/users/me/favorite-posts', { params: { page, size } }),

  // 관심 상품 등록 / 해제
  addFavoritePost: (postId: string | number) =>
    apiClient.post(`/posts/${postId}/favorites`),
  removeFavoritePost: (postId: string | number) =>
    apiClient.delete(`/posts/${postId}/favorites`),
};

// ─── 주문 관련 API ──────────────────────────────────────────────────────────────
export const orderAPI = {
  // 주문 생성 (15분 홀드)
  createOrder: (data: { postId: number; amount: number; paymentMethod: string; shippingAddressId?: number; quoteId?: string }) =>
    apiClient.post('/orders', data),

  // 주문 금액 견적 (5분 유효, 상품 예약 안 함). 응답 data: { quoteId, pricing: { totalAmount, ... }, expiresAt }
  createQuote: (postId: number, shippingAddressId: number) =>
    apiClient.post('/orders/quotes', { postId, shippingAddressId }),

  // 거래 상세 조회 (orderId = ORD-로 시작하는 공개 주문번호, 구매자/판매자만 조회 가능)
  getOrder: (orderNumber: string) =>
    apiClient.get(`/orders/${orderNumber}`),

  // 송장 등록 (판매자, 결제된 주문). carrierCode: CJ_LOGISTICS | HANJIN
  registerShipment: (orderId: string, data: { carrierCode: string; trackingNumber: string }) =>
    apiClient.post(`/orders/${orderId}/shipment`, data),

  // 송장 조회 / 수정 (수정은 판매자만, 구매확정·환불 처리 중에는 불가)
  getShipment: (orderId: string) => apiClient.get(`/orders/${orderId}/shipment`),
  updateShipment: (orderId: string, data: { carrierCode: string; trackingNumber: string }) =>
    apiClient.patch(`/orders/${orderId}/shipment`, data),

  // 환불 상태 조회 (거래 당사자)
  getRefund: (orderId: string) => apiClient.get(`/orders/${orderId}/refunds`),

  // 구매 확정 (구매자, 발송 후)
  confirmPurchase: (orderId: string) =>
    apiClient.post(`/orders/${orderId}/confirm-purchase`),

  // 거래 후기 작성 (구매자·판매자 각 1회) / 조회 (거래 당사자만)
  createReview: (orderId: string, data: { rating: number; content: string }) =>
    apiClient.post(`/orders/${orderId}/reviews`, data),
  getReviews: (orderId: string) => apiClient.get(`/orders/${orderId}/reviews`),

  // 주문 취소 (구매자, 발송 전). PG 결과가 불확실하면 응답 processing=true
  cancelOrder: (orderId: string, reason: string) =>
    apiClient.post(`/orders/${orderId}/cancel`, { reason }),

  // 전액 환불 요청 (구매자). 발송 후에는 REQUESTED로 접수되어 운영자가 승인
  requestRefund: (orderId: string, amount: number, reason: string, imageIds?: number[]) =>
    apiClient.post(`/orders/${orderId}/refunds`, { amount, reason, imageIds }),

  // 반품 사진 업로드 (최대 5장, 장당 5MiB): URL 발급 → PUT(발급된 headers) → 완료 처리(READY) → imageIds로 제출
  getRefundImageUploadUrls: (
    orderId: string,
    images: { fileName: string; contentType: string; fileSize: number }[],
  ) => apiClient.post(`/orders/${orderId}/refund-images/upload-urls`, { images }),
  completeRefundImage: (orderId: string, imageId: number) =>
    apiClient.post(`/orders/${orderId}/refund-images/${imageId}/complete`),

  // 환불 요청 철회 (구매자, REQUESTED 상태만)
  withdrawRefund: (orderId: string, refundId: string) =>
    apiClient.post(`/orders/${orderId}/refunds/withdraw`, { refundId }),
};

// ─── 결제 관련 API ──────────────────────────────────────────────────────────────
export const paymentAPI = {
  // 결제 생성 (주문 번호 기준)
  createPayment: (data: { orderId: string; amount: number; paymentMethod: string }) =>
    apiClient.post('/payments', data),

  // 결제 재시도 준비 (새 attemptId·pgOrderId 발급)
  retryPayment: (paymentId: string, failedAttemptId: string) =>
    apiClient.post(`/payments/${paymentId}/retry`, { failedAttemptId }),

  // 결제 승인 (Toss SDK 완료 후 paymentKey 전달, 재시도 시 attemptId 포함)
  // 200 FAILED = 승인 거절, 202 PROCESSING = 결과 불확실 → getPayment로 반복 조회
  confirmPayment: (paymentId: string, data: { paymentKey: string; attemptId?: string }) =>
    apiClient.post(`/payments/${paymentId}/confirm`, { paymentId, ...data }),

  // 결제 상태 조회
  getPayment: (paymentId: string) =>
    apiClient.get(`/payments/${paymentId}`),

  // 결제 취소 (status가 SUCCESS일 때만 가능)
  cancelPayment: (paymentId: string) =>
    apiClient.post(`/payments/${paymentId}/cancel`),
};

// ─── 매장 관련 API ──────────────────────────────────────────────────────────────
export const storeAPI = {
  // 전국 매장 목록 (region 생략 시 전국, ID 오름차순)
  getAll: (page = 0, size = 100) =>
    apiClient.get('/stores', { params: { page, size } }),

  // 현재 위치 기준 주변 매장 조회 (반경 1/3/5km)
  getNearby: (latitude: number, longitude: number, radiusKm: 1 | 3 | 5, page = 0, size = 100) =>
    apiClient.get('/stores/nearby', { params: { latitude, longitude, radiusKm, page, size } }),

  // 선택한 매장 주변의 다른 매장 추천 (기준 매장 제외, 가까운 순, limit 1~10)
  getRecommendations: (storeId: string | number, radiusKm: 1 | 3 | 5 = 5, limit = 6) =>
    apiClient.get(`/stores/${storeId}/recommendations`, { params: { radiusKm, limit } }),

  // 매장 상세 및 운영 정보 조회
  getStore: (storeId: string | number) =>
    apiClient.get(`/stores/${storeId}`),

  // 내 관심 매장 목록 (페이지네이션)
  getFavoriteStores: (page = 0, size = 20) =>
    apiClient.get('/users/me/favorite-stores', { params: { page, size } }),

  // 관심 매장 등록 / 해제
  addFavoriteStore: (storeId: string | number) =>
    apiClient.post(`/stores/${storeId}/favorites`),
  removeFavoriteStore: (storeId: string | number) =>
    apiClient.delete(`/stores/${storeId}/favorites`),

  // 매장 리뷰: 집계 / 목록(최신순) / 사진 모아보기
  getReviewSummary: (storeId: string | number) =>
    apiClient.get(`/stores/${storeId}/reviews/summary`),
  getReviews: (storeId: string | number, page = 0, size = 20) =>
    apiClient.get(`/stores/${storeId}/reviews`, { params: { page, size } }),
  getReviewImages: (storeId: string | number, page = 0, size = 30) =>
    apiClient.get(`/stores/${storeId}/review-images`, { params: { page, size } }),

  // 리뷰 작성 (매장당 1개). imageIds는 업로드 완료된 사진 ID
  createReview: (storeId: string | number, data: { rating: number; content: string; imageIds?: number[] }) =>
    apiClient.post(`/stores/${storeId}/reviews`, data),

  // 내 리뷰 조회(미작성이면 review: null) / 수정(version 필요) / 삭제
  getMyReview: (storeId: string | number) => apiClient.get(`/stores/${storeId}/reviews/me`),
  updateReview: (
    reviewId: number,
    data: { version: number; rating: number; content: string; imageIds: number[] },
  ) => apiClient.patch(`/store-reviews/${reviewId}`, data),
  deleteReview: (reviewId: number) => apiClient.delete(`/store-reviews/${reviewId}`),

  // 리뷰 사진 업로드: URL 발급 → PUT(발급된 headers) → 완료 처리
  getReviewImageUploadUrls: (
    storeId: string | number,
    images: { fileName: string; contentType: string; fileSize: number }[],
  ) => apiClient.post(`/stores/${storeId}/review-images/upload-urls`, { images }),
  completeReviewImage: (imageId: number) =>
    apiClient.post(`/store-review-images/${imageId}/complete`),
};

// ─── 신고 관련 API ──────────────────────────────────────────────────────────────
export type ReportTargetType = 'USER' | 'POST' | 'CHAT_ROOM' | 'STORE_REVIEW';
export const reportAPI = {
  getReasons: (targetType: ReportTargetType) =>
    apiClient.get('/reports/reasons', { params: { targetType } }),
  create: (data: {
    targetType: ReportTargetType;
    targetId: number;
    reasonCode: string;
    description: string;
  }) => apiClient.post('/reports', data),
};

// ─── 검색어 관련 API ──────────────────────────────────────────────────────────────
export const searchAPI = {
  getPopular: (limit = 10) => apiClient.get('/search/popular', { params: { limit } }),
  getRelated: (keyword: string, limit = 10) =>
    apiClient.get('/search/related', { params: { keyword, limit } }),
  getRecent: () => apiClient.get('/search/recent'),
  record: (keyword: string) => apiClient.post('/search/records', { keyword }),
  deleteRecent: (recordId: number) => apiClient.delete(`/search/recent/${recordId}`),
  clearRecent: () => apiClient.delete('/search/recent'),
};

// ─── 알림 관련 API ──────────────────────────────────────────────────────────────
export const notificationAPI = {
  // 알림 목록 조회
  getNotifications: (params: { page?: number; size?: number }) =>
    apiClient.get('/notifications', { params }),

  // 알림 읽음 처리
  readNotification: (notificationId: number) =>
    apiClient.patch(`/notifications/${notificationId}/read`),

  // 모든 알림 읽음 처리
  readAllNotifications: () =>
    apiClient.patch('/notifications/read-all'),
};

// ─── 채팅 관련 API ──────────────────────────────────────────────────────────────
export const chatAPI = {
  // 채팅방 생성 (이미 존재하면 기존 방 반환)
  createChatRoom: (postId: number) =>
    apiClient.post('/chat-rooms', { postId }),

  // 내 채팅방 목록 조회
  getChatRooms: () =>
    apiClient.get('/chat-rooms'),

  // 채팅방 상세 조회 (상품 정보)
  getChatRoomDetail: (chatRoomId: number) =>
    apiClient.get(`/chat-rooms/${chatRoomId}`),

  // 메시지 이력 조회
  getMessages: (chatRoomId: number) =>
    apiClient.get(`/chat-rooms/${chatRoomId}/messages`),

  // 텍스트 메시지 전송
  sendTextMessage: (chatRoomId: number, content: string) =>
    apiClient.post(`/chat-rooms/${chatRoomId}/messages/text`, { content }),

  // [Step 1] 이미지 업로드용 Presigned URL 발급
  getImageUploadUrl: (chatRoomId: number, originalFileName: string, contentType: string) =>
    apiClient.post(`/chat-rooms/${chatRoomId}/messages/images/upload-url`, { originalFileName, contentType }),

  // [Step 3] S3 업로드 완료 후 objectKey로 이미지 메시지 저장
  saveImageMessage: (chatRoomId: number, objectKey: string) =>
    apiClient.post(`/chat-rooms/${chatRoomId}/messages/images`, { objectKey }),
};