export interface ImageAsset {
  uri: string;
  type?: string;
}

export interface PresignedEntry {
  uploadUrl: string;
  imageKey: string;
}

export async function uploadImagesToS3(
  images: ImageAsset[],
  presignedDataList: PresignedEntry[],
): Promise<string[]> {
  return Promise.all(
    images.map(async (image, index) => {
      const { uploadUrl, imageKey } = presignedDataList[index];
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': image.type || 'image/jpeg' },
      });
      if (!uploadRes.ok) throw new Error('S3 이미지 업로드 실패');
      return imageKey;
    }),
  );
}
