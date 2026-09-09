/**
 * 테스트: 상품 상세 화면 테스트 (ProductDetailScreen.test)
 * 역할: 판매자/구매자별 UI 렌더링, API 호출, 화면 이동 등의 동작을 검증합니다.
 */
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text, Animated } from 'react-native';
import { secureStorage } from '../utils/secureStorage';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import { productAPI, chatAPI } from '../api/apiClient';
import { useMockMode } from '../contexts/MockModeContext';

jest.mock('../utils/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn(),
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../assets/back.svg', () => 'BackIcon');
jest.mock('../assets/heart.svg', () => 'HeartIcon');
jest.mock('../assets/detail_heart.svg', () => 'DetailHeartIcon');
jest.mock('../assets/detail_chat.svg', () => 'DetailChatIcon');

jest.mock('../components/BottomNav', () => 'BottomNav');

jest.mock('../contexts/MockModeContext', () => ({
  useMockMode: jest.fn(),
}));

jest.mock('../api/apiClient', () => ({
  productAPI: {
    getPostDetail: jest.fn(),
    updatePost: jest.fn(),
  },
  chatAPI: {
    createChatRoom: jest.fn(),
  },
}));

jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Path: 'Path',
  G: 'G',
  Rect: 'Rect',
  Circle: 'Circle',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
}));

// useNativeDriver: true 는 네이티브 스레드 콜백을 기다리므로 act()가 무한 대기한다.
// timing을 동기적으로 즉시 완료시켜 이 문제를 해결한다.
beforeAll(() => {
  jest.spyOn(Animated, 'timing').mockImplementation((value: any, config: any) => ({
    start: (callback?: (result: { finished: boolean }) => void) => {
      value.setValue(config.toValue);
      callback?.({ finished: true });
    },
    stop: jest.fn(),
    reset: jest.fn(),
  }));
});

afterAll(() => {
  (Animated.timing as jest.Mock).mockRestore();
});

// ── 공통 픽스처 ──────────────────────────────────────────────────────────────

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
// navigation.addListener('focus', ...)는 unsubscribe 함수를 반환한다
const mockAddListener = jest.fn(() => jest.fn());
const mockNavigation = { goBack: mockGoBack, navigate: mockNavigate, addListener: mockAddListener };

const mockRoute = {
  params: {
    productId: '1',
    productName: 'Test Product',
    productPrice: 10000,
    productImageUrl: 'https://example.com/image.jpg',
  },
};

const mockPost = {
  id: 1,
  title: 'Test Product',
  price: 10000,
  images: [{ imageUrl: 'https://example.com/image.jpg', imageKey: 'key1' }],
  description: 'Test description',
  sellerId: 42,
  sellerNickname: 'seller1',
  productCategory: 'GAME',
  productCondition: 'NEW',
  productStatus: 'ON_SALE',
  createdAt: '2024-01-01T10:00:00+09:00',
};

// async effect의 continuations(await mock())이 microtask로 큐잉되므로,
// setTimeout(0)으로 모든 microtask를 드레인한 뒤 act가 state 업데이트를 처리하도록 한다
const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0));

// 컴포넌트를 렌더하고 모든 비동기 effect(API 호출, AsyncStorage)가 완료될 때까지 대기
const renderScreen = async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <ProductDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />,
    );
    await flushPromises();
  });
  return renderer;
};

// 렌더 트리 전체 텍스트에 특정 문자열이 포함되어 있는지 확인
const hasText = (renderer: ReactTestRenderer.ReactTestRenderer, text: string) =>
  JSON.stringify(renderer.toJSON()).includes(text);

// node.children을 재귀 탐색하여 특정 텍스트가 포함되어 있는지 확인
// React 19에서 node.toJSON()이 null을 반환하는 경우를 우회한다
function subtreeContainsText(node: any, text: string): boolean {
  if (!node) return false;
  if (typeof node === 'string') return node.includes(text);
  if (typeof node.props?.children === 'string' && node.props.children.includes(text)) return true;
  const kids: any[] = node.children ?? [];
  return kids.some((child: any) => subtreeContainsText(child, text));
}

