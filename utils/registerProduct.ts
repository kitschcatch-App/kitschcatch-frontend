import { productAPI } from '../api/apiClient';
import { uploadImagesToS3, ImageAsset } from './uploadImages';

export const CONDITION_MAP: Record<string, string> = {
  '새상품': 'NEW',
  '사용감 적음': 'LIKE_NEW',
  '사용감 있음': 'USED',
  '사용감 많음': 'DAMAGED',
};

export const CATEGORY_MAP: Record<string, string> = {
  '애니/만화': 'ANIME_MANGA',
  '게임': 'GAME',
  '굿즈': 'GOODS',
  '코스프레': 'COSPLAY',
  '서적': 'BOOK',
  '음반/영상': 'MUSIC_VIDEO',
  '기타': 'ETC',
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

  console.log('[registerProduct] presigned URL 요청:', JSON.stringify(requestPayload));
  const presignedRes = await productAPI.getPresignedUrls(requestPayload);
  if (!presignedRes.data?.success) {
    throw new Error('Presigned URL 발급에 실패했습니다.');
  }
  console.log('[registerProduct] presigned URL 성공');

  const uploadedImageKeys = await uploadImagesToS3(input.images, presignedRes.data.data.images);
  console.log('[registerProduct] S3 업로드 성공, keys:', uploadedImageKeys);

  const postPayload = {
    title: input.productName,
    description: input.productDescription,
    price: Number(input.productPrice.replace(/,/g, '')),
    productCategory: CATEGORY_MAP[input.selectedCategory] || input.selectedCategory,
    productCondition: CONDITION_MAP[input.selectedCondition] || 'NEW',
    imageKeys: uploadedImageKeys,
  };
  console.log('[registerProduct] createPost 요청:', JSON.stringify(postPayload));
  const response = await productAPI.createPost(postPayload);

  if (!response.data?.success) {
    throw new Error('상품 등록에 실패했습니다. (서버 응답 오류)');
  }

  return response.data.data.id;
}
