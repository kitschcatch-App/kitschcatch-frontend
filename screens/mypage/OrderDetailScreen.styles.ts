/**
 * 스타일: 주문 상세 화면 스타일 (OrderDetailScreen.styles)
 * 역할: OrderDetailScreen에서 사용하는 UI 요소들의 디자인을 정의하는 파일입니다.
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
  buyerContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
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
  contactButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.gray03,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.black,
  },
  shippingContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  shippingTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  deadlineBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: `${colors.error}0D`,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineLabel: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.error,
  },
  deadlineValue: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.error,
  },
  deadlineDescText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  formRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  formLabel: {
    width: 52,
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  formLabelTop: {
    marginTop: 12,
  },
  formDropdown: {
    flex: 1,
  },
  formInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formInput: {
    flex: 1,
  },
  searchButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: colors.gray02,
  },
  searchButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  dateInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  dateInput: {
    paddingRight: 36,
  },
  calendarIcon: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  registerButton: {
    marginTop: 16,
    backgroundColor: colors.main05,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: colors.gray02,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  shippingNoticeText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    lineHeight: 16,
  },
  trackingGuideContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  trackingGuideTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  settlementContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  settlementTitle: {
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
