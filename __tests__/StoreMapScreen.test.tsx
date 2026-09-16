import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import { storeAPI } from '../api/apiClient';
import StoreMapScreen from '../screens/store/StoreMapScreen';

jest.mock('../components/BottomNav', () => 'BottomNav');

jest.mock('../api/apiClient', () => ({
  storeAPI: {
    getNearby: jest.fn(),
  },
}));

const NEARBY_STORES = [
  {
    storeId: 's1',
    name: '애니메이트 홍대점',
    latitude: 37.5568,
    longitude: 126.9236,
    address: '서울 마포구',
  },
  {
    storeId: 's2',
    name: '가챠샵 신촌점',
    latitude: 37.5598,
    longitude: 126.9425,
    address: '서울 서대문구',
  },
];

const navigation: any = { navigate: jest.fn() };
const route: any = { key: 'StoreMap', name: 'StoreMap' };

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

const render = async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <StoreMapScreen navigation={navigation} route={route} />,
    );
  });
  await flush();
  return renderer;
};

describe('StoreMapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storeAPI.getNearby as jest.Mock).mockResolvedValue({
      data: { data: NEARBY_STORES },
    });
    (Geolocation.getCurrentPosition as jest.Mock).mockImplementation(success =>
      success({ coords: { latitude: 37.5563, longitude: 126.9236 } }),
    );
  });

  it('헤더 제목과 매장 검색창, 네이버 지도를 렌더링한다', async () => {
    const renderer = await render();

    expect(renderer.root.findAllByType(NaverMapView)).toHaveLength(1);
    expect(renderer.root.findByType(TextInput).props.placeholder).toBe(
      '매장을 검색해보세요',
    );

    const texts = renderer.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(texts).toContain('매장지도');
  });

  it('위치 권한 요청 후 현재 위치로 주변 매장을 조회한다', async () => {
    await render();

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(storeAPI.getNearby).toHaveBeenCalledWith(37.5563, 126.9236, 3);
  });

  it('조회된 매장 수만큼 마커(NaverMapMarkerOverlay)를 표시한다', async () => {
    const renderer = await render();

    const markers = renderer.root.findAllByType(NaverMapMarkerOverlay);
    expect(markers).toHaveLength(NEARBY_STORES.length);
  });

  it('반경 칩을 바꾸면 해당 반경으로 다시 조회한다', async () => {
    const renderer = await render();

    const chip5 = renderer.root.findAllByType(TouchableOpacity).find(node => {
      const label = node.findAllByType(Text)[0]?.props.children;
      return Array.isArray(label) ? label.join('') === '5km' : label === '5km';
    });

    await act(async () => {
      chip5?.props.onPress();
    });
    await flush();

    expect(storeAPI.getNearby).toHaveBeenLastCalledWith(37.5563, 126.9236, 5);
  });

  it('위치 권한이 거부되면 기본 위치 안내 배너를 보여준다', async () => {
    (Geolocation.requestAuthorization as jest.Mock).mockImplementation(
      (_success, error) => error && error({ message: 'denied' }),
    );

    const renderer = await render();

    const texts = renderer.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(texts).toContain(
      '위치 권한을 허용하면 내 주변 매장을 볼 수 있어요.',
    );
  });
});
