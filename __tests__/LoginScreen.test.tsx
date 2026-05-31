import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import { secureStorage } from '../utils/secureStorage';
import LoginScreen from '../screens/LoginScreen';

jest.mock('../utils/secureStorage', () => ({
  secureStorage: {
    setItem: jest.fn(),
  },
}));

jest.mock('@react-native-seoul/kakao-login', () => ({
  login: jest.fn(),
}));

jest.mock('../api/apiClient', () => ({
  authAPI: {
    getNonce: jest.fn(),
    loginWithKakao: jest.fn(),
  },
}));

// SafeAreaView의 네이티브 모듈을 일반 View로 대체
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View, SafeAreaProvider: View };
});

// SVG 파일을 문자열 태그로 대체
jest.mock('../assets/kitschcatch.svg', () => 'KitschcatchIcon');
jest.mock('../assets/kakao.svg', () => 'KakaoIcon');

// react-native-svg 컴포넌트 모킹
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Ellipse: 'Ellipse',
  Defs: 'Defs',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
}));

// SuccessView: 애니메이션 타이머 없이 visible=true 즉시 onDismiss 호출
jest.mock('../components/SuccessView', () => {
  const React = require('react');
  return function MockSuccessView({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
    React.useEffect(() => {
      if (visible) onDismiss();
    }, [visible]);
    return null;
  };
});

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const navigation: any = { replace: mockReplace, navigate: mockNavigate };
const route: any = {};

// create()를 act 안에서 실행해야 React 19 스케줄러가 완전히 플러시됨
const renderLogin = async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <LoginScreen navigation={navigation} route={route} />,
    );
  });
  return renderer;
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (secureStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('카카오 로그인 버튼 클릭 시 userId "42"를 secureStorage에 저장한다', async () => {
    const renderer = await renderLogin();
    const [kakaoButton] = renderer.root.findAllByType(TouchableOpacity);

    await act(async () => {
      kakaoButton.props.onPress();
    });

    expect(secureStorage.setItem).toHaveBeenCalledWith('userId', '42');
  });

  it('카카오 로그인 버튼 클릭 시 ProductList로 이동한다', async () => {
    const renderer = await renderLogin();
    const [kakaoButton] = renderer.root.findAllByType(TouchableOpacity);

    await act(async () => {
      kakaoButton.props.onPress();
    });

    expect(mockReplace).toHaveBeenCalledWith('ProductList');
  });

  it('카카오 로그인은 userId 저장 후 화면을 전환한다', async () => {
    const callOrder: string[] = [];
    (secureStorage.setItem as jest.Mock).mockImplementation(async () => {
      callOrder.push('setItem');
    });
    mockReplace.mockImplementation(() => {
      callOrder.push('replace');
    });

    const renderer = await renderLogin();
    const [kakaoButton] = renderer.root.findAllByType(TouchableOpacity);

    await act(async () => {
      kakaoButton.props.onPress();
    });

    expect(callOrder).toEqual(['setItem', 'replace']);
  });

  it('API 테스트 버튼 클릭 시 ApiTest 화면으로 이동한다', async () => {
    const renderer = await renderLogin();
    const buttons = renderer.root.findAllByType(TouchableOpacity);
    const devButton = buttons[1]; // 두 번째 버튼: 개발자용 API 테스트

    await act(async () => {
      devButton.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ApiTest');
  });
});
