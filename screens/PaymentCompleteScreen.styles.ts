/**
 * 스타일: 결제 완료 화면 스타일 (PaymentCompleteScreen.styles)
 * 역할: PaymentCompleteScreen 화면의 레이아웃 및 UI 요소(결제 완료 메시지, 주문 정보 등)의 스타일을 정의합니다.
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // 닫기 버튼을 우측 끝으로 밀어냅니다.
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  exitButton: {
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  completeImage: {
    marginBottom: 20,
  },
  mainText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  subText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray01,
    marginBottom: 30,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: colors.gray04,
    alignSelf: 'center',
  },
  orderProductContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  productRowWrapper: {
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: colors.white, 
    shadowColor: '#000000',
    shadowOffset: { width: -3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: `${colors.main01}1A`,
    borderRadius: 8,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
    height: 120, 
  },
  productName: {
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.black,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    marginTop: 4,
  },
  orderNumber: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  historyButton: {
    backgroundColor: colors.main01,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 50,
  },
  historyButtonText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: typography.SB,
  },
});