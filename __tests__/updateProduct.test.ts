import { updateProduct, STATUS_MAP } from '../utils/updateProduct';
import { productAPI } from '../api/apiClient';
import * as uploadImagesModule from '../utils/uploadImages';

jest.mock('../api/apiClient', () => ({
  productAPI: {
    getPresignedUrls: jest.fn(),
    updatePost: jest.fn(),
  },
}));

jest.mock('../utils/uploadImages', () => ({
  uploadImagesToS3: jest.fn(),
}));

const mockGetPresignedUrls = productAPI.getPresignedUrls as jest.Mock;
const mockUpdatePost = productAPI.updatePost as jest.Mock;
const mockUploadImagesToS3 = uploadImagesModule.uploadImagesToS3 as jest.Mock;

const presignedResponse = {
  data: {
    success: true,
    data: {
      images: [{ uploadUrl: 'https://s3.example.com/upload', imageKey: 'products/new-key.jpg' }],
    },
  },
};

const baseInput = {
  postId: 10,
  productName: '수정된 상품',
  productPrice: '20,000',
  productDescription: '수정된 설명',
  selectedCondition: '사용감 있음',
  selectedCategory: '게임',
  selectedStatus: '예약중',
  newImages: [],
  existingImageKeys: ['products/old-key.jpg'],
};

describe('updateProduct - 이미지 수정 없음 (기존 이미지 유지)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('새 이미지가 없으면 S3 업로드 없이 기존 imageKey로 updatePost를 호출한다', async () => {
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct(baseInput);

    expect(mockGetPresignedUrls).not.toHaveBeenCalled();
    expect(mockUploadImagesToS3).not.toHaveBeenCalled();
    expect(mockUpdatePost).toHaveBeenCalledWith(10, expect.objectContaining({
      imageKeys: ['products/old-key.jpg'],
    }));
  });

  it('기존 이미지가 없고 새 이미지도 없으면 빈 배열로 updatePost를 호출한다', async () => {
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct({ ...baseInput, existingImageKeys: [] });

    expect(mockUpdatePost).toHaveBeenCalledWith(10, expect.objectContaining({
      imageKeys: [],
    }));
  });
});

describe('updateProduct - 새 이미지 업로드', () => {
  beforeEach(() => jest.clearAllMocks());

  it('새 이미지가 있으면 presignedUrl 발급 → S3 업로드 → 새 imageKey로 updatePost를 호출한다', async () => {
    const newImage = { uri: 'file:///new.jpg', type: 'image/jpeg', fileName: 'new.jpg' };
    mockGetPresignedUrls.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['products/new-key.jpg']);
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct({ ...baseInput, newImages: [newImage] });

    expect(mockGetPresignedUrls).toHaveBeenCalledTimes(1);
    expect(mockUploadImagesToS3).toHaveBeenCalledTimes(1);
    expect(mockUpdatePost).toHaveBeenCalledWith(10, expect.objectContaining({
      imageKeys: ['products/new-key.jpg'],
    }));
  });

  it('새 이미지 업로드 시 기존 imageKey는 사용하지 않는다', async () => {
    const newImage = { uri: 'file:///new.jpg', type: 'image/jpeg' };
    mockGetPresignedUrls.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['products/new-key.jpg']);
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct({ ...baseInput, newImages: [newImage] });

    const [, requestData] = mockUpdatePost.mock.calls[0];
    expect(requestData.imageKeys).not.toContain('products/old-key.jpg');
  });

  it('getPresignedUrls 실패 시 에러를 던진다', async () => {
    const newImage = { uri: 'file:///new.jpg', type: 'image/jpeg' };
    mockGetPresignedUrls.mockResolvedValue({ data: { success: false } });

    await expect(updateProduct({ ...baseInput, newImages: [newImage] }))
      .rejects.toThrow('Presigned URL 발급에 실패했습니다.');

    expect(mockUpdatePost).not.toHaveBeenCalled();
  });
});

describe('updateProduct - updatePost 호출 데이터 검증', () => {
  beforeEach(() => jest.clearAllMocks());

  it('사용감을 백엔드 enum으로 변환해서 전달한다', async () => {
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct({ ...baseInput, selectedCondition: '사용감 있음' });

    expect(mockUpdatePost).toHaveBeenCalledWith(10, expect.objectContaining({
      productCondition: 'USED',
    }));
  });

  it('판매상태를 백엔드 enum으로 변환해서 전달한다', async () => {
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct({ ...baseInput, selectedStatus: '예약중' });

    expect(mockUpdatePost).toHaveBeenCalledWith(10, expect.objectContaining({
      productStatus: 'RESERVED',
    }));
  });

  it('가격 문자열에서 콤마를 제거해 숫자로 변환한다', async () => {
    mockUpdatePost.mockResolvedValue({ status: 200 });

    await updateProduct({ ...baseInput, productPrice: '1,234,000' });

    expect(mockUpdatePost).toHaveBeenCalledWith(10, expect.objectContaining({
      price: 1234000,
    }));
  });

  it('updatePost가 200/201 외 상태코드를 반환하면 에러를 던진다', async () => {
    mockUpdatePost.mockResolvedValue({ status: 400 });

    await expect(updateProduct(baseInput)).rejects.toThrow('상품 수정에 실패했습니다.');
  });

  it('네트워크 오류 발생 시 에러를 전파한다', async () => {
    mockUpdatePost.mockRejectedValue(new Error('서버 연결 실패'));

    await expect(updateProduct(baseInput)).rejects.toThrow('서버 연결 실패');
  });
});

describe('STATUS_MAP', () => {
  it('한글 판매상태를 백엔드 enum으로 변환한다', () => {
    expect(STATUS_MAP['판매중']).toBe('ON_SALE');
    expect(STATUS_MAP['예약중']).toBe('RESERVED');
    expect(STATUS_MAP['판매완료']).toBe('SOLD_OUT');
  });
});
