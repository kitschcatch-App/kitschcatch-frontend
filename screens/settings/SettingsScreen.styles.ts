import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  accountContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  accountLabel: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.gray07,
  },
  menuList: {
    marginTop: 8,
  },
  divider: {
    height: 12,
    backgroundColor: colors.gray02,
  },
  manageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  notificationContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  supportContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  appInfoContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  menuTitle: {
    fontFamily: typography.M,
    fontSize: 16,
  },
  menuTitleBlack: {
    color: colors.black,
  },
  menuTitleGray: {
    color: colors.gray07,
  },
  menuTitleError: {
    color: colors.error,
  },
});
