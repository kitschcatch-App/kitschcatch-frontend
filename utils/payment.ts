/**
 * 유틸: 결제 화면용 금액 계산
 * 역할: 안심결제 이용료를 계산합니다. (docs/PURCHASE_FLOW.md 2-4)
 */

/** 안심결제 이용료 = (상품금액 + 배송비)의 5.5%, 원 단위 반올림, 최소 800원 */
export const calcSafePaymentFee = (productPrice: number, shippingFee: number): number =>
  Math.max(800, Math.round((productPrice + shippingFee) * 0.055));
