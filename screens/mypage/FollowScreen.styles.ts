import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    flex: 1,
  },
  listContainerInner: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  userImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray02,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNickname: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
  },
  userProductCount: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray06,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutualButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.main05,
    marginRight: 10,
  },
  mutualButtonText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
});
