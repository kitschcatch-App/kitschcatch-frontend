import { storeAPI } from '../api/apiClient';
import {
  calculateZoomForRadius,
  fetchNearbyStores,
  normalizeStores,
} from '../utils/storeMap';

jest.mock('../api/apiClient', () => ({
  storeAPI: { getNearby: jest.fn() },
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

    expect(storeAPI.getNearby).toHaveBeenCalledWith(37.5666, 126.9784, 3);
    expect(stores).toHaveLength(1);
    expect(stores[0].storeId).toBe('x');
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
