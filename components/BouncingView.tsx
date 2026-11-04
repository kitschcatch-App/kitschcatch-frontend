/**
 * 컴포넌트: 튀어오르는 래퍼 (BouncingView)
 * 역할: 마운트 시 한 번 위로 튀어 오르며 찌그러졌다 복귀하는 애니메이션을 자식에 적용합니다. (빈 상태 이미지용)
 * CSS 2s 키프레임의 2.5%~17.5% 구간.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

interface BouncingViewProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const BouncingView = ({ style, children }: BouncingViewProps) => {
  const p = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const easing = Easing.bezier(0.5, 0, 0.5, 1);
    Animated.sequence([
      Animated.delay(50),
      Animated.timing(p, { toValue: 1, duration: 150, easing, useNativeDriver: true }),
      Animated.timing(p, { toValue: 0, duration: 150, easing, useNativeDriver: true }),
    ]).start();
  }, [p]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) },
            { scaleX: p.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) },
            { scaleY: p.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default BouncingView;
