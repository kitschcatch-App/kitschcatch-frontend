/**
 * 스타일: 배송지 등록 화면 스타일 (AddressRegistrationScreen.styles)
 * 역할: 배송지 입력 폼(이름/연락처/우편번호/주소/상세주소), 기본배송지 설정, 등록하기 버튼 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontFamily: typography.SB,
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
  },
  zipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zipInput: {
    flex: 1,
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: colors.gray03,
  },
  searchButtonText: {
    fontFamily: typography.M,
    fontSize: 16,
    color: colors.black,
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  radioOff: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray07,
  },
  defaultText: {
    marginLeft: 8,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  registerButton: {
    marginHorizontal: 16,
    marginBottom: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.main05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: colors.gray02,
  },
  registerButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  registerButtonTextDisabled: {
    color: colors.gray06,
  },
});
