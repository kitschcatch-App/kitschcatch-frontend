import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 상품 탭
  productList: {
    flex: 1,
  },
  productListContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: colors.white,
    maxWidth: '50%',
  },
  productImage: {
    backgroundColor: colors.gray02,
  },
  productInfo: {
    marginTop: 8,
    paddingHorizontal: 10,
  },
  productName: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.M,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.SB,
    marginBottom: 4,
  },
  productMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  metaTimeText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  metaIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginLeft: 8,
    marginRight: 3,
  },
  metaText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray07,
  },

  // 매장 탭
  storeList: {
    flex: 1,
  },
  storeListContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  storeImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  storeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeName: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  storeRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeRating: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginLeft: 4,
  },
  storeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  storeStatusOpen: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
  },
  storeStatusDivider: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray04,
    marginHorizontal: 8,
  },
  storeStatusClose: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  storeAddress: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginTop: 6,
  },
  storeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  storeDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.main05,
    backgroundColor: colors.main01,
  },
  storeDetailButtonText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  storeDetailButtonIcon: {
    marginLeft: 6,
  },
});
