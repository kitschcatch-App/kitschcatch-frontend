/**
 * 스타일: 결제 화면 스타일 (PaymentScreen.styles)
 * 역할: PaymentScreen에서 사용하는 UI 요소들의 디자인을 정의하는 파일입니다.
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
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  backButton: {
    marginRight: 1,
    marginLeft: 1, 
    marginBottom: 7,
    marginTop: 7,
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
  contentBackground: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  sectionContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 10,
  },
  infoName: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
    marginLeft: 10,
  },
  infoTel: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    marginLeft: 10,
    marginTop: -2,
  },
  addressText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 10,
    marginRight: 40,
    marginTop: 4,
  },
  memoDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: colors.gray07,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  memoDropdownButtonError: {
    borderColor: colors.error,
  },
  memoErrorText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.error,
    textAlign: 'right',
    marginLeft: 10,
    marginRight: 10,
    marginTop: -6,
    marginBottom: 6,
  },
  memoDropdownText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  memoDropdownTextActive: {
    color: colors.black,
  },
  memoDropdownIcon: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub05,
  },
  memoDropdownList: {
    borderWidth: 0.7,
    borderColor: colors.gray07,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: colors.white,
  },
  memoDropdownOption: {
    paddingVertical: 6,
    justifyContent: 'center',
  },
  memoDropdownOptionText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
  },
  changeAddressText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    marginRight: 10,
    textDecorationLine: 'underline',
  },
  payButtonContainer: {
    marginTop: 15,
  },
  payButton: {
    backgroundColor: colors.gray03,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonActive: {
    backgroundColor: colors.main05,
  },
  payButtonText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: typography.SB,
  },
  paymentErrorText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 10,
  },
  productInfoContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 16,
  },
  productImage: {
    width: 66,
    height: 66,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
    gap: 5,
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
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  paymentMethodContainer: {
    marginTop: 12,
    gap: 8,
    paddingHorizontal: 15,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  paymentMethodRowBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  paymentMethodButton: {
    width: 80,
    height: 38,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.7,
    borderColor: colors.gray05,
    borderRadius: 8,
  },
  paymentMethodButtonActive: {
    backgroundColor: colors.main05,
    borderColor: colors.main05,
  },
  paymentMethodText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  paymentMethodTextActive: {
    color: colors.black,
  },
  // 안심결제
  safePaymentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safePaymentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safePaymentTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  safePaymentRequiredText: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.sub07,
  },
  safePaymentDescText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginTop: 12,
  },
  safePaymentFeeText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.sub07,
    marginTop: 12,
  },
  safePaymentFeeDescText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    marginTop: 4,
  },
  safePaymentPolicyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  safePaymentPolicyText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  // 최종 결제 금액
  paymentDetailsContainer: {
    marginTop: 12,
    gap: 8,
    paddingHorizontal: 10,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDetailLabel: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  paymentDetailValue: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  paymentDetailIcon: {
    color: colors.sub07,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.gray04,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  paymentTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  totalPaymentLabel: {
    fontSize: 20,
    fontFamily: typography.SB,
    color: colors.sub07,
  },
  // 약관동의
  termsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButtonOff: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.gray07,
  },
  termsHeaderText: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  termsDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  termsDetailText: {
    flexShrink: 1,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  termsRequiredText: {
    color: colors.sub07,
  },
  termsErrorText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.error,
    textAlign: 'right',
    marginTop: 8,
  },
});
