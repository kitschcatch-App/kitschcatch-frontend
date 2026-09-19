/**
 * 유틸: 알림 타입 라벨 매핑 (notificationType)
 * 역할: 백엔드 알림 type 코드를 화면에 표시할 한국어 라벨로 변환합니다.
 */
const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  PAYMENT_SUCCESS: '구매',
  PAYMENT_FAILED: '구매',
  CHAT_MESSAGE: '채팅',
  ORDER_CANCELED: '구매',
  SHIPMENT_REGISTERED: '구매',
  REFUND_COMPLETED: '구매',
  PURCHASE_CONFIRMED: '구매',
  SETTLEMENT_COMPLETED: '판매',
  NOTICE: '기타',
};

export const getNotificationTypeLabel = (type: string): string =>
  NOTIFICATION_TYPE_LABELS[type] ?? '알림';
