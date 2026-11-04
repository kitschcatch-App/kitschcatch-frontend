/**
 * 스타일: 확인형 안내 팝업 스타일 (NoticePopup.styles)
 * 역할: NoticePopup 컴포넌트의 UI 스타일을 정의합니다. Toast와 같은 톤을 사용합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  container: {
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
    textAlign: 'left',
  },
  confirmText: {
    marginTop: 24,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.white,
  },
});
