/**
 * 파일: mockData.ts
 * 역할: 백엔드 미연결 상태에서 ApiTestScreen의 Mock 모드에 사용할 가상 응답 데이터입니다.
 *       실제 백엔드가 반환할 응답 구조(success / data)를 그대로 모방합니다.
 */

// ─── 공통 Mock 지연 시뮬레이터 ──────────────────────────────────────────────
// 실제 네트워크 응답처럼 300~700ms 지연을 줍니다.
export const mockDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Auth ──────────────────────────────────────────────────────────────────

export const MOCK_NONCE = {
  status: 200,
  data: {
    success: true,
    data: {
      nonce: 'mock-nonce-k1tsch4tch-abc123',
    },
  },
};

// ─── 상품 목록 ──────────────────────────────────────────────────────────────

export const MOCK_POST_LIST = {
  status: 200,
  data: {
    success: true,
    data: {
      content: [
        {
          id: 1,
          title: '반프레스토 귀멸의 칼날 무이치로 피규어',
          price: 120000,
          description: '새상품 미개봉입니다. 구입 후 보관만 했습니다.',
          productCategory: 'ANIME_MANGA',
          productCondition: 'NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/101/400/400',
              imageKey: 'products/mock-key-001.jpg',
              sortOrder: 0,
            },
          ],
          sellerId: 42,
          sellerNickname: '김민영',
          createdAt: '2026-05-20T10:00:00',
        },
        {
          id: 2,
          title: '홀로라이브 제일복권 보탄 아크릴스탠드',
          price: 35000,
          description: '개봉만 했습니다. 상태 최상.',
          productCategory: 'GOODS',
          productCondition: 'LIKE_NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/102/400/400',
              imageKey: 'products/mock-key-002.jpg',
              sortOrder: 0,
            },
          ],
          sellerId: 7,
          sellerNickname: '굿즈헌터',
          createdAt: '2026-05-21T14:30:00',
        },
        {
          id: 3,
          title: '주술회전 고죠 사토루 피규어 (프라이즈)',
          price: 58000,
          description: '택배 거래 가능. 포장 꼼꼼하게 해드립니다.',
          productCategory: 'ANIME_MANGA',
          productCondition: 'USED',
          productStatus: 'RESERVED',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/103/400/400',
              imageKey: 'products/mock-key-003.jpg',
              sortOrder: 0,
            },
          ],
          sellerId: 15,
          sellerNickname: '오타쿠창고',
          createdAt: '2026-05-22T09:15:00',
        },
        {
          id: 4,
          title: '스텔라이브 아카네 리제 빵떡 쿠션',
          price: 135000,
          description: '미개봉 새상품입니다.',
          productCategory: 'GOODS',
          productCondition: 'NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/104/400/400',
              imageKey: 'products/mock-key-004.jpg',
              sortOrder: 0,
            },
          ],
          sellerId: 3,
          sellerNickname: '키치캐치셀러',
          createdAt: '2026-05-23T18:00:00',
        },
        {
          id: 5,
          title: '에반게리온 초호기 MG 프라모델',
          price: 89000,
          description: '조립 완성품. 사진 참고해주세요.',
          productCategory: 'ANIME_MANGA',
          productCondition: 'USED',
          productStatus: 'SOLD_OUT',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/105/400/400',
              imageKey: 'products/mock-key-005.jpg',
              sortOrder: 0,
            },
          ],
          sellerId: 22,
          sellerNickname: '건프라마니아',
          createdAt: '2026-05-24T11:45:00',
        },
        {
          id: 6,
          title: '스파이패밀리 아냐 굿즈 세트 (사진 여러장)',
          price: 42000,
          description: '아크릴스탠드, 키링, 뱃지 세트로 판매합니다. 개별 상태는 사진 참고해주세요.',
          productCategory: 'GOODS',
          productCondition: 'LIKE_NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/201/400/400',
              imageKey: 'products/mock-key-006-1.jpg',
              sortOrder: 0,
            },
            {
              imageUrl: 'https://picsum.photos/id/202/400/400',
              imageKey: 'products/mock-key-006-2.jpg',
              sortOrder: 1,
            },
            {
              imageUrl: 'https://picsum.photos/id/203/400/400',
              imageKey: 'products/mock-key-006-3.jpg',
              sortOrder: 2,
            },
            {
              imageUrl: 'https://picsum.photos/id/204/400/400',
              imageKey: 'products/mock-key-006-4.jpg',
              sortOrder: 3,
            },
          ],
          sellerId: 8,
          sellerNickname: '민영샵',
          createdAt: '2026-05-26T09:00:00',
        },
      ],
      totalPages: 1,
      totalElements: 6,
      number: 0,
      size: 6,
    },
  },
};

