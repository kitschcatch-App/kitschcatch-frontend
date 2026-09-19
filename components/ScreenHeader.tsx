/**
 * 컴포넌트: 화면 헤더 (ScreenHeader)
 * 역할: 뒤로가기 버튼과 가운데 정렬된 제목을 보여주는 공통 상단 헤더입니다.
 *       onBack을 넘기지 않으면 뒤로가기 버튼 없이 제목만 가운데 정렬로 표시합니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { styles } from './ScreenHeader.styles';
import BackIcon from '../assets/back.svg';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ScreenHeader = ({ title, onBack, rightElement, style }: ScreenHeaderProps) => {
  return (
    <View style={[styles.headerContainer, style]}>
      {onBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
        >
          <BackIcon width={10} height={18} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerSpacer} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {rightElement ?? <View style={styles.headerSpacer} />}
    </View>
  );
};

export default ScreenHeader;
