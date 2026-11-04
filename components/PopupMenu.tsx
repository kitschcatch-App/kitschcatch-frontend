/**
 * 컴포넌트: 팝업 메뉴 (PopupMenu)
 * 역할: 항목 목록을 작은 드롭다운으로 띄우는 공통 메뉴입니다. (차단/신고 메뉴, 채팅 첨부 메뉴 공용)
 * 화면의 최상위(SafeAreaView 등 relative 컨테이너) 안에 두면 배경 터치 시 닫힙니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleProp, ViewStyle } from 'react-native';
import { styles } from './ReportBlockMenu.styles';

export interface PopupMenuItem {
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

interface PopupMenuProps {
  visible: boolean;
  onClose: () => void;
  items: PopupMenuItem[];
  /** 화면마다 다른 위치 지정용 (기본값은 styles.menu의 top/right) */
  style?: StyleProp<ViewStyle>;
}

const PopupMenu = ({ visible, onClose, items, style }: PopupMenuProps) => {
  if (!visible) {
    return null;
  }

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.menu, style]}>
        {items.map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => {
              onClose();
              item.onPress?.();
            }}
          >
            <Text style={[styles.text, item.danger && styles.textDanger]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default PopupMenu;
