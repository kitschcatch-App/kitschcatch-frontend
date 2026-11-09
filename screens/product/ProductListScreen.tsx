/**
 * 화면: 상품 목록 화면 (ProductListScreen)
 * 역할: 상품 검색, 정렬(최신순, 가격순 등) 필터링, 전체 상품 리스트 출력 및 네비게이션을 담당하는 메인 화면 컴포넌트입니다.
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../../assets/back.svg';
import SearchIcon from '../../assets/search.svg';
import FloatingAddButton from '../../components/FloatingAddButton';
import BottomNav from '../../components/BottomNav';
import ScreenHeader from '../../components/ScreenHeader';
import FilterIcon from '../../assets/filter.svg';
import KitschcatchIcon from '../../assets/kitschcatch.svg';
import ResetIcon from '../../assets/reset.svg';
import HeartIcon from '../../assets/detail_heart.svg';
import ChatIcon from '../../assets/detail_chat.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import axios from 'axios';
import { productAPI } from '../../api/apiClient';
import { MOCK_POST_LIST, mockDelay } from '../../api/mockData';
import { useMockMode } from '../../contexts/MockModeContext';
import FilterBottomSheet, { FilterState } from '../../components/FilterBottomSheet';
import { Product } from '../../utils/filterProducts';
import { buildPostParams, filterMultiSelect } from '../../utils/buildPostParams';
import ErrorView from '../../components/ErrorView';
import { ERROR_MESSAGES, ErrorMessage } from '../../constants/errorMessages';
import { CATEGORY_REVERSE_MAP } from '../../constants/displayMaps';
import { formatTime } from '../../utils/formatTime';
import { countActiveFilters } from '../../utils/countActiveFilters';

import { styles } from './ProductListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const ProductListScreen = ({ navigation, route }: Props) => {
  const { isMockMode } = useMockMode();
  const [searchQuery, setSearchQuery] = useState(route.params?.keyword ?? ''); // 입력 중인 검색어
  const [keyword, setKeyword] = useState(route.params?.keyword ?? ''); // 서버에 보내는 확정 검색어
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fabCollapsed, setFabCollapsed] = useState(false); // 스크롤하면 상품 등록 버튼 축소
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 필터 모달 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    route.params?.category ? [route.params.category] : [],
  );
  const [filterState, setFilterState] = useState<FilterState>({
    sort: '추천순',
    isOnSaleOnly: false,
    minPrice: '',
    maxPrice: '',
    conditions: [],
  });

  const activeFilterCount = countActiveFilters(filterState);

  const CATEGORIES = [
    { label: '애니/만화', value: 'ANIME_MANGA' },
    { label: '게임',      value: 'GAME' },
    { label: '굿즈',      value: 'GOODS' },
    { label: '코스프레',   value: 'COSPLAY' },
    { label: '서적',      value: 'BOOK' },
    { label: '음반/영상',  value: 'MUSIC_VIDEO' },
    { label: '기타',      value: 'ETC' },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 홈 카테고리별 보기로 진입했으면 해당 카테고리명 (일반 목록 진입 시 undefined)
  const categoryLabel = CATEGORIES.find(c => c.value === route.params?.category)?.label;

  const insets = useSafeAreaInsets();
  const isInitialFocus = useRef(false);
  const listRef = useRef<FlatList<Product>>(null);

  // fetchProducts가 포커스 리스너 등 오래된 클로저에서 불려도 최신 검색 조건을 쓰도록 ref로 보관
  const queryRef = useRef({ keyword, selectedCategories, filterState });
  queryRef.current = { keyword, selectedCategories, filterState };
  const queryKey = JSON.stringify([keyword, selectedCategories, filterState]);

  const submitSearch = () => setKeyword(searchQuery.trim());

  // 검색 화면에서 keyword를 넘겨 진입한 경우 반영
  useEffect(() => {
    const k = route.params?.keyword ?? '';
    setSearchQuery(k);
    setKeyword(k);
  }, [route.params?.keyword]);

  // 홈의 카테고리별 보기에서 category를 넘겨 진입한 경우 해당 카테고리만 선택
  useEffect(() => {
    const c = route.params?.category;
    if (c) setSelectedCategories([c]);
  }, [route.params?.category]);

  // ─── Mock / Real 공통 상품 목록 로더 ──────────────────────────────────────
  const mapPostToProduct = (post: any): Product => ({
    id: post.id.toString(),
    name: post.title,
    price: post.price,
    imageUrl: post.images?.[0]?.imageUrl || '',
    heartCount: post.favoriteCount ?? 0,
    chatCount: post.chatRoomCount ?? 0,
    status: post.productStatus,
    category: CATEGORY_REVERSE_MAP[post.productCategory] || post.productCategory,
    condition: post.productCondition,
    createdAt: post.createdAt,
  });

  // silent: 당겨서 새로고침 중에는 전체 스피너로 목록을 바꾸지 않는다.
  const fetchProducts = async (page: number, signal?: AbortSignal, silent = false) => {
    try {
      if (page === 0) {
        if (!silent) setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      if (isMockMode) {
        // ── Mock 모드: mockData.ts의 가상 데이터 사용 (첫 페이지만) ──────────
        await mockDelay(400 + Math.random() * 300);
        const mockData = MOCK_POST_LIST.data.data;
        setProducts(mockData.content.map(mapPostToProduct));
        setIsLastPage(true);
        setCurrentPage(0);
      } else {
        // ── Real 모드: 실제 백엔드 API 호출 (검색/필터/정렬은 서버에서 처리) ──
        const q = queryRef.current;
        const response = await productAPI.getPostList({
          signal,
          params: buildPostParams(q.keyword, q.selectedCategories, q.filterState, page),
        });
        const pageData = response.data.data;
        const newItems = pageData.content.map(mapPostToProduct);

        if (page === 0) {
          setProducts(newItems);
        } else {
          setProducts(prev => [...prev, ...newItems]);
        }

        setIsLastPage(pageData.last);
        setCurrentPage(page);
      }
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      if (err.response?.status === 401) {
        navigation.navigate('Login');
        return;
      }
      console.error('상품 목록 불러오기 실패:', err);
      if (page === 0) {
        const isNetworkError = !err.response;
        setError(isNetworkError ? ERROR_MESSAGES.SYSTEM.NETWORK : ERROR_MESSAGES.SYSTEM.TEMPORARY);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    setIsLastPage(false);
    setCurrentPage(0);
    fetchProducts(0, abortController.signal);
    return () => abortController.abort();
    // fetchProducts는 queryRef로 최신 조건을 읽으므로 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMockMode, queryKey]); // Mock 모드·검색 조건이 바뀌면 자동으로 다시 로드

  // ProductDetail에서 판매상태 수정 후 돌아올 때 목록 새로고침
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isInitialFocus.current) {
        isInitialFocus.current = true;
        return;
      }
      setIsLastPage(false);
      setCurrentPage(0);
      fetchProducts(0);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isMockMode]);

  const refreshControl = useRefreshControl(() => {
    setIsLastPage(false);
    setCurrentPage(0);
    return fetchProducts(0, undefined, true);
  });

  const handleLoadMore = () => {
    if (loadingMore || isLastPage) return;
    fetchProducts(currentPage + 1);
  };

  const filteredProducts = useMemo(
    () => filterMultiSelect(products, selectedCategories, filterState),
    [products, filterState, selectedCategories],
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { 
        productId: item.id,
        productName: item.name,
        productPrice: item.price,
        productImageUrl: item.imageUrl
      })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} onError={e => console.log('[IMG-DEBUG] 상품 로드 실패', item.imageUrl, e.nativeEvent.error)} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()}
          원
        </Text>
      <View style={styles.productMetaContainer}>
        <Text style={styles.metaTimeText}>{formatTime(item.createdAt ?? '')}</Text>
        <View style={styles.metaIconsContainer}>
          <HeartIcon width={8} height={8} style={styles.metaIcon} />
          <Text style={styles.metaText}>{item.heartCount ?? 0}</Text>
          <ChatIcon width={8} height={8} style={styles.metaIcon} />
          <Text style={styles.metaText}>{item.chatCount ?? 0}</Text>
        </View>
      </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: categoryLabel ? insets.top : Math.max(insets.top, 68) }]} />

        {/* 홈 카테고리별 보기로 진입한 경우: 카테고리명 헤더만 노출 */}
        {categoryLabel && (
          <ScreenHeader title={categoryLabel} onBack={() => navigation.goBack()} />
        )}

        {/* 상단 로고 영역 */}
        {!categoryLabel && (<>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ marginLeft: -8, marginRight: 2, width: 39, height: 40 }}
            resizeMode="contain"
          />
          <KitschcatchIcon width={67} height={23} style={{ marginTop: 8 }} />
        </View>

        {/* 1. 상단 헤더: 백 버튼 & 검색창 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
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
          </View>

          <TouchableOpacity style={styles.searchIcon} onPress={submitSearch}>
            <SearchIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 1-1. 카테고리 선택 영역 (가로 스크롤) */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {selectedCategories.length > 0 && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setSelectedCategories([])}
                activeOpacity={0.7}
              >
                <ResetIcon width={14} height={14} />
                <Text style={styles.resetButtonText}>초기화</Text>
              </TouchableOpacity>
            )}
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category.value) && styles.categoryButtonActive,
                ]}
                onPress={() => toggleCategory(category.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, selectedCategories.includes(category.value) && styles.categoryTextActive]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </>)}

        {/* 2. 필터 버튼 영역 */}
        <View style={[styles.filterContainer, categoryLabel && styles.filterContainerRight]}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(true)}
          >
            <FilterIcon width={20} height={20} />
            <Text style={styles.filterText}>필터</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>


        {/* 3. 상품 목록 영역 */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            style={styles.productList}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productListContent}
            onScroll={e => setFabCollapsed(e.nativeEvent.contentOffset.y > 10)}
            scrollEventThrottle={16}
            refreshControl={refreshControl}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={<Text style={styles.emptyText}>아직 등록된 상품이 없습니다.</Text>}
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#000" style={{ marginVertical: 12 }} /> : null}
          />
        )}
      </View>

      {/* 플로팅 상품등록 버튼 */}
      <FloatingAddButton
        collapsed={fabCollapsed}
        bottom={Math.max(insets.bottom, 14) + 85}
        onPress={() => navigation.navigate('ProductRegistration')}
        onPressTop={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
      />

      {/* 필터 바텀 시트 컴포넌트 */}
      <FilterBottomSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        filterState={filterState}
        onApply={(filters) => setFilterState(filters)}
      />

      <ErrorView
        visible={!!error}
        title={error?.title ?? ''}
        subtitle={error?.subtitle ?? ''}
        buttonText="확인"
        onPress={() => {
          setError(null);
          fetchProducts(0);
        }}
      />

      <BottomNav />
    </SafeAreaView>
  );
};

export default ProductListScreen;