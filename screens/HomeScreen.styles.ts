/**
 * 스타일: 홈 화면 스타일 (HomeScreen.styles)
 * 역할: HomeScreen에서 사용하는 헤더, 이미지 배너 등의 UI 스타일을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  topSpacer: {
    width: '100%',
  },
  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmIcon: {
    marginRight: 14,
  },
  searchIcon: {},
  // 스크롤 영역 (헤더 아래 전체)
  scrollContent: {
    paddingBottom: 20, // 바텀 내비를 가리지 않도록 하단 여백 추가
  },
  // 이미지 배너
  bannerContainer: {
    overflow: 'hidden',
    backgroundColor: colors.gray02,
  },
  bannerImage: {
    height: 160,
  },
  bannerPagination: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerPaginationText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.white,
  },
  bannerPaginationTextMuted: {
    fontSize: 11,
    fontFamily: typography.M,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // 카테고리별 보기
  categoryContainer: {
    paddingVertical: 40,
    paddingLeft: 16, 
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 16,
  },
  categoryScrollContent: {
    gap: 16,
    paddingRight: 16, // 오른쪽 끝까지 스크롤했을 때 여백 확보
  },
  categoryItem: {
    width: 56,
    alignItems: 'center',
  },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 34,
    height: 34,
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
    textAlign: 'center',
  },
  // 오늘의 추천
  recommendContainer: {
    paddingVertical: 40,
    paddingLeft: 16,
  },
  recommendTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 16,
  },
  recommendScrollContent: {
    gap: 12,
    paddingRight: 16, // 오른쪽 끝까지 스크롤했을 때 여백 확보
  },
  recommendCard: {
    width: 144,
    height: 144,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray02,
  },
  recommendImage: {
    width: 144,
    height: 144,
  },
  recommendGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  recommendTextOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  recommendName: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.white,
    marginBottom: 2,
  },
  recommendPrice: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.white,
  },
  // 최근 본 상품과 비슷한 상품
  similarContainer: {
    paddingVertical: 40,
    paddingLeft: 16,
  },
  similarTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 16,
  },
  similarScrollContent: {
    gap: 8,
    paddingRight: 16, // 오른쪽 끝까지 스크롤했을 때 여백 확보
  },
  similarCard: {
    width: 120,
  },
  similarImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  similarName: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  similarPrice: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  // 인기 작품
  popularContainer: {
    paddingVertical: 40,
    paddingLeft: 16,
  },
  popularHeading: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 16,
  },
  popularScrollContent: {
    gap: 16,
    paddingRight: 16, // 오른쪽 끝까지 스크롤했을 때 여백 확보
  },
  popularCard: {
    width: 76,
  },
  popularTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  popularTitle: {
    maxWidth: 62, // 카드 너비(76)에서 next 아이콘(5) + gap(4) + 여유분을 뺀 값
    fontSize: 13,
    fontFamily: typography.M,
    color: colors.black,
    lineHeight: 17,
    textAlign: 'center',
  },
  popularNextIcon: {
    marginLeft: 4,
  },
  popularNextIconTight: {
    marginLeft: 1,
  },
  popularCount: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    textAlign: 'center',
  },
  // 현재 인기있는 상품
  popularProductsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  popularProductsHeading: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 16,
  },
  popularProductsCategoryContainer: {
    marginBottom: 16,
    marginRight: -16, // 부모 컨테이너의 오른쪽 여백(paddingHorizontal 16) 상쇄
  },
  popularProductsCategoryScrollContent: {
    gap: 5,
    paddingRight: 16,
  },
  popularProductsCategoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.gray03,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularProductsCategoryButtonActive: {
    borderColor: '#B1F5F0',
    backgroundColor: colors.main03,
  },
  popularProductsCategoryText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  popularProductsGrid: {
    overflow: 'hidden',
  },
  popularProductsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popularProductsRowSpacing: {
    marginBottom: 12,
  },
  popularProductsCard: {
    width: 112,
  },
  popularProductsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  popularProductsName: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  popularProductsPrice: {
    marginTop: 2,
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  // 내 주변 매장
  nearbyStoresContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  nearbyStoresHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nearbyStoresHeading: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  nearbyStoresMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyStoresMoreText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray06,
  },
  nearbyStoresMoreIcon: {
    marginLeft: 4,
  },
  nearbyStoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nearbyStoresRowSpacing: {
    marginBottom: 20,
  },
  nearbyStoreCard: {
    width: 168,
  },
  nearbyStoreImage: {
    width: 158,
    height: 158,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  nearbyStoreName: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  nearbyStoreInfo: {
    fontSize: 12,
    fontFamily: typography.SB,
    color: colors.black,
  },
  nearbyStoreInfoDivider: {
    color: '#CCCCCC',
  },
  // 상품 등록 버튼
  floatingButton: {
    position: 'absolute',
    right: 16,
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.main05,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  floatingButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
});
