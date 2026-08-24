/**
 * 스타일: 날짜 선택 모달 스타일 (DatePickerModal.styles)
 * 역할: DatePickerModal 컴포넌트에서 사용하는 휠 피커, 선택 바, 버튼 등의 UI 디자인을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const ITEM_HEIGHT = 36;
export const VISIBLE_ITEMS = 5;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingTop: 20,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 28,
  },
  wheelWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    justifyContent: 'center',
  },
  selectionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    height: ITEM_HEIGHT,
    backgroundColor: colors.gray02,
    borderRadius: 8,
  },
  wheelRow: {
    flexDirection: 'row',
  },
  wheelColumn: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 18,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  wheelItemTextSelected: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  textButton: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  cancelButtonText: {
    fontFamily: typography.M,
    fontSize: 18,
    color: colors.gray06,
  },
  confirmButtonText: {
    fontFamily: typography.M,
    fontSize: 18,
    color: colors.sub07,
  },
});
