/**
 * 스타일: 채팅 목록 화면 스타일 (ChatListScreen.styles)
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

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
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  listContainer: {
    flexGrow: 1,
    backgroundColor: colors.main03,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray02,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sellerName: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  timeText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray01,
    marginRight: 5,
  },
  lastMessage: {
    flexShrink: 1,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray01,
  },
});
