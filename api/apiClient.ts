/**
 * 파일: apiClient.ts
 * 역할: axios를 사용하여 네트워크 요청(API 연동) 공통 로직을 모듈화한 파일입니다.
 */
import axios, { AxiosRequestConfig } from 'axios';

// 안드로이드 에뮬레이터 로컬 백엔드 연동 주소 (10.0.2.2)
// 실기기나 iOS 등 환경에 따라 나중에는 환경변수(.env)로 분리하는 것이 좋습니다.
const BASE_URL = 'http://10.0.2.2:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 도메인별 API 함수 모듈화 (예: 상품 관련)
export const productAPI = {
  // 상품 목록 조회
  getPostList: (config?: AxiosRequestConfig) => 
    apiClient.get('/post/', config),

  // 상품 상세 정보 조회
  getPostDetail: (productId: string | number, config?: AxiosRequestConfig) => 
    apiClient.get(`/post/${productId}`, config),

  // 상품 등록
  createPost: (data: any, config?: AxiosRequestConfig) =>
    apiClient.post('/post', data, config),

  // 상품 수정
  updatePost: (postId: string | number, data: any, config?: AxiosRequestConfig) =>
    apiClient.patch(`/post/${postId}`, data, config),
};