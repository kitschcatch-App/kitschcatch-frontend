import { calcSafePaymentFee } from '../utils/payment';

describe('calcSafePaymentFee', () => {
  it('상품 50,000 + 배송비 3,000 → 2,915원 (기획서 예시)', () => {
    expect(calcSafePaymentFee(50000, 3000)).toBe(2915);
  });
  it('계산 결과가 800원 미만이면 800원', () => {
    expect(calcSafePaymentFee(5000, 3000)).toBe(800);
  });
  it('원 단위로 반올림', () => {
    expect(calcSafePaymentFee(10001, 5000)).toBe(Math.round(15001 * 0.055));
  });
});
