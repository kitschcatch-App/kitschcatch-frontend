/**
 * 테스트: 알림 화면 테스트 (NotificationScreen.test)
 * 역할: 알림 목록의 상품 이미지(productImageUrl) 조건부 렌더링을 검증합니다.
 */
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Image } from 'react-native';
import NotificationScreen from '../screens/home/NotificationScreen';
import { notificationAPI } from '../api/apiClient';
import { useMockMode } from '../contexts/MockModeContext';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const ReactActual = require('react');
    ReactActual.useEffect(() => {
      callback();
    }, []);
  },
}));

jest.mock('../contexts/MockModeContext', () => ({
  useMockMode: jest.fn(),
}));

jest.mock('../api/apiClient', () => ({
  notificationAPI: {
    getNotifications: jest.fn(),
    readNotification: jest.fn(),
  },
}));

// RN 컴포넌트 첫 렌더는 모듈 로드로 콜드 스타트가 느려 기본 5s를 넘길 수 있음
jest.setTimeout(20000);

const mockNavigation: any = { goBack: jest.fn(), navigate: jest.fn() };
const mockRoute: any = {};

const renderScreen = async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <NotificationScreen navigation={mockNavigation} route={mockRoute} />,
    );
  });
  return renderer;
};

describe('NotificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: false });
  });

  it('productImageUrl이 있으면 상품 이미지를 렌더링한다', async () => {
    (notificationAPI.getNotifications as jest.Mock).mockResolvedValue({
      data: {
        data: {
          content: [
            {
              id: 1,
              type: 'PAYMENT_SUCCESS',
              title: '결제가 완료되었습니다.',
              body: '빈티지 머그컵 결제가 완료되었습니다.',
              read: false,
              createdAt: '2026-08-19T12:00:00',
              productImageUrl: 'https://cdn.example.com/posts/10/thumbnail.jpg',
            },
          ],
          page: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    const renderer = await renderScreen();
    const images = renderer.root.findAllByType(Image);

    expect(images).toHaveLength(1);
    expect(images[0].props.source).toEqual({ uri: 'https://cdn.example.com/posts/10/thumbnail.jpg' });
  });

  it('productImageUrl이 null이면 상품 이미지를 렌더링하지 않는다', async () => {
    (notificationAPI.getNotifications as jest.Mock).mockResolvedValue({
      data: {
        data: {
          content: [
            {
              id: 2,
              type: 'NOTICE',
              title: '서비스 점검 안내',
              body: '9/20 02:00 ~ 04:00 점검이 진행됩니다.',
              read: false,
              createdAt: '2026-08-19T12:00:00',
              productImageUrl: null,
            },
          ],
          page: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    const renderer = await renderScreen();
    const images = renderer.root.findAllByType(Image);

    expect(images).toHaveLength(0);
  });
});
