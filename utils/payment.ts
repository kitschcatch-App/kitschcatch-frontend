/**
 * 유틸: 결제 화면용 금액 계산
 * 역할: 안심결제 이용료를 계산합니다. (docs/PURCHASE_FLOW.md 2-4)
 */

/** 배송비 (백엔드 GET /posts/{postId}/shipping 기준 모든 신규 거래 3,000원 고정) */
export const SHIPPING_FEE = 3000;

/** 안심결제 이용료 = (상품금액 + 배송비)의 5.5%, 원 단위 반올림, 최소 800원 */
export const calcSafePaymentFee = (productPrice: number, shippingFee: number): number =>
  Math.max(800, Math.round((productPrice + shippingFee) * 0.055));
