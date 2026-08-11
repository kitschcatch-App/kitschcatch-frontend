/**
 * 컴포넌트: 확인 팝업 (ConfirmView)
 * 역할: 취소/삭제 등 사용자의 최종 확인이 필요한 동작을 모달 형태로 보여주는 공통 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './ConfirmView.styles';

interface ConfirmViewProps {
  visible: boolean;
  title: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmView = ({
  visible,
  title,
  cancelText = '취소',
  confirmText = '삭제',
  onCancel,
  onConfirm,
}: ConfirmViewProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={styles.deleteButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmView;
