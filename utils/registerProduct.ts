import { productAPI } from '../api/apiClient';
import { uploadImagesToS3, ImageAsset } from './uploadImages';

export const CONDITION_MAP: Record<string, string> = {
  '새상품': 'NEW',
  '사용감 적음': 'LIKE_NEW',
  '사용감 있음': 'USED',
  '사용감 많음': 'DAMAGED',
};

export interface RegisterProductInput {
  productName: string;
  productPrice: string;
  productDescription: string;
  selectedCondition: string;
  selectedCategory: string;
  images: (ImageAsset & { fileName?: string })[];
}

export async function registerProduct(input: RegisterProductInput): Promise<number> {
  const requestPayload = input.images.map((img, index) => ({
    originalFileName: img.fileName || `image_${Date.now()}_${index}.jpg`,
    contentType: img.type || 'image/jpeg',
  }));

  const presignedRes = await productAPI.getPresignedUrls(requestPayload);
  if (!presignedRes.data?.success) {
    throw new Error('Presigned URL 발급에 실패했습니다.');
  }

  const uploadedImageKeys = await uploadImagesToS3(input.images, presignedRes.data.data.images);

  const response = await productAPI.createPost({
    title: input.productName,
    description: input.productDescription,
    price: Number(input.productPrice.replace(/,/g, '')),
    productCategory: input.selectedCategory,
    productCondition: CONDITION_MAP[input.selectedCondition] || 'NEW',
    imageKeys: uploadedImageKeys,
  });

  if (!response.data?.success) {
    throw new Error('상품 등록에 실패했습니다. (서버 응답 오류)');
  }

  return response.data.data.id;
}
