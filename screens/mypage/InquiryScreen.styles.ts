/**
 * 스타일: 1:1 문의하기 화면 스타일 (InquiryScreen.styles)
 * 역할: InquiryScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  typeSection: {
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
  typeDropdown: {
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
  alarmSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  doneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  doneImage: {
    width: 200,
    height: 196,
  },
  doneTitle: {
    marginTop: 16,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  doneText: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },
  doneNotice: {
    color: colors.gray07,
  },
  homeButton: {
    marginTop: 33,
    alignSelf: 'stretch',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.main05,
  },
  homeButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
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
