/**
 * 스타일: 공지사항 화면 스타일 (NoticeScreen.styles)
 * 역할: NoticeScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
});
