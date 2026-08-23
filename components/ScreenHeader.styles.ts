/**
 * 스타일: 화면 헤더 스타일 (ScreenHeader.styles)
 * 역할: ScreenHeader 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  headerContainer: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  headerSpacer: {
    width: 40,
  },
});
