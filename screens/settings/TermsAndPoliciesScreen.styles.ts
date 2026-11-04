/**
 * 스타일: 약관 및 정책 화면 스타일 (TermsAndPoliciesScreen.styles)
 * 역할: TermsAndPoliciesScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemTitle: {
    flex: 1,
    marginRight: 12,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});
