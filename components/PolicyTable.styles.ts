/**
 * 스타일: 정책 표 스타일 (PolicyTable.styles)
 * 역할: PolicyTable 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  table: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.gray03,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray03,
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: colors.gray01,
  },
  cellText: {
    fontFamily: typography.R,
    fontSize: 11,
    lineHeight: 16,
    color: colors.black,
  },
  headerText: {
    fontFamily: typography.SB,
  },
});
