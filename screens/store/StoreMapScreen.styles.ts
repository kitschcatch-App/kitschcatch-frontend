/**
 * 스타일: 매장지도 화면 스타일 (StoreMapScreen.styles)
 * 역할: StoreMapScreen의 헤더, 매장 검색창, 반경 선택, 지도 영역 UI 스타일을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 매장 검색창
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: colors.gray01,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    padding: 0, // 안드로이드 기본 패딩 제거
    fontFamily: typography.M,
  },
  // 지도 영역
  mapWrapper: {
    flex: 1,
    backgroundColor: colors.gray02,
  },
  map: {
    flex: 1,
  },
  // 반경(1/3/5km) 선택 캡슐 — 지도 맨 위 가운데
  radiusCapsuleWrapper: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  radiusCapsule: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  radiusSegment: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radiusSegmentFirst: {
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
  radiusSegmentLast: {
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  radiusSegmentActive: {
    backgroundColor: colors.main03,
    borderColor: colors.main05,
  },
  radiusSegmentText: {
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.black,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  permissionBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  permissionBannerText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.white,
    textAlign: 'center',
  },
  // 매장 핀 클릭 시 뜨는 상세 팝업
  storePopup: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sub05,
    borderRadius: 8,
    padding: 16,
  },
  storePopupImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  storePopupInfo: {
    flex: 1,
    marginLeft: 16,
  },
  storePopupNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storePopupName: {
    flex: 1,
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    marginRight: 8,
  },
  storePopupRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storePopupRating: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginLeft: 4,
  },
  storePopupStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  storePopupStatusOpen: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
  },
  storePopupStatusDivider: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray04,
    marginHorizontal: 4,
  },
  storePopupStatusClose: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  storePopupAddress: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    marginTop: 6,
  },
  storePopupDetailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  storePopupDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.main05,
    backgroundColor: colors.main03,
  },
  storePopupDetailButtonText: {
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  storePopupDetailButtonIcon: {
    marginLeft: 6,
  },
});
