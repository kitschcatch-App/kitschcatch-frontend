/**
 * 화면: 상품 목록 화면 (ProductListScreen)
 * 역할: 상품 검색, 정렬(최신순, 가격순 등) 필터링, 전체 상품 리스트 출력 및 네비게이션을 담당하는 메인 화면 컴포넌트입니다.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const CATEGORIES = ['애니', '게임', '굿즈', '코스프레', '서적', '음반 / 영상', '기타'];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const insets = useSafeAreaInsets();

  useEffect(() => {
    // 화면을 벗어날 때 진행 중인 API 요청을 취소하기 위한 컨트롤러
    const abortController = new AbortController();

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 모듈화된 axios API 호출
        const response = await productAPI.getPostList({
          signal: abortController.signal,
        });
        const data = response.data;
        
        // API 응답 데이터 매핑 (응답이 배열로 오고 그 안의 posts 객체를 순회)
        const mappedProducts: Product[] = data[0].posts.map((post: any) => ({
          id: post.postId.toString(),
          name: post.title,
          price: post.price,
          imageUrl: post.thumbnailUrl,
          heartCount: post.heartCount || 0,
          chatCount: post.chatCount || 0,
          status: post.status,
          category: post.category,
          condition: post.condition,
          createdAt: post.createdAt,
        }));
        
        setProducts(mappedProducts);
      } catch (error: any) {
        if (axios.isCancel(error)) return;
        
        console.error('상품 목록 불러오기 실패:', error);
        
        // [테스트용] 백엔드 미연결 시 가상 데이터로 폴백
        const fallbackData = [
          {
            posts: [
              {
                postId: 105,
                title: "반프레스토 제일복권 귀멸의 칼날 파헤쳐진 대장장이 마을 B상 토키토 무이치로 피규어",
                price: 120000,
                status: "ON_SALE",
                category: "애니",
                condition: "새 상품",
                thumbnailUrl: Image.resolveAssetSource(require('../assets/product_img.png')).uri,
                createdAt: "2026-04-13T16:00:00"
              },
              {
                postId: 104,
                title: "홀로라이브 제일복권 보탄 + 와타메 + 굿즈",
                price: 160000,
                status: "ON_SALE",
                category: "굿즈",
                condition: "사용감 적음",
                thumbnailUrl: "https://picsum.photos/id/102/150/150",
                createdAt: "2026-04-13T15:55:00"
              },
              {
                postId: 103,
                title: "상태 최상 미개봉) 스텔라이브 아카네 리제 봄빛데이트 빵떡 쿠션 굿즈",
                price: 135000,
                status: "ON_SALE",
                category: "굿즈",
                condition: "새 상품",
                thumbnailUrl: "https://picsum.photos/id/103/150/150",
                createdAt: "2026-04-13T15:50:00"
              },
              {
                postId: 102,
                title: "주술회전 유타 D상 아크릴스탠드 개봉",
                price: 11000,
                status: "ON_SALE",
                category: "애니",
                condition: "사용감 있음",
                thumbnailUrl: "https://picsum.photos/id/104/150/150",
                createdAt: "2026-04-13T15:45:00"
              },
              {
                postId: 101,
                title: "에반게리온 초호기 프라모델",
                price: 120000,
                status: "ON_SALE",
                category: "애니",
                condition: "사용감 적음",
                thumbnailUrl: "https://picsum.photos/id/106/150/150",
                createdAt: "2026-04-13T15:40:00"
              }
            ],
            nextCursor: 104,
            hasNext: true
          }
        ];
        
        const mappedProducts: Product[] = fallbackData[0].posts.map((post: any) => ({
          id: post.postId.toString(),
          name: post.title,
          price: post.price,
          imageUrl: post.thumbnailUrl,
          heartCount: post.heartCount || 0,
          chatCount: post.chatCount || 0,
          status: post.status,
          category: post.category,
          condition: post.condition,
          createdAt: post.createdAt,
        }));
        setProducts(mappedProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      abortController.abort();
    };
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행됩니다.

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