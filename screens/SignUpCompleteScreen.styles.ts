/**
 * 스타일: 회원가입 완료 화면 스타일 (SignUpCompleteScreen.styles)
 * 역할: SignUpCompleteScreen에서 사용하는 헤더, 완료 안내 문구, 체크 아이콘, 하단 버튼의 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
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

  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    fontSize: 24,
    fontFamily: typography.SB,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 24,
  },

  nextButton: {
    width: '100%',
    marginTop: 72,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main05,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
});
