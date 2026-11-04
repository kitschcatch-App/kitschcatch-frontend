/**
 * 스타일: 문의내역 화면 스타일 (InquiryHistoryScreen.styles)
 * 역할: InquiryHistoryScreen 컴포넌트의 UI 스타일을 정의합니다.
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
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray05,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemType: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  itemDate: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
  itemContent: {
    paddingTop: 12,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
});
