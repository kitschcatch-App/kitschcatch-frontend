/**
 * 상수: 에러 메시지 (errorMessages)
 * 역할: 시스템, 인증, 상품, 채팅 등 앱 전반에서 공통으로 사용되는 에러 메시지 텍스트를 정의합니다.
 */
export const ERROR_MESSAGES = {
  SYSTEM: {
    NETWORK:   { title: '인터넷 연결을 확인해주세요',       subtitle: '네트워크 상태가 불안정해요.' },
    TEMPORARY: { title: '일시적인 오류가 발생했어요',       subtitle: '잠시 후 다시 시도해주세요.' },
    UNKNOWN:   { title: '문제가 발생했어요',                subtitle: '요청을 처리하지 못했어요.' },
  },
  AUTH: {
    CANCELLED: { title: '로그인이 취소되었어요',            subtitle: '카카오 로그인이 중단되었어요.' },
    NETWORK:   { title: '인터넷 연결을 확인해주세요',       subtitle: '네트워크 상태가 불안정해요.' },
    FAILED:    { title: '로그인 처리 중 오류가 발생했어요', subtitle: '잠시 후 다시 시도해주세요.' },
  },
  PRODUCT: {
    IMAGE_UPLOAD:    { title: '이미지를 업로드하지 못했어요',  subtitle: '네트워크 상태를 확인한 뒤 다시 시도해주세요.' },
    MISSING_FIELDS:  { title: '입력되지 않은 항목이 있어요',   subtitle: '상품 정보를 모두 입력해주세요.' },
    REGISTER_FAILED: { title: '상품 등록에 실패했어요',        subtitle: '잠시 후 다시 시도해주세요.' },
  },
  PRODUCT_DETAIL: {
    SOLD_OUT:    { title: '이미 판매 완료된 상품이에요',    subtitle: '다른 상품을 둘러보세요.' },
    DELETED:     { title: '삭제된 상품이에요',              subtitle: '더 이상 확인할 수 없어요.' },
    UNAVAILABLE: { title: '현재 거래할 수 없는 상품이에요', subtitle: '판매 상태를 확인해주세요.' },
  },
  CHAT: {
    SEND_FAILED: { title: '메시지를 보내지 못했어요', subtitle: '네트워크 상태를 확인해주세요.' },
  },
} as const;

export type ErrorMessage = { title: string; subtitle: string };
