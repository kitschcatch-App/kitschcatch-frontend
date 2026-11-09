import { countActiveFilters } from '../utils/countActiveFilters';

const base = { sort: '추천순', isOnSaleOnly: false, minPrice: '', maxPrice: '', conditions: [] as string[] };

describe('countActiveFilters', () => {
  it('기본값이면 0', () => {
    expect(countActiveFilters(base)).toBe(0);
  });

  it('바뀐 항목을 모두 센다 (가격은 최소/최대 합쳐 1개)', () => {
    expect(
      countActiveFilters({
        sort: '최신순',
        isOnSaleOnly: true,
        minPrice: '1,000',
        maxPrice: '5,000',
        conditions: ['NEW', 'USED'],
      }),
    ).toBe(5);
  });
});
