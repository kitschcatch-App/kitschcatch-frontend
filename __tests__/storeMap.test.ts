import { storeAPI } from '../api/apiClient';
import {
  calculateZoomForRadius,
  fetchNearbyStores,
  fetchAllStores,
  fetchStores,
  normalizeStores,
} from '../utils/storeMap';

jest.mock('../api/apiClient', () => ({
  storeAPI: { getNearby: jest.fn(), getAll: jest.fn() },
}));

describe('normalizeStores', () => {
  it('서버 필드명이 달라도(storeId/id, lng/longitude 등) 정규화한다', () => {
    const result = normalizeStores([
      {
        id: 10,
        storeName: '가챠샵',
        lat: 37.5,
        lon: 127.0,
        roadAddress: '서울 어딘가',
        tel: '02-000-0000',
        isOpen: true,
      },
    ]);

    expect(result).toEqual([
      {
        storeId: '10',
        name: '가챠샵',
        latitude: 37.5,
        longitude: 127.0,
        address: '서울 어딘가',
        phoneNumber: '02-000-0000',
        businessStatus: 'OPEN',
        businessHours: null,
        distanceKm: null,
        isFavorite: false,
      },
    ]);
  });

  it('distance(m)는 km로 환산하고, businessStatus 원본 값은 유지한다', () => {
    const [store] = normalizeStores([
      {
        storeId: 'a',
        name: 'A',
        latitude: 1,
        longitude: 2,
        distance: 2500,
        businessStatus: 'CLOSED',
      },
    ]);

    expect(store.distanceKm).toBe(2.5);
    expect(store.businessStatus).toBe('CLOSED');
  });

  it('Swagger 응답 필드(id, distanceMeters, favorited)를 정규화한다', () => {
    const [store] = normalizeStores([
      { id: 7, name: '홍대점', address: '서울 마포구', latitude: 37.5, longitude: 126.9, distanceMeters: 850, favorited: true },
    ]);

    expect(store).toMatchObject({ storeId: '7', address: '서울 마포구', distanceKm: 0.85, isFavorite: true });
  });

  it('좌표가 없거나 id가 비면 제외한다', () => {
    expect(
      normalizeStores([
        { storeId: '', name: '무명', latitude: 37, longitude: 127 },
        { storeId: 'b', name: '좌표없음' },
      ]),
    ).toHaveLength(0);
  });

  it('배열이 아니면 빈 배열을 반환한다', () => {
    expect(normalizeStores(null)).toEqual([]);
    expect(normalizeStores(undefined)).toEqual([]);
  });
});

describe('calculateZoomForRadius', () => {
  it('반경이 클수록 줌 레벨이 낮아진다(더 넓게 보인다)', () => {
    const zoom1km = calculateZoomForRadius(1, 37.5666, 360);
    const zoom5km = calculateZoomForRadius(5, 37.5666, 360);

    expect(zoom5km).toBeLessThan(zoom1km);
  });

  it('줌 레벨을 5~18 범위로 제한한다', () => {
    expect(calculateZoomForRadius(5, 37.5666, 1)).toBeGreaterThanOrEqual(5);
    expect(calculateZoomForRadius(1, 37.5666, 100000)).toBeLessThanOrEqual(18);
  });
});

describe('fetchNearbyStores', () => {
  const coord = { latitude: 37.5666, longitude: 126.9784 };

  beforeEach(() => jest.clearAllMocks());

  it('실 API 모드: storeAPI.getNearby를 좌표/반경으로 호출하고 응답을 정규화한다', async () => {
    (storeAPI.getNearby as jest.Mock).mockResolvedValue({
      data: {
        data: [{ storeId: 'x', name: 'X', latitude: 37.5, longitude: 127 }],
      },
    });

    const stores = await fetchNearbyStores(coord, 3, false);

    expect(storeAPI.getNearby).toHaveBeenCalledWith(37.5666, 126.9784, 3, 0, 100);
    expect(stores).toHaveLength(1);
    expect(stores[0].storeId).toBe('x');
  });

  it('hasNext가 true인 동안 다음 페이지를 이어서 조회한다', async () => {
    const page = (id: number, hasNext: boolean) => ({
      data: { data: { stores: [{ id, name: `s${id}`, latitude: 37.5, longitude: 127 }], page: id - 1, size: 100, hasNext } },
    });
    (storeAPI.getNearby as jest.Mock).mockResolvedValueOnce(page(1, true)).mockResolvedValueOnce(page(2, false));

    const stores = await fetchNearbyStores(coord, 3, false);

    expect(storeAPI.getNearby).toHaveBeenCalledTimes(2);
    expect(storeAPI.getNearby).toHaveBeenLastCalledWith(37.5666, 126.9784, 3, 1, 100);
    expect(stores.map(s => s.storeId)).toEqual(['1', '2']);
  });

  it('Mock 모드: API를 호출하지 않고 반경 안의 가상 매장만 반환한다', async () => {
    const near = await fetchNearbyStores(coord, 1, true);
    const far = await fetchNearbyStores(coord, 5, true);

    expect(storeAPI.getNearby).not.toHaveBeenCalled();
    expect(near.length).toBeGreaterThan(0);
    expect(far.length).toBeGreaterThanOrEqual(near.length);
    far.forEach(store => expect(store.distanceKm!).toBeLessThanOrEqual(5));
  });
});

describe('fetchAllStores / fetchStores', () => {
  const coord = { latitude: 37.5666, longitude: 126.9784 };

  beforeEach(() => jest.clearAllMocks());

  it('totalPages만큼 전국 매장 목록을 이어서 조회한다', async () => {
    const page = (id: number, p: number) => ({
      data: {
        data: {
          content: [{ id, name: `s${id}`, latitude: 35 + id, longitude: 127, favorited: id === 2 }],
          page: p, size: 100, totalElements: 2, totalPages: 2,
        },
      },
    });
    (storeAPI.getAll as jest.Mock).mockResolvedValueOnce(page(1, 0)).mockResolvedValueOnce(page(2, 1));

    const stores = await fetchAllStores(coord, false);

    expect(storeAPI.getAll).toHaveBeenNthCalledWith(1, 0, 100);
    expect(storeAPI.getAll).toHaveBeenNthCalledWith(2, 1, 100);
    expect(stores.map(s => s.storeId)).toEqual(['1', '2']);
    expect(stores[1].isFavorite).toBe(true);
  });

  it('fetchStores: 반경이 null이면 전국, 숫자면 주변 매장 API를 호출한다', async () => {
    (storeAPI.getAll as jest.Mock).mockResolvedValue({ data: { data: { content: [], totalPages: 1 } } });
    (storeAPI.getNearby as jest.Mock).mockResolvedValue({ data: { data: { stores: [], hasNext: false } } });

    await fetchStores(coord, null, false);
    expect(storeAPI.getAll).toHaveBeenCalledTimes(1);
    expect(storeAPI.getNearby).not.toHaveBeenCalled();

    await fetchStores(coord, 5, false);
    expect(storeAPI.getNearby).toHaveBeenCalledWith(37.5666, 126.9784, 5, 0, 100);
  });

  it('Mock 모드: 반경과 상관없이 가상 매장 전체를 반환한다', async () => {
    const all = await fetchAllStores(coord, true);
    const near = await fetchNearbyStores(coord, 1, true);

    expect(storeAPI.getAll).not.toHaveBeenCalled();
    expect(all.length).toBeGreaterThanOrEqual(near.length);
  });
});
