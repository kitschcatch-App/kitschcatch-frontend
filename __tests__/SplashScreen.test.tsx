import React from 'react';
import { Animated } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { secureStorage } from '../utils/secureStorage';
import SplashScreen from '../screens/auth/SplashScreen';

jest.mock('../utils/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn(),
  },
}));

const mockReplace = jest.fn();
const navigation: any = { replace: mockReplace };
const route: any = {};

const renderSplash = () =>
  ReactTestRenderer.create(<SplashScreen navigation={navigation} route={route} />);

describe('SplashScreen', () => {
  let finishAnimation: Animated.EndCallback | undefined;
  beforeEach(() => {
    jest.clearAllMocks();
    finishAnimation = undefined;
    jest.spyOn(Animated, 'sequence').mockReturnValue({
      start: callback => { finishAnimation = callback; },
      stop: jest.fn(),
      reset: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 현재 SplashScreen은 자동 로그인이 임시 주석 처리되어 토큰 유무와 무관하게 Login으로 이동한다.
  // (SplashScreen.tsx의 navigation.replace(token ? 'ProductList' : 'Login') 라인이 활성화되면 이 테스트를 되돌릴 것)
  it('accessToken이 있어도 (자동 로그인 비활성) Login으로 이동한다', async () => {
    (secureStorage.getItem as jest.Mock).mockResolvedValue('access-token');

    await act(async () => {
      renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => { finishAnimation?.({ finished: true }); });

    expect(mockReplace).toHaveBeenCalledWith('Login');
  });

  it('accessToken이 없으면 Login으로 이동한다', async () => {
    (secureStorage.getItem as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => { finishAnimation?.({ finished: true }); });

    expect(mockReplace).toHaveBeenCalledWith('Login');
  });

  it('"accessToken" 키로 secureStorage를 조회한다', async () => {
    (secureStorage.getItem as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      renderSplash();
      await Promise.resolve(); // secureStorage.getItem 완료 대기
      await Promise.resolve(); // checkAndNavigate 재개 대기
    });

    expect(secureStorage.getItem).toHaveBeenCalledWith('accessToken');
  });

  it('언마운트 후에는 navigation.replace를 호출하지 않는다', async () => {
    (secureStorage.getItem as jest.Mock).mockResolvedValue(null);

    let renderer!: ReactTestRenderer.ReactTestRenderer;

    await act(async () => {
      renderer = renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => { renderer.unmount(); });

    await act(async () => { finishAnimation?.({ finished: true }); });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
