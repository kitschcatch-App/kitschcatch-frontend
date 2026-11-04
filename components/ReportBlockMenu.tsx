/**
 * 컴포넌트: 차단/신고 메뉴 (ReportBlockMenu)
 * 역할: 헤더 더보기(점 3개) 버튼 아래에 차단하기·신고하기를 띄우는 드롭다운.
 * 화면의 최상위(SafeAreaView 등 relative 컨테이너) 안에 두면 배경 터치 시 닫힙니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleProp, ViewStyle } from 'react-native';
import { styles } from './ReportBlockMenu.styles';

interface ReportBlockMenuProps {
  visible: boolean;
  onClose: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  /** 화면마다 다른 위치 지정용 (기본값은 styles.menu의 top/right) */
  style?: StyleProp<ViewStyle>;
}

const ReportBlockMenu = ({ visible, onClose, onBlock, onReport, style }: ReportBlockMenuProps) => {
  if (!visible) {
    return null;
  }

  const handle = (action?: () => void) => () => {
    onClose();
    action?.();
  };

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.menu, style]}>
        {/* onBlock이 없으면 신고하기만 보여준다 */}
        {onBlock && (
          <TouchableOpacity style={styles.item} onPress={handle(onBlock)}>
            <Text style={styles.text}>차단하기</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.item} onPress={handle(onReport)}>
          <Text style={[styles.text, styles.textDanger]}>신고하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ReportBlockMenu;
