/**
 * 유틸: 결제 화면용 금액 계산
 * 역할: 안심결제 이용료를 계산합니다. (docs/PURCHASE_FLOW.md 2-4)
 */

/** 배송비 (임시 0원. 백엔드가 배송비 기본값(5,000원)을 적용하면 5000으로 복원하거나 견적 값으로 교체) */
export const SHIPPING_FEE = 0;

/** 안심결제 이용료 = (상품금액 + 배송비)의 5.5%, 원 단위 반올림, 최소 800원 */
export const calcSafePaymentFee = (productPrice: number, shippingFee: number): number =>
  Math.max(800, Math.round((productPrice + shippingFee) * 0.055));
