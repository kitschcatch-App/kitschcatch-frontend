/**
 * 유틸: 적용된 필터 개수 (countActiveFilters)
 * 역할: 상품 목록 필터 버튼 옆 숫자 배지에 쓸, 기본값에서 바뀐 필터의 개수를 셉니다.
 * 정렬(기본 제외)·판매중만·가격(최소/최대 합쳐 1개)·사용감(항목마다 1개).
 */
export const DEFAULT_SORT = '추천순';

export const countActiveFilters = (f: {
  sort: string;
  isOnSaleOnly: boolean;
  minPrice: string;
  maxPrice: string;
  conditions: string[];
}): number =>
  (f.sort !== DEFAULT_SORT ? 1 : 0) +
  (f.isOnSaleOnly ? 1 : 0) +
  (f.minPrice || f.maxPrice ? 1 : 0) +
  f.conditions.length;
