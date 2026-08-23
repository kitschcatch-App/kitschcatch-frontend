/**
 * 스타일: 탭바 스타일 (TabBar.styles)
 * 역할: TabBar 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.main05,
  },
  tabLabel: {
    fontSize: 16,
    fontFamily: typography.M,
    color: colors.black,
  },
  tabLabelActive: {
    fontFamily: typography.SB,
    color: colors.black,
  },
});
