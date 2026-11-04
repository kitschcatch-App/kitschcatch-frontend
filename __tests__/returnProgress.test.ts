import { getReturnProgress, parseRefundReason } from '../utils/mypage';

describe('getReturnProgress', () => {
  it('환불 요청 접수는 0단계', () => {
    expect(getReturnProgress({ status: 'PAID', refund: { status: 'REQUESTED' } })).toBe(0);
  });
  it('회수 진행은 2단계', () => {
    expect(getReturnProgress({ status: 'PAID', refund: { status: 'PROCESSING' } })).toBe(2);
  });
  it('환불 완료 주문은 3단계', () => {
    expect(getReturnProgress({ status: 'REFUNDED' })).toBe(3);
  });
  it('반품 건이 아니면 -1', () => {
    expect(getReturnProgress({ status: 'PAID', refund: null })).toBe(-1);
  });
});

describe('parseRefundReason', () => {
  it('[사유] 내용 형식에서 사유만 추출한다', () => {
    expect(parseRefundReason('[오배송] 다른 상품이 왔어요')).toBe('오배송');
  });
  it('형식이 아니면 원문, 없으면 빈 문자열', () => {
    expect(parseRefundReason('단순 변심')).toBe('단순 변심');
    expect(parseRefundReason(undefined)).toBe('');
  });
});
