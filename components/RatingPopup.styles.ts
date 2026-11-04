/**
 * 스타일: 별점등록 팝업 스타일 (RatingPopup.styles)
 * 역할: RatingPopup 컴포넌트의 UI 스타일을 정의합니다.
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
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  count: {
    marginLeft: 6,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.gray05,
  },
  stars: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.main05,
  },
  confirmText: {
    fontFamily: typography.M,
    fontSize: 18,
    color: colors.black,
  },
});
