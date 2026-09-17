/**
 * 스타일: 매장상세 화면 스타일 (StoreDetailScreen.styles)
 * 역할: StoreDetailScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  favoriteButton: {
    height: 40,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  homeContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  storeNameText: {
    flex: 1,
    fontFamily: typography.SB,
    fontSize: 22,
    color: colors.black,
    marginRight: 8,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
    marginLeft: 2,
  },
  photoScroll: {
    marginTop: 16,
    marginRight: -16,
  },
  photoScrollContent: {
    gap: 8,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  hoursText: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    marginLeft: 8,
  },
  hoursDivider: {
    color: colors.gray02,
  },
  dropdownButton: {
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
    marginLeft: 8,
  },
  hoursDetailText: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
    marginLeft: 24,
  },
  mapCard: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mapCardInner: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapPreviewMap: {
    height: 160,
    backgroundColor: colors.gray02,
  },
  mapDirectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  mapPreviewButtonText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  otherStoresTitle: {
    marginTop: 28,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  otherStoresGrid: {
    marginTop: 12,
  },
  otherStoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otherStoreItem: {
    width: 103,
  },
  otherStoreImage: {
    width: 103,
    height: 103,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  otherStoreName: {
    marginTop: 8,
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
  },
  otherStoreStatus: {
    marginTop: 4,
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.black,
  },
  subwayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6.5,
  },
  subwayCapsule: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: colors.sucess,
    marginLeft: 24,
  },
  subwayCapsuleText: {
    fontFamily: typography.SB,
    fontSize: 12,
    color: colors.black,
  },
  subwayText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginLeft: 4,
  },
});
