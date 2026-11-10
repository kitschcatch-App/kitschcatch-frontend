// 고정 배송비 견적의 무결성과 기존 주문 금액 보존을 검증한다.
import {
  mockPricing,
  orderAmounts,
  requireCheckoutPricing,
} from '../utils/payment';

describe('주문 금액', () => {
  it('상품 30,000원은 배송비 3,000원을 포함해 33,000원이고 구매자 수수료는 없다', () => {
    expect(requireCheckoutPricing(mockPricing(30000))).toMatchObject({
      productAmount: 30000,
      shippingAmount: 3000,
      totalAmount: 33000,
      buyerFeeAmount: 0,
      sellerFeeAmount: 1500,
      sellerPayoutAmount: 31500,
    });
  });
  it.each([
    { shippingAmount: 0 },
    { shippingAmount: 5000 },
    { totalAmount: 30000 },
    { buyerFeeAmount: 800 },
    { productAmount: NaN },
    { totalAmount: '33000' },
  ])('잘못된 견적으로 결제를 열지 않는다: %p', patch => {
    expect(() =>
      requireCheckoutPricing({ ...mockPricing(30000), ...patch } as any),
    ).toThrow();
  });
  it('기존 주문에는 3,000원을 소급해서 더하지 않는다', () => {
    expect(orderAmounts({ amount: 30000, pricing: null }).totalAmount).toBe(
      30000,
    );
    expect(
      orderAmounts({
        amount: 35000,
        pricing: {
          ...mockPricing(30000),
          shippingAmount: 5000,
          totalAmount: 35000,
        },
      }),
    ).toMatchObject({ shippingAmount: 5000, totalAmount: 35000 });
  });
});
