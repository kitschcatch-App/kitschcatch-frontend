/**
 * 컴포넌트: 공용 팝업 (CommonPopup)
 * 역할: 안내 메시지(title/subtitle)와 버튼 하나를 보여주는 범용 모달 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './CommonPopup.styles';

interface CommonPopupProps {
  visible: boolean;
  title: string;
  subtitle: string;
  buttonText?: string;
  onPress: () => void;
}

const CommonPopup = ({
  visible,
  title,
  subtitle,
  buttonText = '홈으로 돌아가기',
  onPress,
}: CommonPopupProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommonPopup;
