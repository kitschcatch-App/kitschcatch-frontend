import { buildPostParams, filterMultiSelect } from '../utils/buildPostParams';

const base = { sort: '추천순', isOnSaleOnly: false, minPrice: '', maxPrice: '', conditions: [] as string[] };

describe('buildPostParams', () => {
  it('기본값은 page/size만 보낸다 (추천순은 sort 미전송)', () => {
    expect(buildPostParams('', [], base, 0)).toEqual({ page: 0, size: 20 });
  });

  it('키워드는 trim하고 빈 값이면 보내지 않는다', () => {
    expect(buildPostParams('  원신 ', [], base, 1).keyword).toBe('원신');
    expect(buildPostParams('   ', [], base, 0)).not.toHaveProperty('keyword');
  });

  it('정렬/상태/가격(쉼표 제거)을 서버 값으로 변환한다', () => {
    const p = buildPostParams('', [], { ...base, sort: '가격 낮은 순', isOnSaleOnly: true, minPrice: '1,000', maxPrice: '50,000' }, 0);
    expect(p).toMatchObject({ sort: 'PRICE_ASC', status: 'ON_SALE', minPrice: 1000, maxPrice: 50000 });
  });

  it('카테고리/상품상태는 1개 선택일 때만 서버로 보낸다', () => {
    expect(buildPostParams('', ['GAME'], { ...base, conditions: ['NEW'] }, 0)).toMatchObject({ category: 'GAME', condition: 'NEW' });
    const multi = buildPostParams('', ['GAME', 'BOOK'], { ...base, conditions: ['NEW', 'USED'] }, 0);
    expect(multi).not.toHaveProperty('category');
    expect(multi).not.toHaveProperty('condition');
  });
});

describe('filterMultiSelect', () => {
  const items = [
    { id: '1', name: 'a', price: 1, imageUrl: '', category: 'GAME', condition: 'NEW' },
    { id: '2', name: 'b', price: 2, imageUrl: '', category: 'BOOK', condition: 'USED' },
    { id: '3', name: 'c', price: 3, imageUrl: '', category: 'ETC', condition: 'NEW' },
  ];

  it('2개 이상 선택된 카테고리만 앱에서 거른다', () => {
    expect(filterMultiSelect(items, ['GAME', 'BOOK'], base).map(p => p.id)).toEqual(['1', '2']);
  });

  it('1개 선택은 서버가 처리하므로 거르지 않는다', () => {
    expect(filterMultiSelect(items, ['GAME'], base)).toHaveLength(3);
  });
});