// ─── 상품 상세 (ID별 분기) ───────────────────────────────────────────────────

export const getMockPostDetail = (productId: string | number) => {
  // id 6번은 이미지 캐러셀(여러 장) 동작을 확인하기 위한 Mock 상품입니다.
  if (Number(productId) === 6) {
    const listItem = MOCK_POST_LIST.data.data.content.find(p => p.id === 6)!;
    return {
      status: 200,
      data: {
        success: true,
        data: { ...listItem },
      },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      data: {
        id: Number(productId),
        title: `[Mock] 상품 ID ${productId} 상세`,
        price: 50000,
        description:
          `이것은 ID ${productId}에 대한 Mock 상세 데이터입니다.\n` +
          '직거래 및 택배 거래 모두 가능합니다.\n' +
          '상태: 사용감 적음 / 포장 꼼꼼히 해드립니다.',
        productCategory: 'GOODS',
        productCondition: 'LIKE_NEW',
        productStatus: 'ON_SALE',
        images: [
          {
            imageUrl: `https://picsum.photos/id/${100 + Number(productId)}/400/400`,
            imageKey: `products/mock-detail-key-${productId}.jpg`,
            sortOrder: 0,
          },
        ],
        sellerId: 42,
        sellerNickname: '김민영',
        createdAt: '2026-05-25T10:00:00',
      },
    },
  };
};

// ─── Presigned URL ───────────────────────────────────────────────────────────

export const MOCK_PRESIGNED_URLS = {
  status: 200,
  data: {
    success: true,
    data: {
      images: [
        {
          uploadUrl:
            'https://mock-bucket.s3.ap-northeast-2.amazonaws.com/products/mock-upload-key.jpg' +
            '?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MOCK&X-Amz-Signature=mocksig',
          imageKey: 'products/mock-upload-key.jpg',
          imageUrl:
            'https://mock-bucket.s3.ap-northeast-2.amazonaws.com/products/mock-upload-key.jpg',
        },
      ],
    },
  },
};

// ─── 상품 등록 ──────────────────────────────────────────────────────────────

export const MOCK_CREATE_POST = {
  status: 201,
  data: {
    success: true,
    data: {
      id: 999,
      title: '[테스트] API 테스트 상품',
      description: '이것은 ApiTestScreen에서 생성된 테스트 상품입니다.',
      price: 1000,
      productCategory: 'ETC',
      productCondition: 'NEW',
      productStatus: 'ON_SALE',
      images: [],
      sellerId: 30,
      sellerNickname: '김민영',
      createdAt: new Date().toISOString(),
    },
  },
};

// ─── 상품 수정 ──────────────────────────────────────────────────────────────

export const getMockUpdatePost = (postId: string | number) => ({
  status: 200,
  data: {
    success: true,
    data: {
      id: Number(postId),
      productStatus: 'ON_SALE',
      updatedAt: new Date().toISOString(),
    },
  },
});

// ─── 주문 생성 ──────────────────────────────────────────────────────────────

