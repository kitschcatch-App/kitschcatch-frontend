/**
 * 유틸: 상품 목록 검색/필터/정렬 → GET /posts 쿼리 파라미터 변환
 * 역할: 서버가 처리하는 조건은 쿼리로 보내고, 서버가 단일 값만 받는 항목(카테고리·상태 다중 선택)만 앱에서 거릅니다.
 */
import type { FilterState } from '../components/FilterBottomSheet';
import { filterProducts, Product } from './filterProducts';

// '추천순'은 대응하는 서버 정렬이 없어 sort를 보내지 않음(서버 기본 LATEST)
const SORT_MAP: Record<string, string> = {
  최신순: 'LATEST',
  '가격 높은 순': 'PRICE_DESC',
  '가격 낮은 순': 'PRICE_ASC',
};

const toPrice = (value: string) => {
  const n = parseInt(value.replace(/,/g, ''), 10);
  return Number.isNaN(n) ? undefined : n;
};

export function buildPostParams(
  keyword: string,
  categories: string[],
  filterState: FilterState,
  page: number,
  size = 20,
) {
  const params: Record<string, string | number> = { page, size };

  const kw = keyword.trim();
  if (kw) params.keyword = kw;
  // category/condition은 서버가 단일 값만 받으므로 1개 선택일 때만 서버 필터로 사용
  if (categories.length === 1) params.category = categories[0];
  if (filterState.conditions.length === 1) params.condition = filterState.conditions[0];
  if (filterState.isOnSaleOnly) params.status = 'ON_SALE';

  const min = toPrice(filterState.minPrice);
  const max = toPrice(filterState.maxPrice);
  if (min !== undefined) params.minPrice = min;
  if (max !== undefined) params.maxPrice = max;

  const sort = SORT_MAP[filterState.sort];
  if (sort) params.sort = sort;

  return params;
}

/** 서버가 처리하지 못하는 다중 선택(카테고리·상품상태 2개 이상)만 앱에서 거른다 */
export function filterMultiSelect(products: Product[], categories: string[], filterState: FilterState) {
  return filterProducts(
    products,
    {
      sort: '',
      isOnSaleOnly: false,
      minPrice: '',
      maxPrice: '',
      conditions: filterState.conditions.length > 1 ? filterState.conditions : [],
    },
    categories.length > 1 ? categories : [],
  );
}
