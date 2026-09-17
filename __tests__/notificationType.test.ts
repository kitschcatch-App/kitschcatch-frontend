/**
 * 테스트: 알림 타입 라벨 매핑 테스트 (notificationType.test)
 * 역할: getNotificationTypeLabel의 type 코드 → 한국어 라벨 변환을 검증합니다.
 */
import { getNotificationTypeLabel } from '../utils/notificationType';

describe('getNotificationTypeLabel', () => {
  it('알려진 type 코드를 한국어 라벨로 변환한다', () => {
    expect(getNotificationTypeLabel('PAYMENT_SUCCESS')).toBe('구매');
    expect(getNotificationTypeLabel('CHAT_MESSAGE')).toBe('채팅');
    expect(getNotificationTypeLabel('FAVORITE_PRICE_DROP')).toBe('관심');
    expect(getNotificationTypeLabel('POST_SOLD')).toBe('판매');
  });

  it('알 수 없는 type이면 기본 라벨("알림")을 반환한다', () => {
    expect(getNotificationTypeLabel('UNKNOWN_TYPE')).toBe('알림');
  });
});
