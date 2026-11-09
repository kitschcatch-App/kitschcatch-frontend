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
    padding: 65,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingTop: 24,
    overflow: 'hidden',
  },
  title: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.main05,
  },
  buttonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});
