export interface EditFormInputs {
  productName: string;
  productPrice: string;
  productDescription: string;
  selectedCondition: string;
  selectedCategory: string;
  selectedStatus: string;
}

export function validateEditForm(inputs: EditFormInputs): string | null {
  if (!inputs.productName || !inputs.productPrice || !inputs.productDescription) {
    return '필수 입력 항목을 모두 채워주세요.';
  }
  if (
    inputs.selectedCondition === '사용감 선택' ||
    inputs.selectedCategory === '카테고리 선택' ||
    inputs.selectedStatus === '판매상태 선택'
  ) {
    return '드롭다운 항목을 모두 선택해주세요.';
  }
  return null;
}

export interface ProductFormInputs {
  productName: string;
  productPrice: string;
  productDescription: string;
  selectedCondition: string;
  selectedCategory: string;
  imageCount: number;
}

export function validateProductForm(inputs: ProductFormInputs): string | null {
  if (!inputs.productName || !inputs.productPrice || !inputs.productDescription) {
    return '필수 입력 항목을 모두 채워주세요.';
  }
  if (inputs.selectedCondition === '사용감 선택' || inputs.selectedCategory === '카테고리 선택') {
    return '드롭다운 항목을 모두 선택해주세요.';
  }
  if (inputs.imageCount === 0) {
    return '상품 사진을 1장 이상 등록해주세요.';
  }
  return null;
}
