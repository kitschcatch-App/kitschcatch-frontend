/**
 * 컴포넌트: 에러 뷰 (ErrorView)
 * 역할: 앱 내에서 발생하는 에러 메시지를 모달 형태로 보여주는 공통 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './ErrorView.styles';

interface ErrorViewProps {
  visible: boolean;
  title: string;
  subtitle: string;
  buttonText?: string;
  onPress: () => void;
}

const ErrorView = ({ visible, title, subtitle, buttonText = '확인', onPress }: ErrorViewProps) => {
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

export default ErrorView;
