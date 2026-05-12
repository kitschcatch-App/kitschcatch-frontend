/**
 * 스타일: 상품 상세 화면 스타일 (ProductDetailScreen.styles)
 * 역할: ProductDetailScreen에서 사용하는 모든 UI 요소들의 디자인(레이아웃, 색상, 크기 등)을 정의하는 파일입니다.
 */
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const { height } = Dimensions.get('window');

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
  productImage: {
    width: '100%',
    height: height * 0.5, // 화면 세로 길이의 약 60%를 차지
    backgroundColor: colors.gray02,
  },
  infoContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  productSeparator: {
    width: '90%',
    height: 2,
    backgroundColor: '#DBDBDB',
    alignSelf: 'center',
    marginBottom: 10,
  },
  // 메타 정보 스타일
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 0, // 하단 마진 제거
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray01,
    marginRight: 8,
  },
  metaTime: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  metaTag: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray01,
    marginRight: 6,
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
    color: colors.gray01,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    flex: 1,
    backgroundColor: colors.gray02,
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
    backgroundColor: colors.main01,
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