import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import { login } from '@react-native-seoul/kakao-login';
import { startNaverLogin } from '../utils/naverAuth';
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

jest.mock('../utils/naverAuth', () => ({
  NAVER_CANCELLED: 'NAVER_CANCELLED',
  startNaverLogin: jest.fn(),
}));

jest.mock('../api/apiClient', () => ({
  authAPI: {
    getNonce: jest.fn(),
    loginWithKakao: jest.fn(),
    getNaverState: jest.fn(),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    return null;
  };
});

// RN 컴포넌트 첫 렌더는 모듈 로드로 콜드 스타트가 느려 기본 5s를 넘길 수 있음
jest.setTimeout(20000);

const mockLogin = login as jest.Mock;
const mockStartNaverLogin = startNaverLogin as jest.Mock;

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
const rendered: ReactTestRenderer.ReactTestRenderer[] = [];
afterEach(async () => {
  await act(async () => { rendered.splice(0).forEach(renderer => renderer.unmount()); });
  jest.useRealTimers();
});

const renderLogin = async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <LoginScreen navigation={navigation} route={route} />,
    );
  });
  rendered.push(renderer);
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
    jest.useFakeTimers();
    jest.clearAllMocks();
    (secureStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    (authAPI.getNonce as jest.Mock).mockResolvedValue({ data: { data: { nonce: 'test-nonce' } } });
    (authAPI.loginWithKakao as jest.Mock).mockResolvedValue(jwtResponse);
    (authAPI.loginWithNaver as jest.Mock).mockResolvedValue(jwtResponse);
    mockLogin.mockResolvedValue({ idToken: 'kakao-id-token' });
    (authAPI.getNaverState as jest.Mock).mockResolvedValue({
      data: { data: { state: 'naver-state', authorizationUrl: 'https://nid.naver.com/auth?x=1' } },
    });
    mockStartNaverLogin.mockReturnValue({ promise: Promise.resolve('naver-code'), cancel: jest.fn() });
  });

  describe('카카오 로그인', () => {
    it('버튼 클릭 시 userId "42"를 secureStorage에 저장한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.kakao);

      expect(secureStorage.setItem).toHaveBeenCalledWith('userId', '42');
    });

    it('버튼 클릭 시 Home으로 이동한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.kakao);

      expect(mockReplace).toHaveBeenCalledWith('Home');
    });

    it('프로필 미등록 사용자(profileRegistered=false)는 약관 동의 화면으로 이동한다', async () => {
      (authAPI.loginWithKakao as jest.Mock).mockResolvedValue({
        data: { data: { accessToken: 'a', refreshToken: 'r', user: { id: 7, profileRegistered: false } } },
      });
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.kakao);

      expect(mockReplace).toHaveBeenCalledWith('TermsAgreement');
    });
  });

  describe('네이버 로그인', () => {
    it('진행 중 재클릭은 무시하고 화면 종료 시 인증 대기를 취소한다', async () => {
      let reject!: (error: Error) => void;
      const cancel = jest.fn(() => reject(new Error('NAVER_CANCELLED')));
      mockStartNaverLogin.mockReturnValue({ promise: new Promise((_, fail) => { reject = fail; }), cancel });
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.naver);
      await pressButton(renderer, BUTTON.naver);
      expect(authAPI.getNaverState).toHaveBeenCalledTimes(1);
      await act(async () => { renderer.unmount(); });
      expect(cancel).toHaveBeenCalledTimes(1);
      expect(authAPI.loginWithNaver).not.toHaveBeenCalled();
    });

    it('버튼 클릭 시 authorizationUrl을 열고 콜백 code+state로 백엔드 로그인을 호출한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.naver);

      expect(mockStartNaverLogin).toHaveBeenCalledWith(expect.objectContaining({ state: 'naver-state' }));
      expect(authAPI.loginWithNaver).toHaveBeenCalledWith('naver-code', 'naver-state');
    });

    it('버튼 클릭 시 userId 저장 후 Home으로 이동한다', async () => {
      const renderer = await renderLogin();
      await pressButton(renderer, BUTTON.naver);

      expect(secureStorage.setItem).toHaveBeenCalledWith('userId', '42');
      expect(mockReplace).toHaveBeenCalledWith('Home');
    });

    it('사용자가 취소하면 백엔드 로그인을 호출하지 않는다', async () => {
      mockStartNaverLogin.mockImplementation(() => ({ promise: Promise.reject(new Error('NAVER_CANCELLED')), cancel: jest.fn() }));

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
