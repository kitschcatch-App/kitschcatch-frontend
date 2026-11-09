/**
 * 스타일: 로그아웃 화면 스타일 (LogoutScreen.styles)
 * 역할: 로그아웃 확인 화면의 이미지, 안내 문구, 로그아웃 버튼 UI 스타일을 정의합니다.
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    marginTop: 24,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  description: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 32,
    alignSelf: 'stretch',
    height: 46,
    borderRadius: 99,
    backgroundColor: colors.gray02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
});
