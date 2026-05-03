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
    paddingHorizontal: 20,
  },
  topSpacer: {
    width: '100%',
  },
  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 1,
    marginLeft: 1, 
    marginBottom: 7,
    marginTop: 7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 10,
    height: 40,
    flex: 1,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    padding: 0, // 안드로이드 기본 패딩 제거
    marginLeft: 8,
  },
  searchIcon: {
    padding: 8,
    marginLeft: 0,
  },
  // 필터 스타일
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 35,
    width: 74,
    backgroundColor: colors.main01,
    borderColor: colors.main01,
  },
  dropdownButtonWide: {
    width: 105,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.M,
    textAlign: 'center',
  },
  divider: {
    height: 9,
    backgroundColor: colors.gray02,
    marginHorizontal: -20, 
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ff0000', //투명
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, //그림자
  },
  modalOptionButton: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.main02,
  },
  activeModalOptionText: {
    fontSize: 14,
    color: colors.main02,
    fontFamily: typography.M,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
  },
  productImage: {
    width: 120,
    height: 120,
    aspectRatio: 1, // 정사각형 비율
    backgroundColor: colors.gray02,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    color: colors.black,
    fontFamily: typography.SB,
    marginBottom: 8, 
    alignItems: 'flex-start',

  },
  productPrice: {
    fontSize: 14,
    color: colors.black,
    fontFamily: typography.M,
  },
  productSeparator: {
    width: '100%',
    height: 2,
    backgroundColor: '#DBDBDB',
    alignSelf: 'center',
  },
  // 상품 등록 버튼
  floatingButton: {
    position: 'absolute',
    bottom: 85, // 화면 하단에서의 위치
    right: 20, // 화면 오른쪽 여백
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
