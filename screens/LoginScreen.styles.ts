/**
 * 스타일: 로그인 화면 스타일 (LoginScreen.styles)
 * 역할: LoginScreen 화면의 레이아웃 및 UI 요소(로고, 카카오 로그인 버튼 등)의 스타일을 정의합니다.
 * 로고 크기가 화면 너비에 비례하므로 useWindowDimensions 값을 받아 스타일을 생성하는 팩토리 함수로 export합니다.
 */

import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const createStyles = (width: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: undefined,
    aspectRatio: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 72,
  },
  kakaoButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FEE500',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoIcon: {
    position: 'absolute',
    left: 20, // 버튼 안쪽 맨 왼쪽에 고정
  },
  kakaoButtonText: {
    fontSize: 18,
    fontFamily: typography.M,
    color: colors.black,
  },
  naverButton: {
    width: '100%',
    height: 48,
    marginTop: 24,
    backgroundColor: '#03C75A',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  naverIcon: {
    position: 'absolute',
    left: 20,
  },
  naverButtonText: {
    fontSize: 18,
    fontFamily: typography.M,
    color: colors.white,
  },
  appleButton: {
    width: '100%',
    height: 48,
    marginTop: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleIcon: {
    position: 'absolute',
    left: 20,
  },
  appleButtonText: {
    fontSize: 18,
    fontFamily: typography.M,
    color: colors.white,
  },
  mockButton: {
    marginTop: 24,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray05,
  },
  mockButtonText: {
    fontSize: 13,
    fontFamily: typography.M,
    color: colors.gray05,
  },
  devTestButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  devTestButtonText: {
    fontSize: 12,
    fontFamily: typography.R,
    color: colors.gray05,
  },
});

export type LoginStyles = ReturnType<typeof createStyles>;