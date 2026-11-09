/**
 * 컴포넌트: 차단/신고 메뉴 (ReportBlockMenu)
 * 역할: 헤더 더보기(점 3개) 버튼 아래에 차단하기·신고하기를 띄우는 드롭다운.
 * 화면의 최상위(SafeAreaView 등 relative 컨테이너) 안에 두면 배경 터치 시 닫힙니다.
 */
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import PopupMenu from './PopupMenu';

interface ReportBlockMenuProps {
  visible: boolean;
  onClose: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  /** 화면마다 다른 위치 지정용 (기본값은 styles.menu의 top/right) */
  style?: StyleProp<ViewStyle>;
}

const ReportBlockMenu = ({ visible, onClose, onBlock, onReport, style }: ReportBlockMenuProps) => (
  <PopupMenu
    visible={visible}
    onClose={onClose}
    style={style}
    // onBlock이 없으면 신고하기만 보여준다
    items={[
      ...(onBlock ? [{ label: '차단하기', onPress: onBlock }] : []),
      { label: '신고하기', onPress: onReport, danger: true },
    ]}
  />
);

export default ReportBlockMenu;
