import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import { login } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import { secureStorage } from '../utils/secureStorage';
import { authAPI } from '../api/apiClient';
import LoginScreen from '../screens/auth/LoginScreen';

jest.mock('../utils/secureStorage', () => ({
  secureStorage: {
    setItem: jest.fn(),
  },
}));

jest.mock('@react-native-seoul/kakao-login', () => ({
  login: jest.fn(),
  loginWithNewScopes: jest.fn(),
}));

jest.mock('@react-native-seoul/naver-login', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    login: jest.fn(),
  },
}));

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    NAVER_CLIENT_ID: 'test-client-id',
    NAVER_CLIENT_SECRET: 'test-client-secret',
    NAVER_APP_NAME: 'kitschcatch',
  },
}));

jest.mock('../api/apiClient', () => ({
  authAPI: {
    getNonce: jest.fn(),
    loginWithKakao: jest.fn(),
    loginWithNaver: jest.fn(),
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
jest.mock('../assets/naver.svg', () => 'NaverIcon');
jest.mock('../assets/apple.svg', () => 'AppleIcon');

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

// RN 컴포넌트 첫 렌더는 모듈 로드로 콜드 스타트가 느려 기본 5s를 넘길 수 있음
jest.setTimeout(20000);

const mockLogin = login as jest.Mock;
const mockNaverLogin = NaverLogin.login as jest.Mock;

// 버튼 렌더 순서: 0 카카오 / 1 네이버 / 2 애플 / 3 약관 / 4 정책 / 5 개발자 API 테스트
const BUTTON = { kakao: 0, naver: 1, apple: 2, devTest: 5 } as const;

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const navigation: any = { replace: mockReplace, navigate: mockNavigate };
const route: any = {};

// 앱 JWT 발급 응답 (카카오/네이버 공통 형태)
const jwtResponse = {
  data: { data: { accessToken: 'app-access', refreshToken: 'app-refresh', user: { id: 42 } } },
};

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

const pressButton = async (renderer: ReactTestRenderer.ReactTestRenderer, index: number) => {
  const button = renderer.root.findAllByType(TouchableOpacity)[index];
  await act(async () => {
    button.props.onPress();
  });
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (secureStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    (authAPI.getNonce as jest.Mock).mockResolvedValue({ data: { data: { nonce: 'test-nonce' } } });
    (authAPI.loginWithKakao as jest.Mock).mockResolvedValue(jwtResponse);
    (authAPI.loginWithNaver as jest.Mock).mockResolvedValue(jwtResponse);
    mockLogin.mockResolvedValue({ idToken: 'kakao-id-token' });
    mockNaverLogin.mockResolvedValue({
      isSuccess: true,
      successResponse: { accessToken: 'naver-access-token' },
    });
  });

  describe('카카오 로그인', () => {
    it('버튼 클릭 시 userId "42"를 secureStorage에 저장한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.kakao);

      expect(secureStorage.setItem).toHaveBeenCalledWith('userId', '42');
    });

    it('버튼 클릭 시 ProductList로 이동한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.kakao);

      expect(mockReplace).toHaveBeenCalledWith('ProductList');
    });
  });

  describe('네이버 로그인', () => {
    it('버튼 클릭 시 네이버 accessToken으로 백엔드 로그인을 호출한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.naver);

      expect(authAPI.loginWithNaver).toHaveBeenCalledWith('naver-access-token');
    });

    it('버튼 클릭 시 userId 저장 후 ProductList로 이동한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.naver);

      expect(secureStorage.setItem).toHaveBeenCalledWith('userId', '42');
      expect(mockReplace).toHaveBeenCalledWith('ProductList');
    });

    it('사용자가 취소하면 백엔드 로그인을 호출하지 않는다', async () => {
      mockNaverLogin.mockResolvedValue({
        isSuccess: false,
        failureResponse: { isCancel: true, message: 'user cancel' },
      });

      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.naver);

      expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('API 테스트 버튼 클릭 시 ApiTest 화면으로 이동한다', async () => {
    const renderer = await renderLogin();
    await pressButton(renderer, BUTTON.devTest);

    expect(mockNavigate).toHaveBeenCalledWith('ApiTest');
  });
});
