export interface ImageAsset {
  uri: string;
  type?: string;
}

export interface PresignedEntry {
  uploadUrl: string;
  imageKey: string;
  uploadHeaders?: Record<string, string>; // 서버가 서명에 포함시켜 내려주는 PUT 헤더 (있으면 그대로 사용)
}

export async function uploadImagesToS3(
  images: ImageAsset[],
  presignedDataList: PresignedEntry[],
): Promise<string[]> {
  return Promise.all(
    images.map(async (image, index) => {
      const { uploadUrl, imageKey, uploadHeaders } = presignedDataList[index];
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: uploadHeaders ?? { 'Content-Type': image.type || 'image/jpeg' },
      });
      if (!uploadRes.ok) throw new Error('S3 이미지 업로드 실패');
      return imageKey;
    }),
  );
}
