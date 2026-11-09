/**
 * 훅: 하트 팝 애니메이션 (useHeartPop)
 * 역할: 인스타 스타일로 살짝 줄었다가 스프링으로 튀어 오르는 scale 값과 재생 함수를 제공합니다. (관심 등록 시에만 play 호출)
 */
import { useRef } from 'react';
import { Animated } from 'react-native';

export const useHeartPop = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const play = () => {
    scale.setValue(0.7);
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }).start();
  };
  return { scale, play };
};