// onPress prop을 가지며 서브트리에 특정 텍스트를 포함하는 버튼 노드를 찾는 헬퍼
const findButtonWithText = (renderer: ReactTestRenderer.ReactTestRenderer, text: string) =>
  renderer.root
    .findAll((node: any) => typeof node.props?.onPress === 'function')
    .find((node: any) => subtreeContainsText(node, text));

// ── 판매자 UI ────────────────────────────────────────────────────────────────

describe('ProductDetailScreen - 판매자 UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: false });
    // sellerId(42) === currentUserId(42) → isSeller = true
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost } },
    });
    (secureStorage.getItem as jest.Mock).mockResolvedValue('42');
    (productAPI.updatePost as jest.Mock).mockResolvedValue({ status: 200 });
  });

  it('"판매상태 수정" 버튼을 표시한다', async () => {
    const renderer = await renderScreen();
    expect(hasText(renderer, '판매상태 수정')).toBe(true);
  });

  it('"상품정보 수정" 버튼을 표시한다', async () => {
    const renderer = await renderScreen();
    expect(hasText(renderer, '상품정보 수정')).toBe(true);
  });

  it('"채팅하기" 버튼을 표시하지 않는다', async () => {
    const renderer = await renderScreen();
    expect(hasText(renderer, '1:1 구매문의')).toBe(false);
  });

  it('"상품정보 수정" 클릭 시 ProductEdit 화면으로 이동한다', async () => {
    const renderer = await renderScreen();
    await act(async () => {
      findButtonWithText(renderer, '상품정보 수정')!.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('ProductEdit', expect.objectContaining({
      postId: '1',
      title: 'Test Product',
      description: 'Test description',
      price: 10000,
    }));
  });

  it('"판매상태 수정" 클릭 시 상태 선택 모달이 열린다', async () => {
    const renderer = await renderScreen();
    await act(async () => {
      findButtonWithText(renderer, '판매상태 수정')!.props.onPress();
    });
    // 모달 안의 3가지 선택지가 모두 렌더된다
    expect(hasText(renderer, '판매중')).toBe(true);
    expect(hasText(renderer, '예약중')).toBe(true);
    expect(hasText(renderer, '판매완료')).toBe(true);
  });

  it('다른 판매상태 선택 후 "선택완료" 클릭 시 updatePost를 호출한다', async () => {
    const renderer = await renderScreen();

    // 모달 열기
    await act(async () => {
      findButtonWithText(renderer, '판매상태 수정')!.props.onPress();
    });
    // '예약중' 선택 (현재 ON_SALE → RESERVED로 변경)
    await act(async () => {
      findButtonWithText(renderer, '예약중')!.props.onPress();
    });
    await act(async () => {
      findButtonWithText(renderer, '선택완료')!.props.onPress();
    });

    expect(productAPI.updatePost).toHaveBeenCalledWith('1', { productStatus: 'RESERVED' });
  });

  it('같은 판매상태 재선택 후 "선택완료" 클릭 시 updatePost를 호출하지 않는다', async () => {
    const renderer = await renderScreen();

    await act(async () => {
      findButtonWithText(renderer, '판매상태 수정')!.props.onPress();
    });
    // '판매중' 선택 — 현재 상태(ON_SALE)와 동일
    await act(async () => {
      findButtonWithText(renderer, '판매중')!.props.onPress();
    });
    await act(async () => {
      findButtonWithText(renderer, '선택완료')!.props.onPress();
    });

    expect(productAPI.updatePost).not.toHaveBeenCalled();
  });
});

// ── 구매자 UI ────────────────────────────────────────────────────────────────

