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
  reviewSummary: {
    paddingVertical: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAverage: {
    marginLeft: 8,
    fontFamily: typography.SB,
    fontSize: 36,
    color: colors.black,
  },
  reviewTotal: {
    marginLeft: 12,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.gray06,
  },
  ratingList: {
    marginHorizontal: 24,
    paddingHorizontal: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingBar: {
    flex: 1,
    maxWidth: 181,
    height: 14,
    marginLeft: 12,
    backgroundColor: colors.gray01,
  },
  ratingBarFill: {
    height: 14,
    backgroundColor: colors.main05,
  },
  reviewWriteButton: {
    alignSelf: 'center',
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.main05,
    backgroundColor: colors.main01,
  },
  reviewWriteText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  reviewDivider: {
    height: 1,
    marginTop: 24,
    backgroundColor: colors.gray02,
  },
  reviewPhotoSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  reviewPhotoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewPhotoTitle: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  reviewPhotoMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewPhotoMoreText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
  reviewPhotoScroll: {
    marginRight: -16,
  },
  reviewPhotoList: {
    gap: 8,
    paddingRight: 16,
  },
  reviewPhotoImage: {
    width: 112,
    height: 112,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewHeaderTitle: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  reviewHeaderCount: {
    marginLeft: 0.5,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.gray06,
  },
  reviewSort: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewSortText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  reviewList: {
    padding: 16,
    gap: 16,
    marginBottom: 30,
    backgroundColor: colors.sub01,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray03,
  },
  reviewUser: {
    flex: 1,
    marginLeft: 12,
  },
  reviewNickname: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewDate: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
  reviewBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    gap: 16,
  },
  reviewContent: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  reviewImageBox: {
    width: 104,
    height: 104,
    borderRadius: 4,
    overflow: 'hidden',
  },
  reviewImagePagination: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  reviewImagePaginationText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.white,
  },
  reviewImagePaginationTextMuted: {
    fontSize: 11,
    fontFamily: typography.M,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  reviewImage: {
    width: 104,
    height: 104,
    borderRadius: 4,
  },
  ratingCount: {
    marginLeft: 12,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
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
  categoryPhotoScroll: {
    paddingVertical: 16,
  },
  categoryPhotoScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPhotoItem: {
    width: 96,
    height: 96,
    position: 'relative',
  },
  categoryPhotoImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  categoryPhotoDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryPhotoLabel: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.white,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  photoGridImage: {
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  photoEmptyText: {
    marginTop: 184,
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  infoContent: {
    padding: 16,
  },
  infoTitle: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  infoDescriptionBox: {
    marginTop: 12,
    minHeight: 120,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: colors.main02,
    marginLeft: 8,
    marginBottom: 16,
  },
  infoDescriptionText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  infoDescriptionEmptyText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
    textAlign: 'center',
  },
  infoDivider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: colors.gray02,
  },
  productSection: {
    padding: 16,
  },
  productBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  productBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.main05,
    backgroundColor: colors.main02,
    marginLeft: 8,
  },
  productBadgeText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  amenitySection: {
    padding: 16,
  },
  amenityRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  amenityItem: {
    flex: 1,
    alignItems: 'center',
  },
  amenityText: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  guideSection: {
    padding: 16,
  },
});
