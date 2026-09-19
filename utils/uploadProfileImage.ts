import { Asset } from 'react-native-image-picker';
import { userAPI } from '../api/apiClient';
import { uploadImagesToS3 } from './uploadImages';

export async function uploadProfileImage(image: Asset): Promise<string> {
  const presignedRes = await userAPI.getProfileImageUploadUrl({
    fileName: image.fileName || `profile_${Date.now()}.jpg`,
    contentType: image.type || 'image/jpeg',
    fileSize: image.fileSize || 0,
  });
  if (!presignedRes.data?.success) {
    throw new Error('프로필 이미지 업로드 URL 발급에 실패했습니다.');
  }

  const { uploadUrl, imageKey } = presignedRes.data.data;
  const [profileImageKey] = await uploadImagesToS3([image], [{ uploadUrl, imageKey }]);
  return profileImageKey;
}
