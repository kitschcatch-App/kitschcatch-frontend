/**
 * 스타일: 성공 뷰 스타일 (SuccessView.styles)
 * 역할: SuccessView 컴포넌트의 모달 오버레이 및 메시지 UI 스타일을 정의합니다.
 */


import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 70,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },
});
