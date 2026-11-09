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
  // 애니메이션(sequence)을 가로채 완료 콜백을 직접 호출해 전환 시점을 제어한다.
  let finishAnimation: () => Promise<void>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Animated, 'sequence').mockReturnValue({
      start: (cb?: Animated.EndCallback) => {
        finishAnimation = async () => {
          await act(async () => {
            cb?.({ finished: true });
            await Promise.resolve();
            await Promise.resolve();
          });
        };
      },
      stop: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  // 현재 SplashScreen은 자동 로그인이 임시 주석 처리되어 토큰 유무와 무관하게 Login으로 이동한다.
  // (SplashScreen.tsx의 navigation.replace(token ? 'ProductList' : 'Login') 라인이 활성화되면 이 테스트를 되돌릴 것)
  it('accessToken이 있어도 (자동 로그인 비활성) Login으로 이동한다', async () => {
    (secureStorage.getItem as jest.Mock).mockResolvedValue('access-token');

    // 마운트 + secureStorage.getItem 호출까지 진행
    await act(async () => {
      renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    await finishAnimation();

    expect(mockReplace).toHaveBeenCalledWith('Login');
  });

  it('accessToken이 없으면 Login으로 이동한다', async () => {
    (secureStorage.getItem as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    await finishAnimation();

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

    // 마운트까지만 진행 (애니메이션 완료 콜백은 아직 호출 안 함)
    await act(async () => {
      renderer = renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    // 완료 전 언마운트 → cleanup: isMounted=false
    act(() => { renderer.unmount(); });

    // 이후 완료 콜백이 불려도 isMounted 가드로 이동하지 않아야 함
    await finishAnimation();

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
