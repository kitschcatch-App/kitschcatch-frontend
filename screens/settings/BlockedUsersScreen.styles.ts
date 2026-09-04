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
    marginLeft: 8,
  },
  userNickname: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
  },
  userProductCount: {
    marginTop: 2,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray06,
  },
  menuWrapper: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  menuButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.black,
  },
  menuDotSpacing: {
    marginTop: 2,
  },
  unblockButton: {
    position: 'absolute',
    top: '50%',
    right: 12,
    marginTop: 8,
    width: 74,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray03,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  unblockButtonText: {
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.black,
  },
  confirmContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  confirmTitle: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  confirmDescription: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray07,
  },
  bottomSection: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    marginBottom: 50,
  },
  unblockConfirmButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.gray01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unblockConfirmButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.error,
  },
});
