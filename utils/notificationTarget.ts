/**
 * 유틸: 알림 탭 이동 대상 판별 (notificationTarget)
 * 역할: 알림 type/targetId로 이동할 곳을 정합니다. (백엔드 합의)
 *       CHAT_MESSAGE → targetId = chatRoomId(숫자 문자열)
 *       PAYMENT_SUCCESS / PAYMENT_CANCELED → targetId = 주문번호(ORD-..., 숫자로 파싱 금지)
 *       그 외·형식 불일치 → null (알림 목록에 머무름)
 */
export type NotificationTarget =
  | { screen: 'Chat'; chatRoomId: number }
  | { screen: 'Order'; orderNumber: string }
  | null;

export const getNotificationTarget = (type: string, targetId: string): NotificationTarget => {
  if (type === 'CHAT_MESSAGE') {
    return /^\d+$/.test(targetId) ? { screen: 'Chat', chatRoomId: Number(targetId) } : null;
  }
  if (type === 'PAYMENT_SUCCESS' || type === 'PAYMENT_CANCELED') {
    return targetId.startsWith('ORD-') ? { screen: 'Order', orderNumber: targetId } : null;
  }
  return null;
};
