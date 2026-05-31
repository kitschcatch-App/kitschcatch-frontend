import type { FilterState } from '../components/FilterBottomSheet';

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  heartCount?: number;
  chatCount?: number;
  status?: string;
  category?: string;
  condition?: string;
  createdAt?: string;
};

export function filterProducts(
  products: Product[],
  filterState: FilterState,
  selectedCategories: string[],
): Product[] {
  let result = [...products];

  if (filterState.isOnSaleOnly) {
    result = result.filter((p) => p.status === 'ON_SALE');
  }

  if (selectedCategories.length > 0) {
    result = result.filter(
      (p) => p.category && selectedCategories.includes(p.category),
    );
  }

  const min = filterState.minPrice
    ? parseInt(filterState.minPrice.replace(/,/g, ''), 10)
    : null;
  const max = filterState.maxPrice
    ? parseInt(filterState.maxPrice.replace(/,/g, ''), 10)
    : null;
  if (min !== null) result = result.filter((p) => p.price >= min);
  if (max !== null) result = result.filter((p) => p.price <= max);

  if (filterState.conditions.length > 0) {
    result = result.filter(
      (p) => !p.condition || filterState.conditions.includes(p.condition),
    );
  }

  switch (filterState.sort) {
    case '최신순':
      result.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      break;
    case '가격 높은 순':
      result.sort((a, b) => b.price - a.price);
      break;
    case '가격 낮은 순':
      result.sort((a, b) => a.price - b.price);
      break;
    default:
      break;
  }

  return result;
}
