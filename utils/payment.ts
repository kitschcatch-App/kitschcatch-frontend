// 서버 견적과 주문에 저장된 금액을 결제·내역 화면에서 일관되게 사용한다.
export const SHIPPING_FEE = 3000;

export type PriceBreakdown = {
  currency: string;
  pricingPolicyVersion: string;
  productAmount: number;
  shippingAmount: number;
  buyerFeeAmount: number;
  totalAmount: number;
  sellerFeeAmount: number;
  sellerPayoutAmount: number;
};
export type OrderQuote = {
  quoteId: string;
  pricing: PriceBreakdown;
  expiresAt: string;
};

export const requireCheckoutPricing = (
  pricing: PriceBreakdown | null | undefined,
): PriceBreakdown => {
  if (
    !pricing ||
    pricing.currency !== 'KRW' ||
    ![
      pricing.productAmount,
      pricing.shippingAmount,
      pricing.buyerFeeAmount,
      pricing.totalAmount,
      pricing.sellerFeeAmount,
      pricing.sellerPayoutAmount,
    ].every(Number.isSafeInteger) ||
    pricing.productAmount <= 0 ||
    pricing.shippingAmount !== SHIPPING_FEE ||
    pricing.buyerFeeAmount !== 0 ||
    pricing.totalAmount !== pricing.productAmount + pricing.shippingAmount ||
    pricing.totalAmount >= 1_000_000_000 ||
    pricing.sellerFeeAmount !== Math.floor((pricing.productAmount * 5) / 100) ||
    pricing.sellerPayoutAmount !== pricing.totalAmount - pricing.sellerFeeAmount
  ) {
    throw new Error('결제 금액을 확인할 수 없습니다. 다시 조회해주세요.');
  }
  return pricing;
};

// 미리보기는 Mock 모드에서만 사용하며 실제 청구는 서버 견적으로만 진행한다.
export const mockPricing = (productAmount: number): PriceBreakdown => {
  const sellerFeeAmount = Math.floor((productAmount * 5) / 100);
  return {
    currency: 'KRW',
    pricingPolicyVersion: 'MOCK',
    productAmount,
    shippingAmount: SHIPPING_FEE,
    buyerFeeAmount: 0,
    totalAmount: productAmount + SHIPPING_FEE,
    sellerFeeAmount,
    sellerPayoutAmount: productAmount + SHIPPING_FEE - sellerFeeAmount,
  };
};

export const orderAmounts = (order: {
  amount: number;
  pricing?: PriceBreakdown | null;
}) => {
  // 기존 주문은 현재 정책으로 다시 계산하지 않는다.
  if (order.pricing && order.pricing.totalAmount === order.amount)
    return order.pricing;
  return {
    productAmount: order.amount,
    shippingAmount: 0,
    buyerFeeAmount: 0,
    totalAmount: order.amount,
  };
};
