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
    minHeight: 530, // 바텀 시트의 기본 높이
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  handle: {
    width: 100,
    height: 4,
    backgroundColor: colors.gray04,
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
    gap: 8, // 버튼 사이의 간격
  },
  optionButton: {
    paddingVertical: 9,
    paddingHorizontal: 2,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.gray04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    borderColor: colors.main01,
    backgroundColor: `${colors.main01}26`, // 15% opacity
  },
  optionText: {
    fontSize: 14, 
    textAlign: 'center',
    fontFamily: typography.M,
    color: colors.black,
  },
  optionTextActive: {
    color: colors.sub02,
    zIndex: 1,
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
    width: 54,
    height: 30,
    borderRadius: 22,
    backgroundColor: colors.gray04,
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
    height: 44,
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
    marginLeft: 8,
  },
  priceDash: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
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
    color: colors.gray01,
    marginLeft: 10,
  },
  conditionOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: colors.main01,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, 
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
});