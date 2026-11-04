/**
 * 테스트: 알림 화면 테스트 (NotificationScreen.test)
 * 역할: 알림 목록의 상품 이미지(productImageUrl) 조건부 렌더링을 검증합니다.
 */
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Image, TouchableOpacity } from 'react-native';
import NotificationScreen from '../screens/home/NotificationScreen';
import { chatAPI, notificationAPI, orderAPI } from '../api/apiClient';
import { secureStorage } from '../utils/secureStorage';
import { styles } from '../screens/home/NotificationScreen.styles';
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
  chatAPI: { getChatRooms: jest.fn() },
  orderAPI: { getOrder: jest.fn() },
}));

jest.mock('../utils/secureStorage', () => ({
  secureStorage: { getItem: jest.fn() },
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
          notifications: [
            {
              id: 1,
              type: 'PAYMENT_SUCCESS',
              title: '결제가 완료되었습니다.',
              body: '빈티지 머그컵 결제가 완료되었습니다.',
              readAt: null,
              createdAt: '2026-08-19T12:00:00',
              productImageUrl: 'https://cdn.example.com/posts/10/thumbnail.jpg',
            },
          ],
          page: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
          unreadCount: 1,
        },
      },
    });

    const renderer = await renderScreen();
    const images = renderer.root.findAllByType(Image);

    expect(images).toHaveLength(1);
    expect(images[0].props.source).toEqual({ uri: 'https://cdn.example.com/posts/10/thumbnail.jpg' });
  });

  it('readAt이 없으면 안읽음, 있으면 읽음 스타일로 표시한다', async () => {
    (notificationAPI.getNotifications as jest.Mock).mockResolvedValue({
      data: {
        data: {
          notifications: [
            { id: 1, type: 'CHAT_MESSAGE', title: '안읽음', targetId: '1', createdAt: '2026-08-19T12:00:00', readAt: null },
            { id: 2, type: 'CHAT_MESSAGE', title: '읽음', targetId: '2', createdAt: '2026-08-19T12:00:00', readAt: '2026-08-19T13:00:00' },
          ],
          page: 0, size: 20, totalElements: 2, totalPages: 1, unreadCount: 1,
        },
      },
    });

    const renderer = await renderScreen();
    const items = renderer.root.findAllByType(TouchableOpacity).filter(n => n.props.onPress);
    const hasUnreadStyle = (n: any) => [n.props.style].flat(Infinity).includes(styles.itemUnread);

    // 앞 2개는 헤더 버튼(뒤로가기·설정), 뒤 2개가 알림 항목
    expect(items.slice(-2).map(hasUnreadStyle)).toEqual([true, false]);
  });

  it('productImageUrl이 null이면 상품 이미지를 렌더링하지 않는다', async () => {
    (notificationAPI.getNotifications as jest.Mock).mockResolvedValue({
      data: {
        data: {
          notifications: [
            {
              id: 2,
              type: 'PAYMENT_CANCELED',
              title: '서비스 점검 안내',
              body: '9/20 02:00 ~ 04:00 점검이 진행됩니다.',
              readAt: null,
              createdAt: '2026-08-19T12:00:00',
              productImageUrl: null,
            },
          ],
          page: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
          unreadCount: 1,
        },
      },
    });

    const renderer = await renderScreen();
    const images = renderer.root.findAllByType(Image);

    expect(images).toHaveLength(0);
  });
  describe('알림 탭 시 화면 이동', () => {
    const load = async (type: string, targetId: string) => {
      (notificationAPI.getNotifications as jest.Mock).mockResolvedValue({
        data: {
          data: {
            notifications: [{ id: 1, type, title: 't', targetId, createdAt: '2026-08-19T12:00:00', readAt: null }],
            page: 0, size: 20, totalElements: 1, totalPages: 1, unreadCount: 1,
          },
        },
      });
      (notificationAPI.readNotification as jest.Mock).mockResolvedValue({});
      const renderer = await renderScreen();
      const item = renderer.root.findAllByType(TouchableOpacity).filter(n => n.props.onPress).slice(-1)[0];
      await act(async () => {
        await item.props.onPress();
      });
    };

    const order = (sellerId: number) => ({
      data: {
        data: {
          orderId: 'ORD-AB12', amount: 15000,
          post: { id: 1, title: '피규어', thumbnailUrl: 'https://cdn/x.jpg' },
          buyer: { id: 2, nickname: 'b' }, seller: { id: sellerId, nickname: 's' },
        },
      },
    });

    it('채팅 알림은 채팅방 목록에서 상대 닉네임을 찾아 Chat으로 이동한다', async () => {
      (chatAPI.getChatRooms as jest.Mock).mockResolvedValue({
        data: { data: [{ chatRoomId: 12, opponentNickname: '잘자는고양이' }] },
      });

      await load('CHAT_MESSAGE', '12');

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Chat', { chatRoomId: 12, opponentNickname: '잘자는고양이' });
    });

    it('결제 알림: 내가 판매자면 OrderDetail로 이동한다', async () => {
      (orderAPI.getOrder as jest.Mock).mockResolvedValue(order(7));
      (secureStorage.getItem as jest.Mock).mockResolvedValue('7');

      await load('PAYMENT_SUCCESS', 'ORD-AB12');

      expect(orderAPI.getOrder).toHaveBeenCalledWith('ORD-AB12');
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'OrderDetail',
        expect.objectContaining({ orderNumber: 'ORD-AB12', productTitle: '피규어', productPrice: 15000 }),
      );
    });

    it('결제 알림: 내가 구매자면 PurchaseOrderDetail로 이동한다', async () => {
      (orderAPI.getOrder as jest.Mock).mockResolvedValue(order(7));
      (secureStorage.getItem as jest.Mock).mockResolvedValue('2');

      await load('PAYMENT_CANCELED', 'ORD-AB12');

      expect(mockNavigation.navigate).toHaveBeenCalledWith('PurchaseOrderDetail', expect.anything());
    });

    it('모르는 type이면 이동하지 않는다', async () => {
      await load('NOTICE', '1');

      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });
});
