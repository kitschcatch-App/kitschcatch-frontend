import { getNotificationTarget } from '../utils/notificationTarget';

describe('getNotificationTarget', () => {
  it('채팅 알림은 숫자 chatRoomId로 변환한다', () => {
    expect(getNotificationTarget('CHAT_MESSAGE', '12')).toEqual({ screen: 'Chat', chatRoomId: 12 });
  });

  it('결제 알림은 주문번호를 문자열 그대로 유지한다', () => {
    expect(getNotificationTarget('PAYMENT_SUCCESS', 'ORD-AB12')).toEqual({ screen: 'Order', orderNumber: 'ORD-AB12' });
    expect(getNotificationTarget('PAYMENT_CANCELED', 'ORD-AB12')).toEqual({ screen: 'Order', orderNumber: 'ORD-AB12' });
  });

  it('모르는 type이거나 targetId 형식이 다르면 null', () => {
    expect(getNotificationTarget('NOTICE', '1')).toBeNull();
    expect(getNotificationTarget('CHAT_MESSAGE', 'abc')).toBeNull();
    expect(getNotificationTarget('PAYMENT_SUCCESS', '123')).toBeNull();
  });
});
