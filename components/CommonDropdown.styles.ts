/**
 * 스타일: 공용 드롭다운 스타일 (CommonDropdown.styles)
 * 역할: CommonDropdown 컴포넌트에서 사용하는 드롭다운 버튼, 아이콘, 옵션 리스트 등의 UI 디자인을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  inputLabel: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
    marginBottom: 10,
  },
  conditionDropdownButton: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: colors.gray03,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionDropdownText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
  },
  conditionDropdownTextSelected: {
    color: colors.black,
  },
  conditionDropdownIcon: {
    color: colors.main02,
    fontFamily: typography.M,
    fontSize: 14,
  },
  dropdownContent: {
    backgroundColor: colors.gray03,
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 4,
  },
  dropdownOptionButton: {
    paddingVertical: 6,
  },
  dropdownOptionText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray01,
  },
});