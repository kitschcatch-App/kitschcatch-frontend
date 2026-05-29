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
    paddingBottom: 40,
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
    marginLeft: 10,
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
    gap: 10,
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
    color: colors.gray01,
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 10,
    marginRight: 40,
  },
  memoDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: colors.gray01,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  memoDropdownText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  memoDropdownIcon: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.main02,
  },
  memoDropdownList: {
    borderWidth: 0.7,
    borderColor: colors.gray01,
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
    color: colors.gray01,
  },
  activeMemoOptionText: {
    color: colors.main02,
    fontFamily: typography.M,
  },
  changeAddressText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray01,
    marginRight: 10,
  },
  payButton: {
    backgroundColor: colors.main01,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: typography.SB,
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
    marginTop: 15,
    marginLeft: 10,
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
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  productPrice: {
    fontSize: 16,
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
    marginTop: 20,
    gap: 10,
    paddingHorizontal: 15,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodRowBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 44,
  },
  paymentMethodButton: {
    width: 77,
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.7,
    borderColor: colors.gray01,
    borderRadius: 8,
  },
  paymentMethodButtonActive: {
    backgroundColor: colors.main01,
    borderColor: colors.main01,
  },
  paymentMethodText: {
    fontSize: 13,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  paymentMethodTextActive: {
    color: colors.black,
  },
  // 최종 결제 금액
  paymentDetailsContainer: {
    marginTop: 15,
    gap: 10,
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
    color: colors.main02,
  },
});
