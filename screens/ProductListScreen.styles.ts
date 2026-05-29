/**
 * 스타일: 상품 목록 화면 스타일 (ProductListScreen.styles)
 * 역할: ProductListScreen에서 사용하는 헤더, 검색창, 필터 드롭다운(모달), 상품 카드 등의 UI 스타일을 정의하는 파일입니다.
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
    paddingHorizontal: 16,
  },
  topSpacer: {
    width: '100%',
  },
  // 로고 컨테이너
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  // Mock 모드 토글 버튼 (개발/테스트용)
  mockTogglePill: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gray04,
    backgroundColor: colors.gray03,
  },
  mockTogglePillActive: {
    borderColor: colors.sub01,
    backgroundColor: `${colors.sub01}22`,
  },
  mockTogglePillText: {
    fontSize: 11,
    fontFamily: typography.SB,
    color: colors.gray01,
  },
  mockTogglePillTextActive: {
    color: colors.sub02,
  },
  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 7,
    marginTop: 7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    backgroundColor: colors.gray02,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    padding: 0, // 안드로이드 기본 패딩 제거
    fontFamily: typography.M,
  },
  searchIcon: {
  },
  // 카테고리 필터 스타일
  categoryContainer: {
    marginBottom: 10,
    marginHorizontal: -16, // 화면 양끝까지 스와이프 되도록 부모 여백(padding 16) 상쇄
  },
  categoryScrollContent: {
    gap: 5,
    paddingHorizontal: 16, // 리스트 시작과 끝에 여백 추가
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.gray04,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    borderColor: colors.main01,
    backgroundColor: `${colors.main01}26`, // 15% opacity
  },
  categoryText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  categoryTextActive: {
    color: colors.sub02,
  },
  // 필터 스타일
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.M,
    marginLeft: 8,
  },
  productListContent: {
    paddingBottom: 100, // 플로팅 버튼과 바텀 내비를 가리지 않도록 하단 여백 추가
  },
  row: {
    justifyContent: 'space-between',
    gap: 28,
    marginBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: colors.white,
    maxWidth: '48%', // 상품이 1개만 남았을 때 전체 너비를 차지하는 것을 방지
  },
  productImage: {
    width: '100%',
    aspectRatio: 1, // 정사각형 비율
    backgroundColor: colors.gray02,
    borderRadius: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: colors.main01,
  },
  statusBadgeSoldOut: {
    backgroundColor: colors.gray04,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.black,
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.M,
    marginBottom: 4, 
  },
  productPrice: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.SB,
    marginBottom: 4,
  },
  productMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  metaIcon: {
    marginLeft: 8,
    marginRight: 3,
  },
  metaText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  // 상품 등록 버튼
  floatingButton: {
    position: 'absolute',
    bottom: 85, // 화면 하단에서의 위치
    right: 16, // 화면 오른쪽 여백
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.main01,
    borderRadius: 30,
  },
  floatingButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
});
