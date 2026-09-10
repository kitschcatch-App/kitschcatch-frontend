/**
 * 컴포넌트: 토스트 (Toast)
 * 역할: 짧은 안내 메시지를 화면 하단에 잠시 띄웠다가 자동으로 사라지는 공통 컴포넌트입니다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Text, Modal, Animated } from 'react-native';
import { styles } from './Toast.styles';

interface ToastProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  position?: 'bottom' | 'center';
}

const Toast = ({ visible, message, onDismiss, position = 'bottom' }: ToastProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    setModalVisible(true);
    opacity.setValue(0);

    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
          setModalVisible(false);
          onDismiss();
        });
      }, 1500);
    });
  }, [visible]);

  return (
    <Modal visible={modalVisible} transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={[styles.overlay, position === 'center' && styles.overlayCenter, { opacity }]}
        pointerEvents="none"
      >
        <Animated.View style={styles.container}>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default Toast;
