/**
 * 스타일: 정렬 바텀 시트 스타일 (SortBottomSheet.styles)
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOff: {
    width: 16,
    height: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.gray07,
  },
  optionText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginLeft: 8,
  },
});
