/**
 * 유틸: 마이페이지 계열 화면(마이페이지·판매내역·구매내역)용 변환 함수
 * 역할: 서버 응답(상태 enum, ISO 시각)을 화면 표시용 값으로 바꿉니다.
 */

/** ISO 시각 → 'YY.MM.DD' */
export const formatShortDate = (iso?: string | null): string =>
  iso ? `${iso.slice(2, 4)}.${iso.slice(5, 7)}.${iso.slice(8, 10)}` : '';

/** 내 상품(productStatus) → 판매내역 라벨 */
export const POST_STATUS_LABEL: Record<string, string> = {
  ON_SALE: '상품등록',
  RESERVED: '거래중',
  SOLD_OUT: '판매완료',
};

/** 주문(orderStatus) → 구매내역·최근활동 라벨 */
export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: '결제대기',
  PAID: '거래중',
  PURCHASE_CONFIRMED: '구매완료',
  CANCELED: '취소',
  REFUNDED: '환불',
};

export interface RecentActivity {
  id: string;
  orderId: string;
  price: number;
  title: string;
  type: '구매' | '판매';
  statusLabel: string;
  date: string;
  orderedAt: string;
}

interface OrderSummary {
  orderId: string;
  postTitle: string;
  amount: number;
  orderStatus: string;
  orderedAt: string;
}

/** 판매·구매 주문을 합쳐 최신순으로 limit건만 반환 */
export const mergeRecentActivities = (
  sales: OrderSummary[],
  purchases: OrderSummary[],
  limit = 3,
): RecentActivity[] => {
  const toActivity = (o: OrderSummary, type: '구매' | '판매'): RecentActivity => ({
    id: `${type}-${o.orderId}`,
    orderId: o.orderId,
    price: o.amount,
    title: o.postTitle,
    type,
    statusLabel: ORDER_STATUS_LABEL[o.orderStatus] ?? o.orderStatus,
    date: formatShortDate(o.orderedAt),
    orderedAt: o.orderedAt,
  });
  return [...sales.map(o => toActivity(o, '판매')), ...purchases.map(o => toActivity(o, '구매'))]
    .sort((a, b) => b.orderedAt.localeCompare(a.orderedAt))
    .slice(0, limit);
};

/** ISO 시각 → 'YYYY.MM.DD  HH:mm' */
export const formatDateTime = (iso?: string | null): string =>
  iso ? `${iso.slice(0, 4)}.${iso.slice(5, 7)}.${iso.slice(8, 10)}  ${iso.slice(11, 16)}` : '';

/** 서버가 지원하는 택배사 (carrierCode ↔ 화면 표시명) */
export const CARRIERS: { code: string; label: string }[] = [
  { code: 'CJ_LOGISTICS', label: 'CJ대한통운' },
  { code: 'HANJIN', label: '한진택배' },
];

/** 주문 상세의 5단계(결제 완료·배송 준비·배송 중·배송 완료·구매 확정) 중 현재 단계. 취소·환불은 단계 밖이라 index -1 */
export const getOrderProgress = (order: {
  status: string;
  shipment?: { shippedAt?: string | null } | null;
}): { index: number; title?: string } => {
  switch (order.status) {
    case 'PENDING':
      return { index: -1, title: '결제 대기' };
    case 'CANCELED':
      return { index: -1, title: '주문 취소' };
    case 'REFUNDED':
      return { index: -1, title: '환불 완료' };
    case 'PURCHASE_CONFIRMED':
      return { index: 4 };
    default: // PAID
      // ponytail: 배송 완료(3)는 서버에 배송 완료 시각이 없어 구분 불가. 구매 확정 전까지 '배송 중'으로 표시.
      return { index: order.shipment ? (order.shipment.shippedAt ? 2 : 1) : 0 };
  }
};

/** 구매자 주문 상세 하단 버튼: 발송 전 취소 / 발송 후 환불(반품) 요청 / 접수된 환불 철회 */
export const getBuyerOrderAction = (order: {
  status: string;
  shipment?: unknown;
  refund?: { status?: string } | null;
}): 'CANCEL' | 'REFUND' | 'WITHDRAW' | null => {
  if (order.status !== 'PAID') return null;
  if (order.refund?.status === 'REQUESTED') return 'WITHDRAW';
  if (order.refund?.status === 'PROCESSING') return null;
  return order.shipment ? 'REFUND' : 'CANCEL';
};

/** 판매 주문 목록(최신순)에서 상품별로 취소 안 된 가장 최근 주문의 orderId를 찾는다 */
export const mapOrderIdByPost = (
  saleOrders: { orderId: string; postId: number; orderStatus: string }[],
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const o of saleOrders) {
    const key = String(o.postId);
    if (!(key in result) && o.orderStatus !== 'CANCELED') result[key] = o.orderId;
  }
  return result;
};
