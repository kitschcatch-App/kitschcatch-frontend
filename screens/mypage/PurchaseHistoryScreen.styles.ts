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

  purchaseListContainer: {
    flex: 1,
    backgroundColor: colors.gray02,
  },
  purchaseListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  purchaseItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  purchaseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.gray05,
  },
  purchaseItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  purchaseItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  purchaseItemTitle: {
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
  purchaseItemPrice: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
  },
  purchaseItemStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  purchaseItemStatus: {
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.info,
  },
  purchaseItemDate: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
    marginLeft: 6,
  },

  confirmButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: colors.main02,
  },
  confirmButtonDone: {
    backgroundColor: colors.gray02,
  },
  confirmButtonText: {
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.black,
  },
  confirmButtonTextDone: {
    color: colors.black,
  },

  deleteSheetTitle: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.error,
  },
});
