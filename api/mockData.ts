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
          productCategory: '애니/만화',
          productCondition: 'NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/101/400/400',
              imageKey: 'products/mock-key-001.jpg',
            },
          ],
          seller: { id: 52, nickname: '졸린코끼리' },
          createdAt: '2026-05-20T10:00:00',
        },
        {
          id: 2,
          title: '홀로라이브 제일복권 보탄 아크릴스탠드',
          price: 35000,
          description: '개봉만 했습니다. 상태 최상.',
          productCategory: '굿즈',
          productCondition: 'LIKE_NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/102/400/400',
              imageKey: 'products/mock-key-002.jpg',
            },
          ],
          seller: { id: 7, nickname: '굿즈헌터' },
          createdAt: '2026-05-21T14:30:00',
        },
        {
          id: 3,
          title: '주술회전 고죠 사토루 피규어 (프라이즈)',
          price: 58000,
          description: '택배 거래 가능. 포장 꼼꼼하게 해드립니다.',
          productCategory: '애니/만화',
          productCondition: 'USED',
          productStatus: 'RESERVED',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/103/400/400',
              imageKey: 'products/mock-key-003.jpg',
            },
          ],
          seller: { id: 15, nickname: '오타쿠창고' },
          createdAt: '2026-05-22T09:15:00',
        },
        {
          id: 4,
          title: '스텔라이브 아카네 리제 빵떡 쿠션',
          price: 135000,
          description: '미개봉 새상품입니다.',
          productCategory: '굿즈',
          productCondition: 'NEW',
          productStatus: 'ON_SALE',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/104/400/400',
              imageKey: 'products/mock-key-004.jpg',
            },
          ],
          seller: { id: 3, nickname: '키치캐치셀러' },
          createdAt: '2026-05-23T18:00:00',
        },
        {
          id: 5,
          title: '에반게리온 초호기 MG 프라모델',
          price: 89000,
          description: '조립 완성품. 사진 참고해주세요.',
          productCategory: '애니/만화',
          productCondition: 'USED',
          productStatus: 'SOLD_OUT',
          images: [
            {
              imageUrl: 'https://picsum.photos/id/105/400/400',
              imageKey: 'products/mock-key-005.jpg',
            },
          ],
          seller: { id: 22, nickname: '건프라마니아' },
          createdAt: '2026-05-24T11:45:00',
        },
      ],
      totalPages: 1,
      totalElements: 5,
      number: 0,
      size: 5,
    },
  },
};

// ─── 상품 상세 (ID별 분기) ───────────────────────────────────────────────────

export const getMockPostDetail = (productId: string | number) => ({
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
      productCategory: '굿즈',
      productCondition: 'LIKE_NEW',
      productStatus: 'ON_SALE',
      images: [
        {
          imageUrl: `https://picsum.photos/id/${100 + Number(productId)}/400/400`,
          imageKey: `products/mock-detail-key-${productId}.jpg`,
        },
      ],
      seller: { id: 42, nickname: '졸린코끼리' },
      createdAt: '2026-05-25T10:00:00',
    },
  },
});

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
      productCategory: '기타',
      productCondition: 'NEW',
      productStatus: 'ON_SALE',
      images: [],
      seller: { id: 42, nickname: '김민영' },
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
