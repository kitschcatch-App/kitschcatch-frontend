/**
 * 컴포넌트: 화면 헤더 (ScreenHeader)
 * 역할: 뒤로가기 버튼과 가운데 정렬된 제목을 보여주는 공통 상단 헤더입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { styles } from './ScreenHeader.styles';
import BackIcon from '../assets/back.svg';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  style?: StyleProp<ViewStyle>;
}

const ScreenHeader = ({ title, onBack, style }: ScreenHeaderProps) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <BackIcon width={10} height={18} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};

export default ScreenHeader;
