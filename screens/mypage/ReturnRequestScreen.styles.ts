/**
 * 스타일: 반품요청 화면 스타일 (ReturnRequestScreen.styles)
 * 역할: ReturnRequestScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  reasonSection: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  reasonDropdown: {
    marginTop: 8,
  },
  contentInput: {
    height: 160,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.gray01,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  submitButton: {
    height: 50,
    marginHorizontal: 16,
    marginBottom: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray02,
  },
  submitButtonActive: {
    backgroundColor: colors.main05,
  },
  submitText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.gray06,
  },
  submitTextActive: {
    color: colors.black,
  },
});
