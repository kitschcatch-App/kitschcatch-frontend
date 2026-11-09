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
  confirmFontSize?: number;
  cancelFontSize?: number;
  /** 가로를 넓히고 세로를 줄인 컴팩트 레이아웃 + 제목 왼쪽 정렬 */
  wide?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmView = ({
  visible,
  title,
  cancelText = '취소',
  confirmText = '삭제',
  confirmFontSize,
  cancelFontSize,
  wide,
  onCancel,
  onConfirm,
}: ConfirmViewProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, wide && styles.wideOverlay]}>
        <View style={[styles.container, wide && styles.wideContainer]}>
          <Text style={[styles.title, wide && styles.wideTitle]}>{title}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, wide && styles.wideButton, styles.cancelButton]} onPress={onCancel} activeOpacity={0.8}>
              <Text style={[styles.cancelButtonText, cancelFontSize ? { fontSize: cancelFontSize } : null]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, wide && styles.wideButton, styles.deleteButton]} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={[styles.deleteButtonText, confirmFontSize ? { fontSize: confirmFontSize } : null]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmView;
