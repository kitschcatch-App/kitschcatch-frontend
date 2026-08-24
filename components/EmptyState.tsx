/**
 * 컴포넌트: 빈 목록 안내 (EmptyState)
 * 역할: 목록이 비어있을 때 이미지, 제목, 설명을 함께 보여주는 공통 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  image?: ImageSourcePropType;
  title: string;
  description: string;
}

const EmptyState = ({ image, title, description }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      {image && <Image source={image} style={styles.image} resizeMode="contain" />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default EmptyState;
