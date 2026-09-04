/**
 * 컴포넌트: 토글 스위치 (ToggleSwitch)
 * 역할: on/off 상태를 켜고 끄는 공통 스위치 UI입니다. (예: 필터의 판매중만 보기, 알림설정)
 */
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { styles } from './ToggleSwitch.styles';
import { colors } from '../styles/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleSwitch = ({ value, onValueChange }: ToggleSwitchProps) => {
  const toggleAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [value, toggleAnim]);

  // 배경색 부드럽게 전환
  const toggleTrackColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', colors.main05],
  });

  // 동그라미(Thumb) 좌우 이동
  const toggleThumbPosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor: toggleTrackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: toggleThumbPosition }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ToggleSwitch;
