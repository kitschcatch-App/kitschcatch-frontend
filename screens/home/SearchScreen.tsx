/**
 * 화면: 검색 화면 (SearchScreen)
 * 역할: 홈 화면의 검색 아이콘을 통해 진입하며, 상품 검색어 입력과 최근 검색어를 보여주는 화면 컴포넌트입니다.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import BackIcon from '../../assets/back.svg';
import SearchIcon from '../../assets/search.svg';
import SearchGrayIcon from '../../assets/search-g.svg';
import ExitIcon from '../../assets/exit-w.svg';
import ArrowUpIcon from '../../assets/arrow-up.svg';
import KitschcatchIcon from '../../assets/kitschcatch.svg';
import UpIcon from '../../assets/up.svg';
import DownIcon from '../../assets/down.svg';
import DashIcon from '../../assets/dash.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { styles } from './SearchScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

type Trend = 'up' | 'down' | 'dash';
type PopularKeyword = { rank: number; keyword: string; trend: Trend };

// 인기 검색어 (mock)
const POPULAR_KEYWORDS: PopularKeyword[] = [
  { rank: 1, keyword: '원신', trend: 'up' },
  { rank: 2, keyword: '블루 아카이브', trend: 'up' },
  { rank: 3, keyword: '프로젝트 세카이', trend: 'dash' },
  { rank: 4, keyword: '붕괴: 스타레일', trend: 'down' },
  { rank: 5, keyword: '하이큐!!', trend: 'dash' },
  { rank: 6, keyword: '주술회전', trend: 'dash' },
  { rank: 7, keyword: '홀로라이브', trend: 'up' },
  { rank: 8, keyword: '귀멸의 칼날', trend: 'down' },
  { rank: 9, keyword: '명탐정 코난', trend: 'dash' },
  { rank: 10, keyword: '앙상블 스타즈!!', trend: 'down' },
];

const TREND_ICONS: Record<Trend, React.FC<SvgProps>> = {
  up: UpIcon,
  down: DownIcon,
  dash: DashIcon,
};

const TREND_SIZES: Record<Trend, { width: number; height: number }> = {
  up: { width: 8, height: 5 },
  down: { width: 8, height: 5 },
  dash: { width: 6, height: 2 },
};

// 연관 검색어 (mock)
const RELATED_KEYWORDS = [
  '귀멸의 칼날 탄지로',
  '귀멸의 칼날 무이치로',
  '귀멸의 칼날 피규어',
  '귀멸의 칼날 렌고쿠 피규어',
];

const SearchScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;

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
            <TouchableOpacity style={styles.searchSubmitIcon}>
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
              {RELATED_KEYWORDS.map((keyword) => (
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
                <Text style={styles.recentSearchTitle}>최근 검색어</Text>
                <View style={styles.recentSearchEmpty}>
                  <Text style={styles.recentSearchEmptyText}>최근검색어가 없습니다.</Text>
                </View>
              </View>

              {/* 인기 검색어 */}
              <View style={styles.popularSearchContainer}>
                <Text style={styles.popularSearchTitle}>인기 검색어</Text>
                <View style={styles.popularSearchColumns}>
                  {[POPULAR_KEYWORDS.slice(0, 5), POPULAR_KEYWORDS.slice(5, 10)].map((column, columnIndex) => (
                    <View
                      key={columnIndex}
                      style={[styles.popularSearchColumn, columnIndex === 1 && styles.popularSearchColumnRight]}
                    >
                      {column.map((item) => {
                        const TrendIcon = TREND_ICONS[item.trend];
                        const trendSize = TREND_SIZES[item.trend];
                        return (
                          <View key={item.rank} style={styles.popularSearchRow}>
                            <Text style={styles.popularSearchRank}>{item.rank}</Text>
                            <Text style={styles.popularSearchKeyword} numberOfLines={1} ellipsizeMode="tail">
                              {item.keyword}
                            </Text>
                            <TrendIcon width={trendSize.width} height={trendSize.height} />
                          </View>
                        );
                      })}
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
