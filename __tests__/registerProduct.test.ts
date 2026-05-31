import { registerProduct, CONDITION_MAP } from '../utils/registerProduct';
import { productAPI } from '../api/apiClient';
import * as uploadImagesModule from '../utils/uploadImages';

jest.mock('../api/apiClient', () => ({
  productAPI: {
    getPresignedUrls: jest.fn(),
    createPost: jest.fn(),
  },
}));

jest.mock('../utils/uploadImages', () => ({
  uploadImagesToS3: jest.fn(),
}));

const mockGetPresignedUrls = productAPI.getPresignedUrls as jest.Mock;
const mockCreatePost = productAPI.createPost as jest.Mock;
const mockUploadImagesToS3 = uploadImagesModule.uploadImagesToS3 as jest.Mock;

const baseInput = {
  productName: '테스트 상품',
  productPrice: '10,000',
  productDescription: '상품 설명',
  selectedCondition: '새상품',
  selectedCategory: '굿즈',
  images: [{ uri: 'file:///photo.jpg', type: 'image/jpeg', fileName: 'photo.jpg' }],
};

const presignedResponse = {
  data: {
    success: true,
    data: {
      images: [{ uploadUrl: 'https://s3.example.com/upload', imageKey: 'products/key.jpg' }],
    },
  },
};

describe('registerProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('성공 시 게시글 id를 반환한다', async () => {
    mockGetPresignedUrls.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['products/key.jpg']);
    mockCreatePost.mockResolvedValue({ data: { success: true, data: { id: 42 } } });

    const id = await registerProduct(baseInput);

    expect(id).toBe(42);
  });

  it('getPresignedUrls → uploadImagesToS3 → createPost 순서로 호출한다', async () => {
    const callOrder: string[] = [];
    mockGetPresignedUrls.mockImplementation(async () => { callOrder.push('presigned'); return presignedResponse; });
    mockUploadImagesToS3.mockImplementation(async () => { callOrder.push('upload'); return ['products/key.jpg']; });
    mockCreatePost.mockImplementation(async () => { callOrder.push('createPost'); return { data: { success: true, data: { id: 1 } } }; });

    await registerProduct(baseInput);

    expect(callOrder).toEqual(['presigned', 'upload', 'createPost']);
  });

  it('createPost에 올바른 데이터를 전달한다', async () => {
    mockGetPresignedUrls.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['products/key.jpg']);
    mockCreatePost.mockResolvedValue({ data: { success: true, data: { id: 1 } } });

    await registerProduct(baseInput);

    expect(mockCreatePost).toHaveBeenCalledWith({
      title: '테스트 상품',
      description: '상품 설명',
      price: 10000,
      productCategory: '굿즈',
      productCondition: 'NEW',
      imageKeys: ['products/key.jpg'],
    });
  });

  it('getPresignedUrls 실패 시 에러를 던진다', async () => {
    mockGetPresignedUrls.mockResolvedValue({ data: { success: false } });

    await expect(registerProduct(baseInput)).rejects.toThrow('Presigned URL 발급에 실패했습니다.');
  });

  it('createPost 응답 success:false이면 에러를 던진다', async () => {
    mockGetPresignedUrls.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['products/key.jpg']);
    mockCreatePost.mockResolvedValue({ data: { success: false } });

    await expect(registerProduct(baseInput)).rejects.toThrow('상품 등록에 실패했습니다.');
  });

  it('네트워크 오류 발생 시 에러를 전파한다', async () => {
    mockGetPresignedUrls.mockRejectedValue(new Error('네트워크 오류'));

    await expect(registerProduct(baseInput)).rejects.toThrow('네트워크 오류');
  });
});

describe('CONDITION_MAP', () => {
  it('한글 사용감을 백엔드 enum으로 변환한다', () => {
    expect(CONDITION_MAP['새상품']).toBe('NEW');
    expect(CONDITION_MAP['사용감 적음']).toBe('LIKE_NEW');
    expect(CONDITION_MAP['사용감 있음']).toBe('USED');
    expect(CONDITION_MAP['사용감 많음']).toBe('DAMAGED');
  });
});
