/**
 * 컴포넌트: 플로팅 상품 등록 버튼 (FloatingAddButton)
 * 역할: "+ 상품 등록하기" 버튼. collapsed가 true면 오른쪽 끝을 기준으로 왼쪽이 줄어들며(+ 아이콘이 오른쪽으로 이동) 44x44 단일 버튼이 되고,
 * 그 위에 맨 위로 버튼(onPressTop)이 나타납니다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import AddIcon from '../assets/plus.svg';
import UpIcon from '../assets/up-button.svg';
import {
  styles,
  FULL_HEIGHT,
  COLLAPSED_HEIGHT,
  ICON_SIZE,
} from './FloatingAddButton.styles';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FULL_PADDING = 10;
const COLLAPSED_SIZE = 44;
const COLLAPSED_PADDING = (COLLAPSED_SIZE - ICON_SIZE) / 2;

interface Props {
  collapsed: boolean;
  bottom: number;
  onPress: () => void;
  onPressTop: () => void;
}

const FloatingAddButton = ({
  collapsed,
  bottom,
  onPress,
  onPressTop,
}: Props) => {
  const [fullWidth, setFullWidth] = useState(0); // 텍스트 너비를 잰 뒤에야 알 수 있음
  const t = useRef(new Animated.Value(0)).current; // 0: 펼침, 1: 축소

  useEffect(() => {
    Animated.timing(t, {
      toValue: collapsed ? 1 : 0,
      duration: 250,
      easing: Easing.bezier(0.5, 0, 0.5, 1),
      useNativeDriver: false, // width/height는 네이티브 드라이버 불가
    }).start();
  }, [collapsed, t]);

  const lerp = (from: number, to: number) =>
    t.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
  const measured = fullWidth > 0;

  return (
    <>
      <Animated.View
        style={[styles.wrapper, { bottom }, measured && { width: fullWidth }]}
        pointerEvents="box-none"
      >
        <AnimatedTouchable
          style={[
            styles.button,
            { padding: FULL_PADDING },
            measured && {
              width: lerp(fullWidth, COLLAPSED_SIZE),
              height: lerp(FULL_HEIGHT, COLLAPSED_SIZE),
              padding: lerp(FULL_PADDING, COLLAPSED_PADDING),
            },
          ]}
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityLabel="상품 등록하기"
        >
          <AddIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Animated.Text
            style={[
              styles.text,
              {
                opacity: t.interpolate({
                  inputRange: [0, 0.5],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
            numberOfLines={1}
            onLayout={e =>
              !measured &&
              setFullWidth(
                FULL_PADDING * 2 +
                  ICON_SIZE +
                  4 +
                  Math.ceil(e.nativeEvent.layout.width),
              )
            }
          >
            상품 등록하기
          </Animated.Text>
        </AnimatedTouchable>
      </Animated.View>

      <Animated.View
        style={[
          styles.topButton,
          {
            bottom: bottom + COLLAPSED_HEIGHT + 8,
            opacity: t.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
        pointerEvents={collapsed ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.topTouch}
          onPress={onPressTop}
          activeOpacity={0.8}
          accessibilityLabel="맨 위로"
        >
          <UpIcon />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default FloatingAddButton;
