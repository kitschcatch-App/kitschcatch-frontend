import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: colors.gray03,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginLeft: 8,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  sortIcon: {
    marginLeft: 4,
  },

  salesListContainer: {
    flex: 1,
    backgroundColor: colors.gray02,
  },
  salesListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  salesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  salesItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.gray05,
  },
  salesItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  salesItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salesItemTitle: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginRight: 8,
  },
  moreButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.gray07,
    marginVertical: 1,
  },
  salesItemPrice: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
  },
  salesItemStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  salesItemStatus: {
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.info,
  },
  salesItemDate: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
    marginLeft: 6,
  },

  deleteSheetTitle: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.error,
  },
});
