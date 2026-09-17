/**
 * 유틸: 알림 타입 라벨 매핑 (notificationType)
 * 역할: 백엔드 알림 type 코드를 화면에 표시할 한국어 라벨로 변환합니다.
 */
const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  CHAT_MESSAGE: '채팅',
  PAYMENT_SUCCESS: '구매',
  ORDER_CONFIRMED: '구매',
  FAVORITE_PRICE_DROP: '관심',
  POST_SOLD: '판매',
};

export const getNotificationTypeLabel = (type: string): string =>
  NOTIFICATION_TYPE_LABELS[type] ?? '알림';
