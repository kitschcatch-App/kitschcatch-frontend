/**
 * 컴포넌트: 성공 뷰 (SuccessView)
 * 역할: 앱 내에서 작업(상품 등록, 결제 완료, 정보 수정 등)이 성공적으로 처리되었을 때 보여주는 공통 모달 컴포넌트입니다.
 */


import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, Animated } from 'react-native';
import { styles } from './SuccessView.styles';

interface SuccessViewProps {
  visible: boolean;
  title: string;
  onDismiss: () => void;
}

const SuccessView = ({ visible, title, onDismiss }: SuccessViewProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (!visible) return;

    setModalVisible(true);
    opacity.setValue(0);
    scale.setValue(0.85);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.85, duration: 250, useNativeDriver: true }),
        ]).start(() => {
          setModalVisible(false);
          onDismiss();
        });
      }, 1300);
    });
  }, [visible]);

  return (
    <Modal visible={modalVisible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default SuccessView;
