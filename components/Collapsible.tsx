/**
 * 컴포넌트: Collapsible
 * 역할: expanded 값에 따라 자식 영역을 높이·투명도 애니메이션으로 접고 펼칩니다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

type Props = { expanded: boolean; children: React.ReactNode };

const Collapsible = ({ expanded, children }: Props) => {
  const [height, setHeight] = useState(0);
  const anim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: expanded ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // height는 네이티브 드라이버 미지원
    }).start();
  }, [expanded, anim]);

  return (
    <Animated.View
      style={{
        overflow: 'hidden',
        opacity: anim,
        height: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, height],
        }),
      }}
    >
      {/* 절대 배치로 실제 높이를 측정 (부모 높이가 0이어도 측정됨) */}
      <View
        style={{ position: 'absolute', left: 0, right: 0 }}
        onLayout={e => setHeight(e.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </Animated.View>
  );
};

export default Collapsible;
