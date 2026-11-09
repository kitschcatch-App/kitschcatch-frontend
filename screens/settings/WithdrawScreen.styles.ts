/**
 * 스타일: 회원탈퇴 화면 스타일 (WithdrawScreen.styles)
 * 역할: 회원탈퇴 사유 선택 화면의 안내 문구, 드롭다운, 다음 버튼 UI 스타일을 정의합니다.
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
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 4,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  subText: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.gray07,
  },
  dropdown: {
    marginTop: 28,
  },
  dropdownButtonError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  noticeTitle: {
    fontFamily: typography.SB,
    fontSize: 22,
    color: colors.black,
    marginTop: 4,
  },
  noticeList: {
    marginTop: 16,
  },
  noticeItem: {
    fontFamily: typography.M,
    fontSize: 16,
    lineHeight: 25,
    color: colors.black,
  },
  noticeItemSpacing: {
    marginTop: 4,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  policyText: {
    marginRight: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
  bottomSection: {
    marginTop: 'auto',
    marginBottom: 50,
  },
  errorText: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.error,
    textAlign: 'right',
  },
  nextButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.main05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.gray02,
  },
  nextButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  nextButtonTextDisabled: {
    color: colors.gray06,
  },
});
