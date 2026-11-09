/**
 * 스타일: 토스트 스타일 (Toast.styles)
 * 역할: Toast 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  overlayCenter: {
    justifyContent: 'center',
    paddingBottom: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 22,
    paddingHorizontal: 32,
    backgroundColor: colors.gray07,
  },
  message: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
});
