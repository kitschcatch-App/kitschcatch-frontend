/**
 * 스타일: 확인 팝업 스타일 (ConfirmView.styles)
 * 역할: ConfirmView 컴포넌트의 UI 스타일을 정의합니다.
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
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray02,
  },
  cancelButtonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  deleteButton: {
    backgroundColor: colors.main05,
  },
  deleteButtonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});
