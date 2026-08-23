/**
 * 스타일: 검색 화면 스타일 (SearchScreen.styles)
 * 역할: SearchScreen에서 사용하는 헤더, 검색창, 최근 검색어 영역의 UI 스타일을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

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
  scrollContent: {
    paddingBottom: 40,
  },
  // 로고 컨테이너
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 7,
    marginTop: 7,
    marginRight: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    backgroundColor: colors.gray01,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    padding: 0, // 안드로이드 기본 패딩 제거
    fontFamily: typography.M,
  },
  searchIcon: {
    marginLeft: 6,
  },
  exitButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gray05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSubmitIcon: {
    marginLeft: 8,
  },
  // 최근 검색어 컨테이너
  recentSearchContainer: {
    marginTop: 16,
  },
  recentSearchTitle: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  recentSearchEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  recentSearchEmptyText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.gray07,
  },
  // 인기 검색어 컨테이너
  popularSearchContainer: {
    marginTop: 24,
  },
  popularSearchTitle: {
    fontSize: 14,
    fontFamily: typography.SB,
    color: colors.black,
  },
  popularSearchColumns: {
    flexDirection: 'row',
    marginTop: 12,
  },
  popularSearchColumn: {
    flex: 1,
  },
  popularSearchColumnRight: {
    marginLeft: 16,
  },
  popularSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  popularSearchRank: {
    width: 16,
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.black,
  },
  popularSearchKeyword: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginRight: 8,
  },
  // 연관 검색어 드롭다운
  relatedSearchContainer: {
    marginTop: 4,
    marginLeft: 22, // 검색창 좌측 시작 지점(백 버튼 + 여백)과 정렬
    marginRight: 28, // 검색창 우측 끝 지점(바깥 검색 아이콘 + 여백)과 정렬
    backgroundColor: colors.gray01,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  relatedSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  relatedSearchText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
    marginRight: 8,
  },
});
