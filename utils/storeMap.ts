/**
 * 파일: storeMap.ts
 * 역할: 매장지도 화면(StoreMapScreen)의 로직을 화면에서 분리한 모듈입니다.
 *       위치 권한 요청 / 현재 위치 조회 / 주변 매장 API 호출 및 응답 정규화를 담당합니다.
 */
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { storeAPI } from '../api/apiClient';
import { getMockNearbyStores, mockDelay } from '../api/mockData';

export type Coord = { latitude: number; longitude: number };

export type RadiusKm = 1 | 3 | 5;
export const RADIUS_OPTIONS: RadiusKm[] = [1, 3, 5];
export const DEFAULT_RADIUS_KM: RadiusKm = 3;

// 위치 권한 거부/실패 시 사용할 기본 좌표 (서울시청)
export const DEFAULT_COORD: Coord = { latitude: 37.5666, longitude: 126.9784 };

// Web Mercator 기준 줌 0에서의 적도 위 미터/픽셀 값 (네이버 지도도 동일한 타일 체계 사용)
const METERS_PER_PIXEL_AT_ZOOM_0 = 156543.03392;
// 반경 원이 화면 가장자리에 딱 붙지 않도록 주는 여백 비율
const RADIUS_VIEWPORT_PADDING = 0.8;

/** 선택한 반경(km)이 화면 너비 안에 다 들어오는 네이버 지도 줌 레벨을 계산한다. */
export function calculateZoomForRadius(
  radiusKm: RadiusKm,
  latitude: number,
  viewportWidthPx: number,
): number {
  const radiusMeters = radiusKm * 1000;
  const paddedWidthPx = viewportWidthPx * RADIUS_VIEWPORT_PADDING;
  const metersPerPixel = (2 * radiusMeters) / paddedWidthPx;
  const zoom =
    Math.log2(
      (METERS_PER_PIXEL_AT_ZOOM_0 * Math.cos((latitude * Math.PI) / 180)) /
        metersPerPixel,
    );
  return Math.min(18, Math.max(5, zoom));
}

export type BusinessStatus = 'OPEN' | 'CLOSED' | 'UNKNOWN';

export type Store = {
  storeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phoneNumber: string | null;
  businessStatus: BusinessStatus;
  businessHours: string | null;
  distanceKm: number | null;
  isFavorite: boolean;
};

/**
 * 위치 권한을 요청한다.
 * - Android: ACCESS_FINE_LOCATION 런타임 권한
 * - iOS: 시스템 권한 팝업 (실제 위치 조회 시점에 노출)
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: '위치 권한 요청',
        message: '내 주변 매장을 지도에 표시하기 위해 위치 정보가 필요합니다.',
        buttonPositive: '확인',
        buttonNegative: '취소',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  return new Promise(resolve => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      () => resolve(false),
    );
  });
}

/** 현재 위치 좌표를 조회한다. 실패 시 reject. */
export function getCurrentCoord(): Promise<Coord> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error =>
        reject(new Error(error?.message ?? '현재 위치를 가져오지 못했습니다.')),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  });
}

/** 서버/목의 매장 응답을 화면에서 쓰는 Store 형태로 정규화한다. */
export function normalizeStores(raw: unknown): Store[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): Store => {
      const s = item as Record<string, any>;
      const distanceKm =
        s.distanceKm != null
          ? Number(s.distanceKm)
          : s.distance != null
          ? Number(s.distance) / 1000
          : null;

      return {
        storeId: String(s.storeId ?? s.id ?? ''),
        name: s.name ?? s.storeName ?? '',
        latitude: Number(s.latitude ?? s.lat),
        longitude: Number(s.longitude ?? s.lng ?? s.lon),
        address: s.address ?? s.roadAddress ?? '',
        phoneNumber: s.phoneNumber ?? s.phone ?? s.tel ?? null,
        businessStatus: normalizeBusinessStatus(s),
        businessHours: s.businessHours ?? s.operatingHours ?? null,
        distanceKm:
          distanceKm != null && Number.isFinite(distanceKm) ? distanceKm : null,
        isFavorite: Boolean(s.isFavorite ?? s.isFavoriteStore ?? false),
      };
    })
    .filter(
      store =>
        store.storeId !== '' &&
        Number.isFinite(store.latitude) &&
        Number.isFinite(store.longitude),
    );
}

function normalizeBusinessStatus(s: Record<string, any>): BusinessStatus {
  if (s.businessStatus === 'OPEN' || s.businessStatus === 'CLOSED')
    return s.businessStatus;
  if (s.isOpen === true) return 'OPEN';
  if (s.isOpen === false) return 'CLOSED';
  return 'UNKNOWN';
}

/** 주변 매장 목록을 조회한다. (Mock 모드면 가상 데이터) */
export async function fetchNearbyStores(
  coord: Coord,
  radiusKm: RadiusKm,
  isMockMode: boolean,
): Promise<Store[]> {
  if (isMockMode) {
    await mockDelay(300);
    return normalizeStores(getMockNearbyStores(coord, radiusKm).data.data);
  }

  const res = await storeAPI.getNearby(
    coord.latitude,
    coord.longitude,
    radiusKm,
  );
  const body = res.data?.data ?? res.data;
  const list = Array.isArray(body) ? body : body?.content ?? body?.stores ?? [];
  return normalizeStores(list);
}
