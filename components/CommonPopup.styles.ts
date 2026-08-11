/**
 * 스타일: 공용 팝업 스타일 (CommonPopup.styles)
 * 역할: CommonPopup 컴포넌트의 UI 스타일을 정의합니다.
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
    padding: 40,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    // textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.main05,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});
