import { formatDateTime, formatShortDate, getBuyerOrderAction, getOrderProgress, mapOrderIdByPost, mergeRecentActivities } from '../utils/mypage';

describe('formatShortDate', () => {
  it('ISO 시각을 YY.MM.DD로 변환', () => {
    expect(formatShortDate('2026-08-21T10:00:00')).toBe('26.08.21');
  });
  it('값이 없으면 빈 문자열', () => {
    expect(formatShortDate(undefined)).toBe('');
  });
});

describe('mergeRecentActivities', () => {
  const order = (orderId: string, orderedAt: string, orderStatus = 'PAID') => ({
    orderId,
    postTitle: `상품 ${orderId}`,
    amount: 10000,
    orderStatus,
    orderedAt,
  });

  it('판매·구매를 합쳐 최신순 limit건', () => {
    const result = mergeRecentActivities(
      [order('s1', '2026-08-10T00:00:00'), order('s2', '2026-08-22T00:00:00')],
      [order('p1', '2026-08-15T00:00:00', 'PURCHASE_CONFIRMED'), order('p2', '2026-08-01T00:00:00')],
    );
    expect(result.map(r => r.id)).toEqual(['판매-s2', '구매-p1', '판매-s1']);
    expect(result[1]).toMatchObject({ orderId: 'p1', price: 10000, type: '구매', statusLabel: '구매완료', date: '26.08.15' });
  });
});

describe('getOrderProgress', () => {
  it('상태·배송 정보로 현재 단계를 계산', () => {
    expect(getOrderProgress({ status: 'PAID' }).index).toBe(0);
    expect(getOrderProgress({ status: 'PAID', shipment: { shippedAt: null } }).index).toBe(1);
    expect(getOrderProgress({ status: 'PAID', shipment: { shippedAt: '2026-08-15T10:00:00' } }).index).toBe(2);
    expect(getOrderProgress({ status: 'PURCHASE_CONFIRMED' }).index).toBe(4);
    expect(getOrderProgress({ status: 'CANCELED' })).toEqual({ index: -1, title: '주문 취소' });
  });
});

describe('formatDateTime', () => {
  it('ISO 시각을 YYYY.MM.DD  HH:mm로 변환', () => {
    expect(formatDateTime('2026-08-12T14:20:33')).toBe('2026.08.12  14:20');
  });
});

describe('mapOrderIdByPost', () => {
  it('상품별로 취소되지 않은 최신 주문을 고른다', () => {
    const orders = [
      { orderId: 'o3', postId: 1, orderStatus: 'CANCELED' },
      { orderId: 'o2', postId: 1, orderStatus: 'PAID' },
      { orderId: 'o1', postId: 1, orderStatus: 'PURCHASE_CONFIRMED' },
      { orderId: 'o4', postId: 2, orderStatus: 'CANCELED' },
    ];
    expect(mapOrderIdByPost(orders)).toEqual({ '1': 'o2' });
  });
});

describe('getBuyerOrderAction', () => {
  it('발송 전 결제 완료 → 취소', () => {
    expect(getBuyerOrderAction({ status: 'PAID' })).toBe('CANCEL');
  });
  it('발송 후 → 반품 요청', () => {
    expect(getBuyerOrderAction({ status: 'PAID', shipment: {} })).toBe('REFUND');
  });
  it('접수된 환불 → 철회, 처리 중 환불 → 없음', () => {
    expect(getBuyerOrderAction({ status: 'PAID', shipment: {}, refund: { status: 'REQUESTED' } })).toBe('WITHDRAW');
    expect(getBuyerOrderAction({ status: 'PAID', refund: { status: 'PROCESSING' } })).toBeNull();
  });
  it('취소·확정 등 종료 상태 → 없음', () => {
    expect(getBuyerOrderAction({ status: 'CANCELED' })).toBeNull();
    expect(getBuyerOrderAction({ status: 'PURCHASE_CONFIRMED' })).toBeNull();
  });
});
