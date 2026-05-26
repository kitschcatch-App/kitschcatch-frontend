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

import { styles } from './ProductListScreen.styles';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  heartCount?: number;
  chatCount?: number;
  status?: string;
  category?: string;
  condition?: string;
  createdAt?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const ProductListScreen = ({ navigation }: Props) => {
  const { isMockMode, toggleMockMode } = useMockMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 필터 모달 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    sort: '추천순',
    isOnSaleOnly: false,
    minPrice: '',
    maxPrice: '',
    conditions: [],
  });

  // 백엔드 productCategory 한글 직렬화 값과 일치시켜야 필터가 정상 동작함
  const CATEGORIES = ['애니/만화', '게임', '굿즈', '코스프레', '서적', '음반/영상', '기타'];

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

  useEffect(() => {
    const abortController = new AbortController();

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isMockMode) {
          // ── Mock 모드: mockData.ts의 가상 데이터 사용 ──────────────────────
          await mockDelay(400 + Math.random() * 300);
          const mockContent = MOCK_POST_LIST.data.data.content;
          setProducts(mockContent.map(mapPostToProduct));
        } else {
          // ── Real 모드: 실제 백엔드 API 호출 ───────────────────────────────
          const response = await productAPI.getPostList({
            signal: abortController.signal,
            params: { page: 0, size: 20 },
          });
          setProducts(response.data.data.content.map(mapPostToProduct));
        }
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        console.error('상품 목록 불러오기 실패:', err);
        setError('상품 목록을 불러오지 못했습니다.\nMock 모드로 전환하거나 서버를 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      abortController.abort();
    };
  }, [isMockMode]); // Mock 모드가 바뀌면 자동으로 다시 로드

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filterState.isOnSaleOnly) {
      result = result.filter((p) => p.status === 'ON_SALE');
    }

    if (selectedCategories.length > 0) {
      result = result.filter(
        (p) => p.category && selectedCategories.includes(p.category)
      );
    }

    const min = filterState.minPrice ? parseInt(filterState.minPrice.replace(/,/g, ''), 10) : null;
    const max = filterState.maxPrice ? parseInt(filterState.maxPrice.replace(/,/g, ''), 10) : null;
    if (min !== null) result = result.filter((p) => p.price >= min);
    if (max !== null) result = result.filter((p) => p.price <= max);

    if (filterState.conditions.length > 0) {
      result = result.filter(
        (p) => !p.condition || filterState.conditions.includes(p.condition)
      );
    }

    switch (filterState.sort) {
      case '최신순':
        result.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        break;
      case '가격 높은 순':
        result.sort((a, b) => b.price - a.price);
        break;
      case '가격 낮은 순':
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    return result;
  }, [products, filterState, selectedCategories]);

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
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
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
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.categoryButtonActive,
                ]}
                onPress={() => toggleCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, selectedCategories.includes(category) && styles.categoryTextActive]}>
                  {category}
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
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{error}</Text>
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

      <BottomNav />
    </SafeAreaView>
  );
};

export default ProductListScreen;