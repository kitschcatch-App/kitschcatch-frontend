/**
 * 화면: 검색 화면 (SearchScreen)
 * 역할: 홈 화면의 검색 아이콘을 통해 진입하며, 상품 검색어 입력과 최근 검색어를 보여주는 화면 컴포넌트입니다.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../../assets/back.svg';
import SearchIcon from '../../assets/search.svg';
import SearchGrayIcon from '../../assets/search-g.svg';
import ExitIcon from '../../assets/exit-w.svg';
import ArrowUpIcon from '../../assets/arrow-up.svg';
import KitschcatchIcon from '../../assets/kitschcatch.svg';
import ExitGrayIcon from '../../assets/exit.svg';
import { searchAPI } from '../../api/apiClient';
import { useMockMode } from '../../contexts/MockModeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { styles } from './SearchScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

type PopularKeyword = { rank: number; keyword: string };
type RecentKeyword = { id: number; keyword: string };

// Mock 모드용 인기 검색어
const MOCK_POPULAR: PopularKeyword[] = ['원신', '블루 아카이브', '프로젝트 세카이', '붕괴: 스타레일', '하이큐!!', '주술회전', '홀로라이브', '귀멸의 칼날', '명탐정 코난', '앙상블 스타즈!!'].map(
  (keyword, i) => ({ rank: i + 1, keyword }),
);

const SearchScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;
  const { isMockMode } = useMockMode();
  const [popular, setPopular] = useState<PopularKeyword[]>(isMockMode ? MOCK_POPULAR : []);
  const [recent, setRecent] = useState<RecentKeyword[]>([]);
  const [recentLoading, setRecentLoading] = useState(!isMockMode); // 최근 검색어 최초 로딩 중
  const [related, setRelated] = useState<string[]>([]);

  // 인기·최근 검색어 (화면에 돌아올 때마다 갱신)
  useFocusEffect(
    useCallback(() => {
      if (isMockMode) return;
      searchAPI
        .getPopular()
        .then(res => setPopular(res.data.data.items))
        .catch(e => console.error('인기 검색어 조회 실패:', e));
      searchAPI
        .getRecent()
        .then(res => setRecent(res.data.data.items))
        .catch(e => console.error('최근 검색어 조회 실패:', e))
        .finally(() => setRecentLoading(false));
    }, [isMockMode]),
  );

  // 연관 검색어 (입력 후 250ms 지나면 조회)
  useEffect(() => {
    const k = searchQuery.trim();
    if (isMockMode || !k) {
      setRelated([]);
      return;
    }
    const t = setTimeout(() => {
      searchAPI
        .getRelated(k)
        .then(res => setRelated(res.data.data.items.map((i: { keyword: string }) => i.keyword)))
        .catch(e => console.error('연관 검색어 조회 실패:', e));
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery, isMockMode]);

  // 검색 실행: 기록 저장 후 상품 목록 화면에서 keyword로 서버 검색
  const search = (keyword: string) => {
    const k = keyword.trim();
    if (!k) return;
    if (!isMockMode) searchAPI.record(k).catch(e => console.error('검색 기록 저장 실패:', e));
    navigation.navigate('ProductList', { keyword: k });
  };
  const submitSearch = () => search(searchQuery);

  const deleteRecent = (id: number) => {
    setRecent(r => r.filter(x => x.id !== id));
    if (!isMockMode) searchAPI.deleteRecent(id).catch(e => console.error('최근 검색어 삭제 실패:', e));
  };
  const clearRecent = () => {
    setRecent([]);
    if (!isMockMode) searchAPI.clearRecent().catch(e => console.error('최근 검색어 전체 삭제 실패:', e));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 68) }]} />

        {/* 상단 로고 영역 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ marginLeft: -8, marginRight: 2, width: 39, height: 40 }}
            resizeMode="contain"
          />
          <KitschcatchIcon width={67} height={23} style={{ marginTop: 8 }} />
        </View>

        {/* 상단 헤더: 백 버튼 & 검색창 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon width={10} height={18} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={submitSearch}
              returnKeyType="search"
              underlineColorAndroid="transparent"
              placeholder="상품을 검색해보세요"
            />
            {isSearching ? (
              <TouchableOpacity style={styles.searchIcon} onPress={() => setSearchQuery('')}>
                <View style={styles.exitButton}>
                  <ExitIcon width={7} height={7} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.searchIcon}>
                <SearchGrayIcon width={16} height={18} />
              </TouchableOpacity>
            )}
          </View>

          {isSearching && (
            <TouchableOpacity style={styles.searchSubmitIcon} onPress={submitSearch}>
              <SearchIcon width={20} height={20} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isSearching ? (
            /* 연관 검색어 */
            <View style={styles.relatedSearchContainer}>
              {related.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={styles.relatedSearchRow}
                  activeOpacity={0.7}
                  onPress={() => setSearchQuery(keyword)}
                >
                  <Text style={styles.relatedSearchText} numberOfLines={1} ellipsizeMode="tail">
                    {keyword}
                  </Text>
                  <ArrowUpIcon width={9} height={9} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <>
              {/* 최근 검색어 */}
              <View style={styles.recentSearchContainer}>
                <View style={styles.recentSearchHeader}>
                  <Text style={styles.recentSearchTitle}>최근 검색어</Text>
                  {recent.length > 0 && (
                    <TouchableOpacity onPress={clearRecent}>
                      <Text style={styles.recentSearchClear}>전체 삭제</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {recentLoading ? (
                  <View style={styles.recentSearchEmpty}>
                    <ActivityIndicator />
                  </View>
                ) : recent.length === 0 ? (
                  <View style={styles.recentSearchEmpty}>
                    <Text style={styles.recentSearchEmptyText}>최근검색어가 없습니다.</Text>
                  </View>
                ) : (
                  recent.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.recentSearchRow}
                      activeOpacity={0.7}
                      onPress={() => search(item.keyword)}
                    >
                      <Text style={styles.recentSearchText} numberOfLines={1} ellipsizeMode="tail">
                        {item.keyword}
                      </Text>
                      <TouchableOpacity hitSlop={8} onPress={() => deleteRecent(item.id)}>
                        <ExitGrayIcon width={10} height={10} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              {/* 인기 검색어 */}
              <View style={styles.popularSearchContainer}>
                <Text style={styles.popularSearchTitle}>인기 검색어</Text>
                <View style={styles.popularSearchColumns}>
                  {[popular.slice(0, 5), popular.slice(5, 10)].map((column, columnIndex) => (
                    <View
                      key={columnIndex}
                      style={[styles.popularSearchColumn, columnIndex === 1 && styles.popularSearchColumnRight]}
                    >
                      {column.map(item => (
                        <TouchableOpacity
                          key={item.rank}
                          style={styles.popularSearchRow}
                          activeOpacity={0.7}
                          onPress={() => search(item.keyword)}
                        >
                          <Text style={styles.popularSearchRank}>{item.rank}</Text>
                          <Text style={styles.popularSearchKeyword} numberOfLines={1} ellipsizeMode="tail">
                            {item.keyword}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
