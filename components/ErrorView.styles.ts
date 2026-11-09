/**
 * 스타일: 에러 뷰 스타일 (ErrorView.styles)
 * 역할: ErrorView 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 70,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.black,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: colors.main03,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
});
