/**
 * 스타일: 배송지 관리 화면 스타일 (AddressManagementScreen.styles)
 * 역할: 배송지 카드(이름/기본배송지 뱃지/전화번호/주소지/삭제·수정 버튼) UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  addressCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.sub05,
    borderRadius: 8,
  },
  addressCardPlain: {
    borderColor: colors.gray03,
  },
  addressCardSpacing: {
    marginTop: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
  },
  defaultBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.main05,
    backgroundColor: colors.main01,
  },
  defaultBadgeText: {
    fontFamily: typography.M,
    fontSize: 11,
    color: colors.sub07,
  },
  phone: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
  address: {
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  detailAddress: {
    marginTop: 2,
    fontFamily: typography.M,
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  actionButton: {
    marginRight: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.gray01,
  },
  actionButtonText: {
    fontFamily: typography.M,
    fontSize: 11,
    color: colors.black,
  },
  deleteButtonText: {
    color: colors.error,
  },
  registerButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
});
