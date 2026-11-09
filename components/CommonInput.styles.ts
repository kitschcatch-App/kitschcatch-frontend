/**
 * 스타일: 공용 입력창 스타일 (CommonInput.styles)
 * 역할: CommonInput 컴포넌트에서 사용하는 라벨, 입력창, 글자 수 카운터, 경고 텍스트 등의 UI 디자인을 정의하는 파일입니다.
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
  textInput: {
    borderRadius: 8,
    padding: 0,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    backgroundColor: colors.gray01,
    textAlignVertical: 'top',
  },
  charCounter: {
    textAlign: 'right',
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
  charCounterMax: {
    color: colors.error,
  },
  warningText: {
    textAlign: 'right',
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.error,
  },
});