import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // ScreenHeader의 뒤로가기 버튼(40x40)과 같은 크기로 맞춰 제목을 가운데 유지
  headerMoreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.sub01,
  },
  contentContainerInner: {
    paddingBottom: 10,
  },

  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 99,
    backgroundColor: colors.gray02,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  username: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  userId: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.sub05,
    marginLeft: 4,
  },
  introduction: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
    marginTop: 6,
    marginBottom: 6,
  },
  followCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followCount: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  followDivider: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray03,
    marginLeft: 16,
    marginRight: 16,
  },

  followButton: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.main05,
    backgroundColor: colors.main05,
  },
  followButtonActive: {
    borderColor: colors.gray03,
    backgroundColor: colors.white,
  },
  followButtonText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  activityCount: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginRight: 8,
  },
  ratingScore: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
    marginLeft: 4,
  },

  productContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  productHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productHeaderTitle: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
    marginRight: 4,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 14,
    marginTop: 12,
  },
  productItem: {
    width: 156,
  },
  productImage: {
    width: 156,
    height: 156,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  productTitle: {
    marginTop: 8,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  productPrice: {
    marginTop: 2,
    textAlign: 'left',
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
  },
  productEmpty: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 24,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
});
