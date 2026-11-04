/**
 * 스타일: 고객센터 화면 스타일 (CustomerCenterScreen.styles)
 * 역할: CustomerCenterScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  faqTitle: {
    fontFamily: typography.SB,
    fontSize: 20,
    color: colors.black,
  },
  buttonContainer: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 36,
  },
  button: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray03,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});
