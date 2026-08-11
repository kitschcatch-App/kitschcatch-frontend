/**
 * 스타일: 홈 화면 스타일 (HomeScreen.styles)
 * 역할: HomeScreen에서 사용하는 헤더, 이미지 배너 등의 UI 스타일을 정의하는 파일입니다.
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
    paddingHorizontal: 16,
  },
  topSpacer: {
    width: '100%',
  },
  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmIcon: {
    marginRight: 14,
  },
  searchIcon: {},
  // 이미지 배너
  bannerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray02,
  },
  bannerImage: {
    height: 160,
  },
  bannerPagination: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerPaginationText: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.white,
  },
});
