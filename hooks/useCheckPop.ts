/**
 * 훅: useCheckPop
 * 역할: 완료 화면의 체크 아이콘/이미지용 팝 애니메이션 스타일을 반환합니다. (회원가입·결제 완료 공용)
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// 작은 크기에서 한 바퀴 돌며 튀어나온 뒤(오버슈트) 좌우로 흔들리며 정착 (CSS 2s 키프레임 0~17.5% 구간, 바닥 중앙 기준 회전)
const pop = Easing.bezier(0.583, 1.206, 1, 1.285);
const settle = Easing.bezier(0.5, 0, 0.5, 1);

export const useCheckPop = () => {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(-3.142)).current; // rad

  useEffect(() => {
    const to = (v: Animated.Value, toValue: number, duration: number, easing: (t: number) => number) =>
      Animated.timing(v, { toValue, duration, easing, useNativeDriver: true });
    Animated.parallel([
      to(scale, 1, 200, pop),
      Animated.sequence([
        to(rotate, 0.175, 200, pop),
        to(rotate, -0.122, 50, settle),
        to(rotate, 0.087, 50, settle),
        to(rotate, 0, 50, settle),
      ]),
    ]).start();
  }, [scale, rotate]);

  return {
    transformOrigin: '50% 100%',
    transform: [{ rotate: rotate.interpolate({ inputRange: [-4, 4], outputRange: ['-4rad', '4rad'] }) }, { scale }],
  };
};
