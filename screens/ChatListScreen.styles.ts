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
  mockToggleButton: {
    position: 'absolute',
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.sub07,
  },
  mockToggleButtonText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.white,
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: 4,
    backgroundColor: colors.sub01,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray02,
    marginRight: 8,
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
    fontFamily: typography.SB,
    color: colors.black,
  },
  dotText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  timeText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginRight: 5,
  },
  timeTextRead: {
    color: colors.gray07,
  },
  timeTextRightAligned: {
    marginLeft: 'auto',
  },
  lastMessage: {
    flexShrink: 1,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  lastMessageRead: {
    color: colors.gray07,
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.main05,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontFamily: typography.SB,
    color: colors.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.sub01,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.sub07,
    textAlign: 'center',
  },
});
