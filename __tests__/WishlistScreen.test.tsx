/**
 * 테스트: 관심목록 화면 테스트 (WishlistScreen.test)
 * 역할: 관심 매장 탭이 GET /users/me/favorite-stores 응답을 보여주고 상세로 이동하는지 검증합니다.
 */
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import WishlistScreen from '../screens/mypage/WishlistScreen';
import TabBar from '../components/TabBar';
import { storeAPI } from '../api/apiClient';
import { useMockMode } from '../contexts/MockModeContext';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const ReactActual = require('react');
    ReactActual.useEffect(() => callback(), []);
  },
}));

jest.mock('../contexts/MockModeContext', () => ({
  useMockMode: jest.fn(),
}));

jest.mock('../api/apiClient', () => ({
  productAPI: { getFavoritePosts: jest.fn().mockResolvedValue({ data: { data: { content: [], last: true } } }) },
  storeAPI: { getFavoriteStores: jest.fn(), getStore: jest.fn() },
}));

jest.setTimeout(20000);

const navigation: any = { goBack: jest.fn(), navigate: jest.fn() };

const renderStoreTab = async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(<WishlistScreen navigation={navigation} route={{} as any} />);
  });
  await act(async () => {
    renderer.root.findByType(TabBar).props.onChange('store');
  });
  return renderer;
};

describe('WishlistScreen 관심 매장 탭', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: false });
    // 매일 00:00~00:00(24시간)이라 언제 실행해도 영업 중
    const allDay = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(d => ({
      dayOfWeek: d, openTime: '00:00', closeTime: '00:00', closed: false,
    }));
    (storeAPI.getStore as jest.Mock).mockResolvedValue({ data: { data: { businessHours: allDay } } });
    (storeAPI.getFavoriteStores as jest.Mock).mockResolvedValue({
      data: {
        data: {
          content: [
            { id: 7, name: '홍대점', address: '서울 마포구', latitude: 37.5, longitude: 126.9, phone: null, favorited: true, thumbnailUrl: null },
          ],
          page: 0, size: 20, totalElements: 1, totalPages: 1,
        },
      },
    });
  });

  it('서버의 관심 매장 목록(이름·주소)을 보여준다', async () => {
    const renderer = await renderStoreTab();

    const texts = renderer.root.findAllByType(Text).map(n => n.props.children);
    expect(storeAPI.getFavoriteStores).toHaveBeenCalledWith(0, 20);
    expect(texts).toContain('홍대점');
    expect(texts).toContain('서울 마포구');
  });

  it('평점과 영업 상태(상세 API로 계산)를 함께 보여준다', async () => {
    const renderer = await renderStoreTab();

    const texts = renderer.root.findAllByType(Text).map(n => n.props.children);
    expect(storeAPI.getStore).toHaveBeenCalledWith(7);
    expect(texts).toContain(4.5);
    expect(texts).toContain('영업 중');
  });

  it('상세정보를 누르면 매장 정보를 넘겨 StoreDetail로 이동한다', async () => {
    const renderer = await renderStoreTab();

    const detailButton = renderer.root
      .findAllByType(TouchableOpacity)
      .find(n => n.findAllByType(Text).some(t => t.props.children === '상세정보'));
    await act(async () => {
      detailButton?.props.onPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('StoreDetail', {
      storeId: '7',
      storeName: '홍대점',
      latitude: 37.5,
      longitude: 126.9,
    });
  });

  it('Mock 모드에서는 API를 호출하지 않는다', async () => {
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: true });

    await renderStoreTab();

    expect(storeAPI.getFavoriteStores).not.toHaveBeenCalled();
  });
});
