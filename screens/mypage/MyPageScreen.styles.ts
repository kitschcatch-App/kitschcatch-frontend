import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  followDivider: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray03,
    marginLeft: 16,
    marginRight: 16,
  },
  NextIcon: {
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
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginLeft: 4,
  },

  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIcon: {
    width: 25,
    height: 25,
  },
  menuLabel: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },

  recentActivityContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentActivityImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: colors.gray02,
  },
  recentActivityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentActivityTitle: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
  },
  recentActivityStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  recentActivityType: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.gray07,
  },
  recentActivityDivider: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.gray02,
    marginHorizontal: 8,
  },
  recentActivityComplete: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.sucess,
  },
  recentActivityDate: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
  recentActivityEmpty: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    paddingVertical: 24,
  },

  menuListContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  menuListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  menuListTitle: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});