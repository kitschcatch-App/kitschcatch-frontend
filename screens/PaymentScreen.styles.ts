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
  addressText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 10,
    marginRight: 40,
  },
  addressMemo: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 15,
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
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: colors.gray01,
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  payButton: {
    backgroundColor: colors.main01,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: typography.SB,
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.gray02,
  },
  productName: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    flex: 1,
  },
  paymentMethodContainer: {
    marginTop: 20,
    gap: 10,
    paddingHorizontal: 15,
  },
  paymentMethodRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodRowBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 44,
  },
  paymentMethodButton: {
    width: 82,
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
  },
  // 최종 결제 금액
  paymentDetailsContainer: {
    marginTop: 20,
    gap: 15,
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
    backgroundColor: colors.gray02,
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
    fontFamily: typography.B,
    color: colors.main02,
  },
  totalPaymentValue: {
    fontSize: 20,
    fontFamily: typography.B,
    color: colors.main02,
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.7,
    borderColor: colors.gray01,
  },
  modalOptionButton: {
    paddingVertical: 3,
    justifyContent: 'center',
  },
  modalOptionText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
  },
//   제안 사항
  activeModalOptionText: {
    color: colors.main02,
    fontFamily: typography.M,
  },
});
