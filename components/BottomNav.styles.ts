/**
 * 스타일: 하단 네비게이션 바 스타일 (BottomNav.styles)
 * 역할: BottomNav 컴포넌트에서 사용하는 UI 스타일을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 55,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#00ff0000',
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginBottom: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 11,
    color: colors.black,
    fontFamily: typography.M,
    marginTop: 4,
  },
});