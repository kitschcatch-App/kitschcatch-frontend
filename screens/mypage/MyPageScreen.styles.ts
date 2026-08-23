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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },

  profileContainer: {
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
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
});