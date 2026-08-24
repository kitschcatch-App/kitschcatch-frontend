/**
 * 스타일: 구매내역 주문 상세 화면 스타일 (PurchaseOrderDetailScreen.styles)
 * 역할: PurchaseOrderDetailScreen에서 사용하는 UI 요소들의 디자인을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.sub01,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 60,
  },
  processContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.main07,
  },
  processTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  processSubtitle: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
    marginTop: 4,
  },
  processStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  processStep: {
    flex: 1,
    alignItems: 'center',
  },
  processCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processCircleActive: {
    backgroundColor: colors.main07,
  },
  processStepLabel: {
    fontSize: 12,
    fontFamily: typography.SB,
    color: colors.black,
    marginTop: 6,
    textAlign: 'center',
  },
  processStepLabelInactive: {
    color: colors.gray06,
  },
  orderContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  orderNumberText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  orderProductRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  orderProductImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray05,
  },
  orderProductInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    gap: 5,
  },
  orderProductTitle: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  orderProductPrice: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  orderDivider: {
    height: 1,
    backgroundColor: colors.gray02,
    marginTop: 16,
  },
  priceBreakdownContainer: {
    marginTop: 16,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  breakdownInfoIcon: {
    color: colors.sub07,
  },
  breakdownValue: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  totalPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalPaymentLabel: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  totalPaymentValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPaymentValue: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  totalPaymentIcon: {
    marginLeft: 8,
  },
  paymentInfoContainer: {
    marginTop: 12,
    gap: 8,
  },
  paymentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfoLabel: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.gray07,
    marginRight: 12,
  },
  paymentInfoValue: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.white,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
  },
  actionButtonDivider: {
    width: 1,
    backgroundColor: colors.gray02,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.black,
  },
  buyerContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buyerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buyerTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  buyerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  buyerName: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  buyerPhone: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  buyerAddressText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginTop: 9.5,
    lineHeight: 20,
  },
  buyerRequestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  buyerRequestLabel: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  buyerRequestValue: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  shippingInfoContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  shippingInfoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shippingInfoTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  shippingInfoRows: {
    marginTop: 12,
    gap: 8,
  },
  shippingDeadlineContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  shippingDeadlineTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  noticeContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.main07,
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  noticeText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    lineHeight: 20,
  },
});
