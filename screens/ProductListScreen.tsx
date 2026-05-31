/**
 * 화면: 상품 목록 화면 (ProductListScreen)
 * 역할: 상품 검색, 정렬(최신순, 가격순 등) 필터링, 전체 상품 리스트 출력 및 네비게이션을 담당하는 메인 화면 컴포넌트입니다.
 */
import React, { useState, useEffect, useMemo } from 'react';
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
import BackIcon from '../assets/back.svg';
import SearchIcon from '../assets/search.svg';
import AddIcon from '../assets/registration.svg';
import BottomNav from '../components/BottomNav';
import FilterIcon from '../assets/filter.svg';
import KitschcatchIcon from '../assets/kitschcatch.svg';
import HeartIcon from '../assets/detail_heart.svg';
import ChatIcon from '../assets/detail_chat.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import axios from 'axios';
import { productAPI } from '../api/apiClient';
import { MOCK_POST_LIST, mockDelay } from '../api/mockData';
import { useMockMode } from '../contexts/MockModeContext';
import FilterBottomSheet, { FilterState } from '../components/FilterBottomSheet';
import { filterProducts, Product } from '../utils/filterProducts';
import ErrorView from '../components/ErrorView';
import { ERROR_MESSAGES, ErrorMessage } from '../constants/errorMessages';
import { STATUS_DISPLAY_MAP } from '../constants/displayMaps';

import { styles } from './ProductListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const ProductListScreen = ({ navigation }: Props) => {
  const { isMockMode, toggleMockMode } = useMockMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 필터 모달 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    sort: '추천순',
    isOnSaleOnly: false,
    minPrice: '',
    maxPrice: '',
    conditions: [],
  });

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

  const insets = useSafeAreaInsets();

  // ─── Mock / Real 공통 상품 목록 로더 ──────────────────────────────────────
  const mapPostToProduct = (post: any): Product => ({
    id: post.id.toString(),
    name: post.title,
    price: post.price,
    imageUrl: post.images?.[0]?.imageUrl || '',
    heartCount: 0,
    chatCount: 0,
    status: post.productStatus,
    category: post.productCategory,
    condition: post.productCondition,
    createdAt: post.createdAt,
  });

  const fetchProducts = async (page: number, signal?: AbortSignal) => {
    try {
      if (page === 0) {
        setLoading(true);
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
        // ── Real 모드: 실제 백엔드 API 호출 ───────────────────────────────
        const response = await productAPI.getPostList({
          signal,
          params: { page, size: 20 },
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
  }, [isMockMode]); // Mock 모드가 바뀌면 자동으로 다시 로드

  const isFilterActive =
    selectedCategories.length > 0 ||
    filterState.conditions.length > 0 ||
    filterState.isOnSaleOnly ||
    filterState.minPrice !== '' ||
    filterState.maxPrice !== '';

  const handleLoadMore = () => {
    if (loadingMore || isLastPage || isFilterActive) return;
    fetchProducts(currentPage + 1);
  };

  const filteredProducts = useMemo(
    () => filterProducts(products, filterState, selectedCategories),
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
      <View>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        {item.status && (
          <View
            style={[
              styles.statusBadge,
              item.status === 'SOLD_OUT' ? styles.statusBadgeSoldOut : styles.statusBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                item.status === 'SOLD_OUT' ? styles.statusBadgeText : undefined,
              ]}
            >
              {STATUS_DISPLAY_MAP[item.status] || item.status}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()}
          원
        </Text>
      <View style={styles.productMetaContainer}>
        <HeartIcon width={8} height={8} style={styles.metaIcon} />
        <Text style={styles.metaText}>12</Text>
        <ChatIcon width={8} height={8} style={styles.metaIcon} />
        <Text style={styles.metaText}>3</Text>
      </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 68) }]} />

        {/* 상단 로고 영역 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={{ marginLeft: -8, marginRight: 2, width: 39, height: 40 }}
            resizeMode="contain"
          />
          <KitschcatchIcon style={{ marginTop: 8 }} />

          {/* Mock 모드 토글 버튼 (개발/테스트용) */}
          <TouchableOpacity
            style={[styles.mockTogglePill, isMockMode && styles.mockTogglePillActive]}
            onPress={toggleMockMode}
            activeOpacity={0.75}
          >
            <Text style={[styles.mockTogglePillText, isMockMode && styles.mockTogglePillTextActive]}>
              {isMockMode ? '🧪 Mock' : '🔌 Real'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. 상단 헤더: 백 버튼 & 검색창 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <BackIcon width={20} height={20} />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              underlineColorAndroid="transparent"
              placeholder="상품을 검색해보세요"
            />
          </View>

          <TouchableOpacity style={styles.searchIcon}>
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

        {/* 2. 필터 버튼 영역 */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(true)}
          >
            <FilterIcon width={20} height={20} />
            <Text style={styles.filterText}>필터</Text>
          </TouchableOpacity>
        </View>


        {/* 3. 상품 목록 영역 */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productListContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#000" style={{ marginVertical: 12 }} /> : null}
          />
        )}
      </View>

      {/* 플로팅 상품등록 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('ProductRegistration')}
      >
        <Text style={styles.floatingButtonText}>상품등록</Text>
        <AddIcon width={22} height={22} />
      </TouchableOpacity>

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