/**
 * 테스트: 상품 폼 유효성 검사 테스트 (validateProductForm.test)
 * 역할: 상품 등록 및 수정 시 입력된 데이터의 유효성을 검사하는 로직을 검증합니다.
 */
import { validateProductForm, ProductFormInputs } from '../utils/validateProductForm';

const validInputs: ProductFormInputs = {
  productName: '테스트 상품',
  productPrice: '10,000',
  productDescription: '상품 설명입니다.',
  selectedCondition: '새상품',
  selectedCategory: '굿즈',
  imageCount: 1,
};

describe('validateProductForm', () => {
  it('모든 항목이 올바르면 null을 반환한다', () => {
    expect(validateProductForm(validInputs)).toBeNull();
  });

  it('상품명이 비어있으면 에러 메시지를 반환한다', () => {
    expect(validateProductForm({ ...validInputs, productName: '' }))
      .toBe('필수 입력 항목을 모두 채워주세요.');
  });

  it('가격이 비어있으면 에러 메시지를 반환한다', () => {
    expect(validateProductForm({ ...validInputs, productPrice: '' }))
      .toBe('필수 입력 항목을 모두 채워주세요.');
  });

  it('상품 설명이 비어있으면 에러 메시지를 반환한다', () => {
    expect(validateProductForm({ ...validInputs, productDescription: '' }))
      .toBe('필수 입력 항목을 모두 채워주세요.');
  });

  it('사용감이 선택되지 않으면 에러 메시지를 반환한다', () => {
    expect(validateProductForm({ ...validInputs, selectedCondition: '사용감 선택' }))
      .toBe('드롭다운 항목을 모두 선택해주세요.');
  });

  it('카테고리가 선택되지 않으면 에러 메시지를 반환한다', () => {
    expect(validateProductForm({ ...validInputs, selectedCategory: '카테고리 선택' }))
      .toBe('드롭다운 항목을 모두 선택해주세요.');
  });

  it('이미지가 없으면 에러 메시지를 반환한다', () => {
    expect(validateProductForm({ ...validInputs, imageCount: 0 }))
      .toBe('상품 사진을 1장 이상 등록해주세요.');
  });
});
