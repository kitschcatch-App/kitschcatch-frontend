/**
 * 스타일: 회원가입 화면 스타일 (SignUpScreen.styles)
 * 역할: SignUpScreen과 각 회원가입 스텝(아이디/닉네임/프로필 사진/한줄소개)에서 공통으로 사용하는 스타일을 정의합니다.
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
  headerRightSlot: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub07,
    textDecorationLine: 'underline',
  },
  contentContainer: {
    flex: 1,
    marginTop: 40,
  },

  // ── 단계 진행 바 ──────────────────────────────────────────────────────────
  stepProgressContainer: {
    flexDirection: 'row',
    height: 25,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.gray02,
    marginBottom: 50,
  },
  stepProgressItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepProgressItemCompleted: {
    backgroundColor: colors.main03,
  },
  stepProgressItemActive: {
    backgroundColor: colors.main05,
  },
  stepProgressText: {
    fontSize: 14,
    fontFamily: typography.R,
    color: colors.black,
  },

  nextButton: {
    marginTop: 'auto',
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

  // ── 스텝 공통 ────────────────────────────────────────────────────────────
  stepContainer: {
    flex: 1,
  },
  stepGuideText: {
    fontSize: 24,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 22,
  },
  stepInput: {
    marginTop: 0,
  },
  stepInputField: {
    backgroundColor: colors.gray01,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  stepWarningText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.error,
  },

  // ── 프로필 사진 스텝 ──────────────────────────────────────────────────────
  profileImageWrapper: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  profileImageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray03,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.61,
    elevation: 2,
    backgroundColor: colors.white,
  },
});
