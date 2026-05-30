import React from 'react';
import { Animated } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

const mockReplace = jest.fn();
const navigation: any = { replace: mockReplace };
const route: any = {};

const renderSplash = () =>
  ReactTestRenderer.create(<SplashScreen navigation={navigation} route={route} />);

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Animated, 'timing').mockReturnValue({
      start: (cb?: Animated.EndCallback) => cb?.({ finished: true }),
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('accessToken이 있으면 ProductList로 이동한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');

    // AsyncStorage.getItem 완료 + setTimeout(2000) 등록까지 진행
    await act(async () => {
      renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    // act 밖에서 타이머 발화 → 애니메이션 콜백(동기 mock) → navigate 호출
    jest.advanceTimersByTime(2000);

    expect(mockReplace).toHaveBeenCalledWith('ProductList');
  });

  it('accessToken이 없으면 Login으로 이동한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    jest.advanceTimersByTime(2000);

    expect(mockReplace).toHaveBeenCalledWith('Login');
  });

  it('"accessToken" 키로 AsyncStorage를 조회한다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      renderSplash();
      await Promise.resolve(); // AsyncStorage.getItem 완료 대기
      await Promise.resolve(); // checkAndNavigate 재개 대기
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
  });

  it('언마운트 후에는 navigation.replace를 호출하지 않는다', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    let renderer!: ReactTestRenderer.ReactTestRenderer;

    // AsyncStorage 완료 + setTimeout 등록까지만 진행 (타이머는 아직 실행 안 함)
    await act(async () => {
      renderer = renderSplash();
      await Promise.resolve();
      await Promise.resolve();
    });

    // 타이머 실행 전 언마운트 → cleanup: isMounted=false, clearTimeout(timer)
    act(() => { renderer.unmount(); });

    // clearTimeout으로 이미 취소된 타이머이므로 아무것도 실행되지 않아야 함
    await act(async () => { await jest.runAllTimersAsync(); });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