export const getMockCreateOrder = (postId: number, amount: number) => ({
  status: 201,
  data: {
    success: true,
    data: {
      id: 100,
      postId,
      userId: 5,
      amount,
      orderStatus: 'PENDING',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
});

// ─── 결제 생성 ──────────────────────────────────────────────────────────────

export const getMockCreatePayment = (orderId: number, method: string, amount: number) => ({
  status: 201,
  data: {
    success: true,
    data: {
      paymentId: 1,
      orderId,
      pgOrderId: `KC-PAY-mock-${Date.now()}`,
      amount,
      method,
      status: 'READY',
      orderName: '[Mock] 키치캐치 상품',
      clientKey: 'test_ck_0RnYX2w532eykEy9vvAk8NeyqApQ',
      successUrl: 'http://10.0.2.2:8080/payment/success',
      failUrl: 'http://10.0.2.2:8080/payment/fail',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
});


// ─── 매장 (주변 매장) ────────────────────────────────────────────────────────

// 기준 좌표 주변에 흩뿌려 놓은 가상 매장. 지도 마커 동작 확인용.
const MOCK_STORE_SEEDS = [
  { name: '애니메이트 홍대점', dLat: 0.004, dLng: 0.005, address: '서울 마포구 양화로 188 AK&홍대 5층', phoneNumber: '02-337-1420', businessStatus: 'OPEN', businessHours: '10:00 - 22:00', isFavorite: true },
  { name: 'Play ONE PIECE 강남', dLat: -0.006, dLng: 0.003, address: '서울 강남구 강남대로 420 지하 1층', phoneNumber: '02-501-7700', businessStatus: 'OPEN', businessHours: '11:00 - 21:00', isFavorite: false },
  { name: '가챠샵 신촌점', dLat: 0.012, dLng: -0.01, address: '서울 서대문구 연세로 12', phoneNumber: null, businessStatus: 'CLOSED', businessHours: '12:00 - 20:00', isFavorite: false },
  { name: '피규어프레소', dLat: -0.018, dLng: -0.009, address: '서울 용산구 한강대로 23길 55', phoneNumber: '02-790-3355', businessStatus: 'OPEN', businessHours: '13:00 - 22:00', isFavorite: true },
  { name: '오타쿠창고 성수', dLat: 0.03, dLng: 0.025, address: '서울 성동구 아차산로 17', phoneNumber: '02-460-1200', businessStatus: 'UNKNOWN', businessHours: null, isFavorite: false },
];

const haversineKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s));
};

export const getMockNearbyStores = (
  coord: { latitude: number; longitude: number },
  radiusKm: number,
) => {
  const stores = MOCK_STORE_SEEDS.map((seed, index) => {
    const latitude = coord.latitude + seed.dLat;
    const longitude = coord.longitude + seed.dLng;
    return {
      storeId: `mock-store-${index + 1}`,
      name: seed.name,
      latitude,
      longitude,
      address: seed.address,
      phoneNumber: seed.phoneNumber,
      businessStatus: seed.businessStatus,
      businessHours: seed.businessHours,
      isFavorite: seed.isFavorite,
      distanceKm: Number(
        haversineKm(coord.latitude, coord.longitude, latitude, longitude).toFixed(2),
      ),
    };
  }).filter((store) => store.distanceKm <= radiusKm);

  return {
    status: 200,
    data: {
      success: true,
      data: stores,
    },
  };
};


// ─── 알림 ────────────────────────────────────────────────────────────────────

// 읽음 처리 결과가 NotificationScreen과 HomeScreen(미읽음 배지) 양쪽에 반영되도록
// 모듈 레벨의 공유 상태로 관리합니다.
let mockNotificationList: {
  id: number;
  type: 'CHAT_MESSAGE' | 'PAYMENT_SUCCESS' | 'PAYMENT_CANCELED';
  title: string;
  targetId: string;
  createdAt: string;
  readAt: string | null;
}[] = [
  { id: 4, type: 'CHAT_MESSAGE', title: '새 메시지가 도착했어요', targetId: '1', createdAt: '2026-09-17T10:20:00', readAt: null },
  { id: 3, type: 'PAYMENT_SUCCESS', title: '결제가 완료되었습니다.', targetId: 'ORD-3', createdAt: '2026-09-17T09:00:00', readAt: null },
  { id: 2, type: 'PAYMENT_CANCELED', title: '결제가 취소되었습니다.', targetId: 'ORD-2', createdAt: '2026-09-16T21:40:00', readAt: '2026-09-16T22:00:00' },
  { id: 1, type: 'PAYMENT_SUCCESS', title: '결제가 완료되었습니다.', targetId: 'ORD-1', createdAt: '2026-09-15T13:10:00', readAt: '2026-09-15T14:00:00' },
];

export const getMockUnreadNotificationCount = () =>
  mockNotificationList.filter((item) => !item.readAt).length;

// GET /notifications 응답 (Swagger 스펙: notifications/unreadCount, unreadOnly 파라미터 없음)
export const getMockNotifications = (params: { page?: number; size?: number }) => {
  const { page = 0, size = 20 } = params;
  const totalElements = mockNotificationList.length;

  return {
    status: 200,
    data: {
      success: true,
      data: {
        notifications: mockNotificationList.slice(page * size, page * size + size),
        page,
        size,
        totalElements,
        totalPages: Math.max(1, Math.ceil(totalElements / size)),
        unreadCount: getMockUnreadNotificationCount(),
      },
    },
  };
};

export const markMockNotificationRead = (notificationId: number) => {
  mockNotificationList = mockNotificationList.map((item) =>
    item.id === notificationId && !item.readAt ? { ...item, readAt: new Date().toISOString() } : item,
  );

  return { status: 200, data: { success: true, data: {} } };
};

// ─── 채팅 ────────────────────────────────────────────────────────────────────

export const MOCK_MY_USER_ID = 1;

export const MOCK_CHAT_ROOMS = {
  status: 200,
  data: [
    {
      chatRoomId: 1,
      opponentId: 52,
      opponentNickname: '잘자는고양이',
      lastMessageContent: '네 내일 오후에 직거래 가능해요!',
      lastMessageAt: '2026-05-30T10:30:00',
      unreadCount: 0,
    },
    {
      chatRoomId: 2,
      opponentId: 7,
      opponentNickname: '못자는 강아지',
      lastMessageContent: '상품 아직 판매 중인가요?',
      lastMessageAt: '2026-05-29T18:45:00',
      unreadCount: 3,
    },
  ],
};

export const getMockChatRoomDetail = (chatRoomId: number) => {
  const details: Record<number, { postTitle: string; postThumbnailImageUrl: string }> = {
    1: {
      postTitle: '반프레스토 귀멸의 칼날 무이치로 피규어',
      postThumbnailImageUrl: 'https://picsum.photos/id/101/400/400',
    },
    2: {
      postTitle: '홀로라이브 제일복권 보탄 아크릴스탠드',
      postThumbnailImageUrl: 'https://picsum.photos/id/102/400/400',
    },
  };
  return {
    status: 200,
    data: details[chatRoomId] ?? {
      postTitle: `[Mock] 채팅방 ${chatRoomId}`,
      postThumbnailImageUrl: `https://picsum.photos/id/${100 + chatRoomId}/400/400`,
    },
  };
};

export const getMockMessages = (chatRoomId: number) => {
  const messageMap: Record<number, any[]> = {
    1: [
      {
        messageId: 1, chatRoomId: 1, senderId: 52, senderNickname: '졸린코끼리',
        messageType: 'TEXT', content: '안녕하세요, 피규어 아직 판매 중인가요?',
        imageUrl: null, isRead: true, createdAt: '2026-05-30T10:00:00',
      },
      {
        messageId: 2, chatRoomId: 1, senderId: MOCK_MY_USER_ID, senderNickname: '나',
        messageType: 'TEXT', content: '네! 아직 판매 중입니다 :)',
        imageUrl: null, isRead: true, createdAt: '2026-05-30T10:05:00',
      },
      {
        messageId: 3, chatRoomId: 1, senderId: 52, senderNickname: '졸린코끼리',
        messageType: 'TEXT', content: '가격 네고 가능할까요? 10만원에 거래 가능한가요?',
        imageUrl: null, isRead: true, createdAt: '2026-05-30T10:10:00',
      },
      {
        messageId: 4, chatRoomId: 1, senderId: MOCK_MY_USER_ID, senderNickname: '나',
        messageType: 'TEXT', content: '죄송해요, 가격은 고정이에요. 배송비 포함 12만원입니다.',
        imageUrl: null, isRead: true, createdAt: '2026-05-30T10:15:00',
      },
      {
        messageId: 5, chatRoomId: 1, senderId: 52, senderNickname: '졸린코끼리',
        messageType: 'TEXT', content: '네 내일 오후에 직거래 가능해요!',
        imageUrl: null, isRead: true, createdAt: '2026-05-30T10:30:00',
      },
    ],
    2: [
      {
        messageId: 10, chatRoomId: 2, senderId: 7, senderNickname: '굿즈헌터',
        messageType: 'TEXT', content: '상품 아직 판매 중인가요?',
        imageUrl: null, isRead: false, createdAt: '2026-05-29T18:45:00',
      },
    ],
  };
  return {
    status: 200,
    data: messageMap[chatRoomId] ?? [],
  };
};

export const getMockCreateChatRoom = (postId: number) => {
  const sellerNicknameMap: Record<number, string> = {
    1: '졸린코끼리',
    2: '굿즈헌터',
    3: '오타쿠창고',
    4: '키치캐치셀러',
    5: '건프라마니아',
  };
  return {
    status: 201,
    data: {
      chatRoomId: postId,
      sellerNickname: sellerNicknameMap[postId] ?? `판매자${postId}`,
    },
  };
};

// ─── 마이페이지 / 주문 / 다른 사용자 (axios 어댑터용) ────────────────────────────
// Mock 모드에서 mock 분기가 없는 화면(마이페이지·팔로우·판매/구매내역·주문상세·타 사용자)이
// 그대로 실제 API 경로를 호출해도 동작하도록, 경로별 응답을 돌려줍니다.

const ok = (data: unknown) => ({ success: true, data });
const page = (content: unknown[]) => ok({ content, totalElements: content.length, totalPages: 1, number: 0, size: 100 });

const MOCK_ME = { id: MOCK_MY_USER_ID, username: 'minyoung', nickname: '김민영', bio: '서브컬처 굿즈 모으는 중!', profileImageUrl: 'https://picsum.photos/id/64/200/200' };
const MOCK_FOLLOW_USERS = [
  { id: 7, nickname: '굿즈헌터', profileImageUrl: 'https://picsum.photos/id/65/200/200' },
  { id: 15, nickname: '오타쿠창고', profileImageUrl: null },
  { id: 22, nickname: '건프라마니아', profileImageUrl: null },
];

const POSTS = MOCK_POST_LIST.data.data.content;
// 판매(sale)/구매(purchase) 주문. 송장 등록·구매확정·취소·환불 요청이 상태에 반영되도록 모듈 상태로 관리한다.
// ORD-1 송장 등록 전 / ORD-3 발송 전(취소 가능) / ORD-6 발송 후(구매확정·반품) / ORD-7 환불 요청 중(철회 가능)
interface MockOrder {
  side: 'sale' | 'purchase';
  orderId: string;
  postId: number;
  orderStatus: string;
  orderedAt: string;
  shipment: { carrierName: string; trackingNumber: string; shippedAt: string } | null;
  refund: { refundId: string; status: string; reason?: string } | null;
}
const SHIPPED = { carrierName: 'CJ대한통운', trackingNumber: '123456789012', shippedAt: '2026-10-06T09:00:00' };
const mockOrders: MockOrder[] = [
  { side: 'sale', orderId: 'ORD-1', postId: 3, orderStatus: 'PAID', orderedAt: '2026-10-20T13:10:00', shipment: null, refund: null },
  { side: 'sale', orderId: 'ORD-2', postId: 5, orderStatus: 'PURCHASE_CONFIRMED', orderedAt: '2026-10-10T09:00:00', shipment: SHIPPED, refund: null },
  { side: 'purchase', orderId: 'ORD-3', postId: 2, orderStatus: 'PAID', orderedAt: '2026-10-22T10:20:00', shipment: null, refund: null },
  { side: 'purchase', orderId: 'ORD-6', postId: 4, orderStatus: 'PAID', orderedAt: '2026-10-18T15:00:00', shipment: SHIPPED, refund: null },
  { side: 'purchase', orderId: 'ORD-7', postId: 6, orderStatus: 'PAID', orderedAt: '2026-10-15T12:00:00', shipment: SHIPPED, refund: { refundId: 'RF-1', status: 'REQUESTED' } },
  { side: 'purchase', orderId: 'ORD-4', postId: 1, orderStatus: 'PURCHASE_CONFIRMED', orderedAt: '2026-10-05T18:00:00', shipment: SHIPPED, refund: null },
  { side: 'purchase', orderId: 'ORD-5', postId: 5, orderStatus: 'CANCELED', orderedAt: '2026-10-01T11:00:00', shipment: null, refund: null },
  { side: 'purchase', orderId: 'ORD-8', postId: 3, orderStatus: 'REFUNDED', orderedAt: '2026-09-28T10:00:00', shipment: SHIPPED, refund: { refundId: 'RF-2', status: 'COMPLETED', reason: '[상품에 문제가 있음] 상품에 흠집이 있어요' } },
];
const postOf = (id: number) => POSTS.find(p => p.id === id)!;
const toSummary = (o: MockOrder) => ({
  orderId: o.orderId,
  postId: o.postId,
  postTitle: postOf(o.postId).title,
  amount: postOf(o.postId).price,
  orderStatus: o.orderStatus,
  orderedAt: o.orderedAt,
});
const ordersOf = (side: MockOrder['side']) => page(mockOrders.filter(o => o.side === side).map(toSummary));

const getMockOrderDetail = (orderId: string) => {
  const o = mockOrders.find(x => x.orderId === orderId) ?? mockOrders[2];
  const post = postOf(o.postId);
  return ok({
    orderId: o.orderId,
    status: o.orderStatus,
    amount: post.price,
    post: { id: post.id, title: post.title, thumbnailUrl: post.images[0].imageUrl },
    payment: { method: 'CARD', approvedAt: o.orderedAt },
    shipment: o.shipment,
    refund: o.refund,
  });
};

const CARRIER_NAMES: Record<string, string> = { CJ_LOGISTICS: 'CJ대한통운', HANJIN: '한진택배' };

/** 주문 변경 요청(송장 등록·구매확정·취소·환불 요청/철회)을 mock 주문 상태에 반영 */
const mutateMockOrder = (orderId: string, action: string, body: any) => {
  const o = mockOrders.find(x => x.orderId === orderId);
  if (!o) return undefined;
  if (action === 'shipment') {
    o.shipment = { carrierName: CARRIER_NAMES[body?.carrierCode] ?? '택배사', trackingNumber: body?.trackingNumber ?? '', shippedAt: new Date().toISOString() };
  } else if (action === 'confirm-purchase') o.orderStatus = 'PURCHASE_CONFIRMED';
  else if (action === 'cancel') o.orderStatus = 'CANCELED';
  else if (action === 'refunds') o.refund = { refundId: `RF-${Date.now()}`, status: 'REQUESTED', reason: body?.reason };
  else if (action === 'refunds/withdraw') o.refund = null;
  return ok({ processing: false });
};

/** Mock 모드에서 가로챌 요청이면 응답 body를, 아니면 undefined(실제 네트워크 호출)를 반환 */
export const getMockApiBody = (method: string, url: string, reqBody?: any): unknown | undefined => {
  if (method !== 'get' && method !== 'post' && method !== 'delete') return undefined;
  const path = url.split('?')[0];
  if (method !== 'get') {
    if (/^\/users\/\d+\/follow$/.test(path)) return ok({});
    const m = path.match(/^\/orders\/([^/]+)\/(shipment|confirm-purchase|cancel|refunds\/withdraw|refunds)$/);
    return m ? mutateMockOrder(m[1], m[2], typeof reqBody === 'string' ? JSON.parse(reqBody) : reqBody) : undefined;
  }
  if (path === '/users/me') return ok(MOCK_ME);
  // 판매 중(1, 6)과 주문이 있는 상품(3, 5)을 함께 보여준다
  if (path === '/users/me/posts') return page([1, 6, 3, 5].map(postOf));
  if (path === '/users/me/sale-orders') return ordersOf('sale');
  if (path === '/users/me/purchase-orders') return ordersOf('purchase');
  if (/^\/users\/\d+\/followers$/.test(path)) return page(MOCK_FOLLOW_USERS.slice(0, 2));
  if (/^\/users\/\d+\/followings$/.test(path)) return page(MOCK_FOLLOW_USERS);
  if (/^\/users\/\d+\/trust-info$/.test(path)) return ok({ tradeCount: 12 });
  const userPosts = path.match(/^\/users\/(\d+)\/posts$/);
  if (userPosts) return page(POSTS.filter(p => p.sellerId === Number(userPosts[1]) && p.productStatus === 'ON_SALE'));
  const user = path.match(/^\/users\/(\d+)$/);
  if (user) return ok({ ...MOCK_ME, id: Number(user[1]), username: `user${user[1]}`, nickname: POSTS.find(p => p.sellerId === Number(user[1]))?.sellerNickname ?? `회원${user[1]}`, bio: '안녕하세요!' });
  const order = path.match(/^\/orders\/([^/]+)$/);
  if (order) return getMockOrderDetail(order[1]);
  return undefined;
};
