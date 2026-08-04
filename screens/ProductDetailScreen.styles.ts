/**
 * 스타일: 상품 상세 화면 스타일 (ProductDetailScreen.styles)
 * 역할: ProductDetailScreen에서 사용하는 모든 UI 요소들의 디자인(레이아웃, 색상, 크기 등)을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    left: 0,
    zIndex: 10, // 뒤로가기 버튼이 이미지 위로 오도록 설정
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomColor: '#00ff0000',
  },
  backButton: {
    marginRight: 1,
    marginLeft: 1, 
    marginBottom: 7,
    marginTop: 7,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    backgroundColor: colors.gray02,
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 10,
    textAlign: 'left',
  },
  modalOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 21,
    gap: 5,
  },
  modalOptionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 40,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gray04,
  },
  modalOptionBtnActive: {
    backgroundColor: `${colors.sub01}22`,
    borderColor: colors.main01,

  },
  modalOptionText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  modalOptionTextActive: {
    color: colors.sub02,
  },
  modalSubmitBtn: {
    backgroundColor: colors.main01,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: typography.SB,
  },
  infoContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginBottom: 15,
    
  },
  productSeparator: {
    width: '90%',
    height: 2,
    backgroundColor: colors.gray03,
    alignSelf: 'center',
    marginBottom: 8,
  },
  // 메타 정보 스타일
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 0, // 하단 마진 제거
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -13,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray07,
    marginRight: 8,
  },
  metaTime: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray07,
    marginRight: 8,
  },
  // 뱃지 영역 스타일 (판매상태 / 카테고리 / 사용감)
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.black,
    backgroundColor: colors.main03,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.main05,
  },
  // 판매자 정보 스타일
  sellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  transactionCount: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
  },
  sellerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
    marginRight: 10,
  },
  sellerProfileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray02,
  },
  // 액션 바 스타일 (채팅하기, 결제하기)
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    gap: 10,
  },
  wishButton: {
    padding: 10,
    marginRight: -15,
    marginTop: -10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    flex: 1,
    backgroundColor: colors.gray01,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  buyButton: {
    flex: 1,
    backgroundColor: colors.main05,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
});