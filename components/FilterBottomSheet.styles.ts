/**
 * 스타일: 필터 바텀 시트 스타일 (FilterBottomSheet.styles)
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  filterContent: {},
  handleContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  handle: {
    width: 100,
    height: 4,
    backgroundColor: colors.gray03,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4, // 버튼 사이의 간격
  },
  optionButton: {
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.gray04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    borderColor: '#B1F5F0',
    backgroundColor: colors.main03,
  },
  optionText: {
    fontSize: 14, 
    textAlign: 'center',
    fontFamily: typography.M,
    color: colors.black,
  },
  optionTextActive: {
    color: colors.black,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginRight: 10,
  },
  toggleText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  customToggleTrack: {
    width: 55,
    height: 28,
    borderRadius: 22,
    backgroundColor: colors.gray03,
    justifyContent: 'center',
  },
  customToggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  priceContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.gray04,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    padding: 0,
    textAlign: 'right',
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 3,
  },
  priceDash: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.gray05,
    marginHorizontal: 18,
  },
  conditionContainer: {
    marginTop: 10,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  conditionLabel: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  conditionSubLabel: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    marginLeft: 10,
  },
  conditionOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 24,
  },
  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  chipScrollView: {
    flex: 1,
  },
  chipScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    backgroundColor: colors.gray02,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  submitButton: {
    backgroundColor: colors.main05,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
});