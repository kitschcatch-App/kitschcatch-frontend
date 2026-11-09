import { productAPI } from '../api/apiClient';
import { uploadImagesToS3, ImageAsset } from './uploadImages';
import { CONDITION_MAP } from './registerProduct';

export const STATUS_MAP: Record<string, string> = {
  '판매중': 'ON_SALE',
  '예약중': 'RESERVED',
  '판매완료': 'SOLD_OUT',
};

export interface UpdateProductInput {
  postId: string | number;
  productName: string;
  productPrice: string;
  productDescription: string;
  selectedCondition: string;
  selectedCategory: string;
  selectedStatus: string;
  newImages: (ImageAsset & { fileName?: string })[];
  existingImageKeys: string[];
}

export async function updateProduct(input: UpdateProductInput): Promise<void> {
  let finalImageKeys: string[] = input.existingImageKeys;

  if (input.newImages.length > 0) {
    const requestPayload = input.newImages.map((img, index) => ({
      originalFileName: img.fileName || `image_${Date.now()}_${index}.jpg`,
      contentType: img.type || 'image/jpeg',
    }));

    const presignedRes = await productAPI.getPresignedUrls(requestPayload);
    if (!presignedRes.data?.success) {
      throw new Error('Presigned URL 발급에 실패했습니다.');
    }

    finalImageKeys = await uploadImagesToS3(input.newImages, presignedRes.data.data.images);
  }

  const response = await productAPI.updatePost(input.postId, {
    title: input.productName,
    description: input.productDescription,
    price: Number(input.productPrice.replace(/,/g, '')),
    productCategory: input.selectedCategory,
    productCondition: CONDITION_MAP[input.selectedCondition] || input.selectedCondition,
    productStatus: STATUS_MAP[input.selectedStatus] || input.selectedStatus,
    imageKeys: finalImageKeys,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('상품 수정에 실패했습니다. (서버 응답 오류)');
  }
}
