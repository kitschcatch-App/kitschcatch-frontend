/**
 * 스타일: 약관 동의 화면 스타일 (TermsAgreementScreen.styles)
 * 역할: TermsAgreementScreen에서 사용하는 헤더, 안내 문구, 약관 동의 리스트, 하단 버튼의 스타일을 정의합니다.
 * 화면 높이에 따라 마진이 달라지므로 useWindowDimensions 값을 받아 스타일을 생성하는 팩토리 함수로 export합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const createStyles = (height: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  introContainer: {
    marginTop: height * 0.12,
  },
  introTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introTitleText: {
    fontSize: 18,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 4,
  },
  introSubText: {
    fontSize: 18,
    fontFamily: typography.M,
    color: colors.black,
  },
  termsContainer: {
    marginTop: height * 0.22,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray07,
    marginRight: 6,
  },
  radioIcon: {
    marginRight: 6,
  },
  termAllText: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  termText: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.black,
  },
  termRequired: {
    color: colors.sub07,
  },
  termOptional: {
    color: colors.gray05,
  },
  termArrow: {
    marginLeft: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray03,
    marginVertical: 4,
  },
  nextButton: {
    marginTop: 30,
    marginBottom: 24,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray03,
  },
  nextButtonActive: {
    backgroundColor: colors.main05,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
});

export type TermsAgreementStyles = ReturnType<typeof createStyles>;
