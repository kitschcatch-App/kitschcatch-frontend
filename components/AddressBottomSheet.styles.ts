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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    minHeight: 495,
    maxHeight: '85%',
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  handle: {
    width: 100,
    height: 4,
    backgroundColor: colors.gray03,
    borderRadius: 2,
  },
  header: {
    marginBottom: 24,
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
    borderColor: colors.gray03,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressItemActive: {
    borderColor: colors.sub05,
    backgroundColor: colors.main01,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  nameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: colors.main01,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.main05,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.sub07,
  },
  addressPhone: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
  },
  noticeText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
    marginTop: -6,
  },
  submitButton: {
    backgroundColor: colors.main05,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  submitButtonText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: typography.SB,
  },
});