describe('ProductDetailScreen - 구매자 UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: false });
    // sellerId(42) !== currentUserId(99) → isSeller = false
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost } },
    });
    (secureStorage.getItem as jest.Mock).mockResolvedValue('99');
  });

  it('"채팅하기" 버튼을 표시한다', async () => {
    const renderer = await renderScreen();
    expect(hasText(renderer, '1:1 구매문의')).toBe(true);
  });

  it('"결제하기" 버튼을 표시한다', async () => {
    const renderer = await renderScreen();
    expect(hasText(renderer, '결제하기')).toBe(true);
  });

  it('"판매상태 수정" 버튼을 표시하지 않는다', async () => {
    const renderer = await renderScreen();
    expect(hasText(renderer, '판매상태 수정')).toBe(false);
  });

  it('"결제하기" 클릭 시 Payment 화면으로 이동한다', async () => {
    const renderer = await renderScreen();
    await act(async () => {
      findButtonWithText(renderer, '결제하기')!.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Payment', {
      productId: '1',
      productName: 'Test Product',
      productPrice: 10000,
      productImageUrl: 'https://example.com/image.jpg',
    });
  });
});

// ── 채팅하기 ─────────────────────────────────────────────────────────────────

describe('ProductDetailScreen - 채팅하기', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: false });
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost } },
    });
    (secureStorage.getItem as jest.Mock).mockResolvedValue('99');
  });

  it('"채팅하기" 클릭 시 chatAPI.createChatRoom을 productId(숫자)로 호출한다', async () => {
    (chatAPI.createChatRoom as jest.Mock).mockResolvedValue({
      data: { chatRoomId: 100, sellerNickname: 'seller1' },
    });
    const renderer = await renderScreen();
    await act(async () => {
      findButtonWithText(renderer, '1:1 구매문의')!.props.onPress();
    });
    expect(chatAPI.createChatRoom).toHaveBeenCalledWith(1);
  });

  it('채팅방 생성 성공 시 Chat 화면으로 이동한다', async () => {
    (chatAPI.createChatRoom as jest.Mock).mockResolvedValue({
      data: { chatRoomId: 100, sellerNickname: 'seller1' },
    });
    const renderer = await renderScreen();
    await act(async () => {
      findButtonWithText(renderer, '1:1 구매문의')!.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Chat', {
      chatRoomId: 100,
      opponentNickname: 'seller1',
    });
  });

  it('채팅방 생성 401 에러 시 Login 화면으로 이동한다', async () => {
    (chatAPI.createChatRoom as jest.Mock).mockRejectedValue({
      response: { status: 401 },
    });
    const renderer = await renderScreen();
    await act(async () => {
      findButtonWithText(renderer, '1:1 구매문의')!.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});

// ── API 데이터 매핑 ──────────────────────────────────────────────────────────

describe('ProductDetailScreen - API 데이터 매핑', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMockMode as jest.Mock).mockReturnValue({ isMockMode: false });
    (secureStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('images 배열이 없으면 route.params의 imageUrl을 유지한다', async () => {
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost, images: undefined } },
    });
    const renderer = await renderScreen();
    expect(JSON.stringify(renderer.toJSON())).toContain('https://example.com/image.jpg');
  });

  it('description이 없으면 "상세 설명이 없습니다."를 표시한다', async () => {
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost, description: undefined } },
    });
    const renderer = await renderScreen();
    const textNodes = renderer.root.findAllByType(Text);
    expect(textNodes.some(n => n.props.children === '상세 설명이 없습니다.')).toBe(true);
  });

  it('sellerNickname이 없으면 sellerId를 문자열로 표시한다', async () => {
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost, sellerNickname: undefined } },
    });
    const renderer = await renderScreen();
    const textNodes = renderer.root.findAllByType(Text);
    expect(textNodes.some(n => n.props.children === '42')).toBe(true);
  });

  it('seller 정보가 없으면 "알 수 없음"을 표시한다', async () => {
    (productAPI.getPostDetail as jest.Mock).mockResolvedValue({
      data: { data: { ...mockPost, sellerId: undefined, sellerNickname: undefined } },
    });
    const renderer = await renderScreen();
    const textNodes = renderer.root.findAllByType(Text);
    expect(textNodes.some(n => n.props.children === '알 수 없음')).toBe(true);
  });
});
