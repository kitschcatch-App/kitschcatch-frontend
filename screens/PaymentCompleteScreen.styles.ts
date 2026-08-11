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
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  completeImage: {
    marginBottom: 5,
  },
  mainText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  subText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub07,
  },
  depositInfoContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  depositDeadlineLabel: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  depositDeadlineDate: {
    fontSize: 20,
    fontFamily: typography.SB,
    color: colors.black,
  },
  depositNoticeText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
    marginTop: 8,
  },
  depositPolicyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  depositPolicyText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
    marginRight: 4,
  },
  orderProductContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  productRowWrapper: {
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: colors.main01,
    borderWidth: 1,
    borderColor: colors.main05,
  },
  productRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
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
    marginLeft: 8,
    justifyContent: 'space-between',
    height: 120, 
  },
  productName: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
    marginTop: 6,
  },
  orderNumber: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  historyButton: {
    backgroundColor: colors.main05,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  historyButtonText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: typography.SB,
  },
});