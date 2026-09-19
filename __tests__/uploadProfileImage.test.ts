import { uploadProfileImage } from '../utils/uploadProfileImage';
import { userAPI } from '../api/apiClient';
import * as uploadImagesModule from '../utils/uploadImages';

jest.mock('../api/apiClient', () => ({
  userAPI: {
    getProfileImageUploadUrl: jest.fn(),
  },
}));

jest.mock('../utils/uploadImages', () => ({
  uploadImagesToS3: jest.fn(),
}));

const mockGetProfileImageUploadUrl = userAPI.getProfileImageUploadUrl as jest.Mock;
const mockUploadImagesToS3 = uploadImagesModule.uploadImagesToS3 as jest.Mock;

const image = { uri: 'file:///photo.jpg', type: 'image/jpeg', fileName: 'photo.jpg', fileSize: 1024 };

const presignedResponse = {
  data: {
    success: true,
    data: { uploadUrl: 'https://s3.example.com/upload', imageKey: 'profiles/123/uuid.jpg', expiresAt: '2026-09-17T12:10:00+09:00' },
  },
};

describe('uploadProfileImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('성공 시 imageKey를 반환한다', async () => {
    mockGetProfileImageUploadUrl.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['profiles/123/uuid.jpg']);

    const key = await uploadProfileImage(image);

    expect(key).toBe('profiles/123/uuid.jpg');
  });

  it('presigned URL 요청에 올바른 파일 정보를 전달한다', async () => {
    mockGetProfileImageUploadUrl.mockResolvedValue(presignedResponse);
    mockUploadImagesToS3.mockResolvedValue(['profiles/123/uuid.jpg']);

    await uploadProfileImage(image);

    expect(mockGetProfileImageUploadUrl).toHaveBeenCalledWith({
      fileName: 'photo.jpg',
      contentType: 'image/jpeg',
      fileSize: 1024,
    });
  });

  it('presigned URL 발급 실패 시 에러를 던진다', async () => {
    mockGetProfileImageUploadUrl.mockResolvedValue({ data: { success: false } });

    await expect(uploadProfileImage(image)).rejects.toThrow('프로필 이미지 업로드 URL 발급에 실패했습니다.');
  });

  it('네트워크 오류 발생 시 에러를 전파한다', async () => {
    mockGetProfileImageUploadUrl.mockRejectedValue(new Error('네트워크 오류'));

    await expect(uploadProfileImage(image)).rejects.toThrow('네트워크 오류');
  });
});
