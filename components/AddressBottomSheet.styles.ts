/**
 * 스타일: 배송지 바텀 시트 스타일 (AddressBottomSheet.styles)
 * 역할: AddressBottomSheet 컴포넌트의 레이아웃, 애니메이션 및 리스트 아이템 UI 스타일을 정의합니다.
 */


import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 24,
    paddingTop: 20,
    minHeight: 460,
    maxHeight: '85%',
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  handle: {
    width: 100,
    height: 4,
    backgroundColor: colors.gray04,
    borderRadius: 2,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
    textAlign: 'center',
  },
  addressListContainer: {
    flex: 1,
  },
  addressListContent: {
    paddingBottom: 10,
  },
  addressItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: colors.gray04,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressItemActive: {
    borderColor: colors.sub01,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  nameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: colors.main03,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.main01,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.sub02,
  },
  deleteText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  addressPhone: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
    marginBottom: 7,
  },
  addressText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
  },
  submitButton: {
    backgroundColor: colors.main01,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 15,
  },
  submitButtonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: typography.SB,
  },
});