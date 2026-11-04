/**
 * 컴포넌트: 확인형 안내 팝업 (NoticePopup)
 * 역할: 긴 안내 메시지를 보여주고, 확인을 눌러야만 닫히는 공통 팝업입니다. (자동으로 사라지는 Toast와 구분)
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './NoticePopup.styles';

interface NoticePopupProps {
  visible: boolean;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

const NoticePopup = ({ visible, message, confirmText = '확인', onConfirm }: NoticePopupProps) => (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={onConfirm} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 24, right: 24 }}>
          <Text style={styles.confirmText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default NoticePopup;
