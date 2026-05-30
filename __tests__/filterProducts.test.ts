import { filterProducts, Product } from '../utils/filterProducts';
import type { FilterState } from '../components/FilterBottomSheet';

const defaultFilter: FilterState = {
  sort: '추천순',
  isOnSaleOnly: false,
  minPrice: '',
  maxPrice: '',
  conditions: [],
};

const products: Product[] = [
  {
    id: '1', name: '상품A', price: 10000, imageUrl: '',
    status: 'ON_SALE', category: '굿즈', condition: 'NEW',
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '2', name: '상품B', price: 30000, imageUrl: '',
    status: 'RESERVED', category: '애니/만화', condition: 'USED',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3', name: '상품C', price: 20000, imageUrl: '',
    status: 'SOLD_OUT', category: '게임', condition: 'LIKE_NEW',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '4', name: '상품D', price: 50000, imageUrl: '',
    status: 'ON_SALE', category: '굿즈', condition: 'NEW',
    createdAt: '2024-01-04T00:00:00Z',
  },
];

describe('filterProducts', () => {
  describe('기본 동작', () => {
    it('필터가 없으면 전체 상품을 반환한다', () => {
      const result = filterProducts(products, defaultFilter, []);
      expect(result).toHaveLength(4);
    });

    it('원본 배열을 변경하지 않는다', () => {
      const original = products.map((p) => ({ ...p }));
      filterProducts(products, { ...defaultFilter, sort: '가격 높은 순' }, []);
      expect(products).toEqual(original);
    });
  });

  describe('판매중 필터 (isOnSaleOnly)', () => {
    it('true이면 ON_SALE 상품만 반환한다', () => {
      const result = filterProducts(products, { ...defaultFilter, isOnSaleOnly: true }, []);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.status === 'ON_SALE')).toBe(true);
    });

    it('false이면 전체 상품을 반환한다', () => {
      const result = filterProducts(products, { ...defaultFilter, isOnSaleOnly: false }, []);
      expect(result).toHaveLength(4);
    });
  });

  describe('카테고리 필터', () => {
    it('선택된 카테고리 상품만 반환한다', () => {
      const result = filterProducts(products, defaultFilter, ['굿즈']);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.category === '굿즈')).toBe(true);
    });

    it('여러 카테고리가 선택되면 해당 카테고리 상품을 모두 반환한다', () => {
      const result = filterProducts(products, defaultFilter, ['굿즈', '게임']);
      expect(result).toHaveLength(3);
    });

    it('선택된 카테고리가 없으면 카테고리 필터를 적용하지 않는다', () => {
      const result = filterProducts(products, defaultFilter, []);
      expect(result).toHaveLength(4);
    });
  });

  describe('가격 범위 필터', () => {
    it('minPrice가 있으면 해당 가격 이상의 상품만 반환한다', () => {
      const result = filterProducts(products, { ...defaultFilter, minPrice: '20000' }, []);
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.price >= 20000)).toBe(true);
    });

    it('maxPrice가 있으면 해당 가격 이하의 상품만 반환한다', () => {
      const result = filterProducts(products, { ...defaultFilter, maxPrice: '20000' }, []);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.price <= 20000)).toBe(true);
    });

    it('minPrice와 maxPrice 범위 내 상품만 반환한다', () => {
      const result = filterProducts(
        products,
        { ...defaultFilter, minPrice: '15000', maxPrice: '35000' },
        [],
      );
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id).sort()).toEqual(['2', '3']);
    });

    it('가격 문자열에 콤마가 있어도 올바르게 필터링한다', () => {
      const result = filterProducts(products, { ...defaultFilter, minPrice: '20,000' }, []);
      expect(result.every((p) => p.price >= 20000)).toBe(true);
    });
  });

  describe('상품 상태 필터 (conditions)', () => {
    it('conditions가 있으면 해당 상태의 상품만 반환한다', () => {
      const result = filterProducts(products, { ...defaultFilter, conditions: ['NEW'] }, []);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.condition === 'NEW')).toBe(true);
    });

    it('여러 condition이 선택되면 해당 상태의 상품을 모두 반환한다', () => {
      const result = filterProducts(
        products,
        { ...defaultFilter, conditions: ['NEW', 'USED'] },
        [],
      );
      expect(result).toHaveLength(3);
    });

    it('condition이 없는 상품은 conditions 필터를 통과한다', () => {
      const productsWithUndefined: Product[] = [
        ...products,
        { id: '5', name: '상품E', price: 5000, imageUrl: '', status: 'ON_SALE', category: '기타' },
      ];
      const result = filterProducts(
        productsWithUndefined,
        { ...defaultFilter, conditions: ['NEW'] },
        [],
      );
      expect(result.some((p) => p.id === '5')).toBe(true);
    });
  });

  describe('정렬', () => {
    it('최신순으로 정렬하면 createdAt 내림차순으로 정렬된다', () => {
      const result = filterProducts(products, { ...defaultFilter, sort: '최신순' }, []);
      expect(result[0].id).toBe('4');
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('3');
      expect(result[3].id).toBe('2');
    });

    it('가격 높은 순으로 정렬하면 price 내림차순으로 정렬된다', () => {
      const result = filterProducts(products, { ...defaultFilter, sort: '가격 높은 순' }, []);
      expect(result.map((p) => p.price)).toEqual([50000, 30000, 20000, 10000]);
    });

    it('가격 낮은 순으로 정렬하면 price 오름차순으로 정렬된다', () => {
      const result = filterProducts(products, { ...defaultFilter, sort: '가격 낮은 순' }, []);
      expect(result.map((p) => p.price)).toEqual([10000, 20000, 30000, 50000]);
    });

    it('추천순이면 원래 순서를 유지한다', () => {
      const result = filterProducts(products, { ...defaultFilter, sort: '추천순' }, []);
      expect(result.map((p) => p.id)).toEqual(['1', '2', '3', '4']);
    });
  });

  describe('복합 필터', () => {
    it('판매중 필터와 카테고리 필터를 동시에 적용한다', () => {
      const result = filterProducts(
        products,
        { ...defaultFilter, isOnSaleOnly: true },
        ['굿즈'],
      );
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.status === 'ON_SALE' && p.category === '굿즈')).toBe(true);
    });

    it('카테고리 필터와 가격 정렬을 동시에 적용한다', () => {
      const result = filterProducts(
        products,
        { ...defaultFilter, sort: '가격 높은 순' },
        ['굿즈'],
      );
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(50000);
      expect(result[1].price).toBe(10000);
    });

    it('가격 범위와 상태 필터를 동시에 적용한다', () => {
      const result = filterProducts(
        products,
        { ...defaultFilter, minPrice: '15000', conditions: ['LIKE_NEW', 'USED'] },
        [],
      );
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id).sort()).toEqual(['2', '3']);
    });
  });
});
