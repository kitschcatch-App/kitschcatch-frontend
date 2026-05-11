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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import SearchIcon from '../assets/search.svg';
import AddIcon from '../assets/registration.svg';
import BottomNav from '../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

import { styles } from './ProductListScreen.styles';

// 테스트용 임시 상품 데이터
// 나중에 API 서비스 파일(예: src/services/productApi.ts)로 분리.
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const MOCK_PRODUCTS = [
  { id: '1', name: '귀멸의 칼날 탄지로 넨도로이드 풀박스 상태 S급', price: 35000, imageUrl: 'https://example.com/image1.jpg' },
  { id: '2', name: '주술회전 룩업 옷코츠 유타', price: 80000, imageUrl: 'https://example.com/image2.jpg' },
  { id: '3', name: '장송의 프리렌 포스터', price: 15000, imageUrl: 'https://example.com/image3.jpg' },
  { id: '4', name: '하이큐 아크릴 스탠드', price: 25000, imageUrl: 'https://example.com/image4.jpg' },
  { id: '5', name: '나의 히어로 아카데미아 바쿠고 카츠키 피규어 ', price: 100000, imageUrl: 'https://example.com/image5.jpg' },
  { id: '6', name: '에반게리온 룩업 이카리 신지', price: 40000, imageUrl: 'https://example.com/image6.jpg' },
];

// 실제 API 호출을 시뮬레이션하는 함수입니다.
// TODO: 백엔드 연결 시 이 부분을 실제 API 호출 로직(fetch, axios 등)으로 교체하세요.
const fetchProductsAPI = (): Promise<Product[]> => {
  console.log('Fetching products...');
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Products fetched!');
      resolve(MOCK_PRODUCTS);
    }, 1000); // 네트워크 지연을 시뮬레이션하기 위해 1초 딜레이
  });
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const ProductListScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 드롭다운 상태 관리
  const [sortType, setSortType] = useState('최신순');
  const [priceSort, setPriceSort] = useState('가격 낮은 순');

  // --- 모달 상태 관리 ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<{
    options: string[];
    currentValue: string;
    onSelect: (value: string) => void;
    layout?: { top: number; left: number; width: number; height: number };
  } | null>(null);

  const sortBtnRef = useRef<View>(null);
  const priceBtnRef = useRef<View>(null);
  const insets = useSafeAreaInsets();

  const openModal = (
    ref: React.RefObject<any>,
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void,
    modalHeight: number
  ) => {
    ref.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setModalData({
        options,
        currentValue,
        onSelect,
        layout: { top: pageY + height - 19, left: pageX, width, height: modalHeight },
      });
      setModalVisible(true);
    });
  };

  const handleSelectOption = (option: string) => {
    if (modalData) {
      modalData.onSelect(option);
    }
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalData(null);
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // API를 통해 상품 목록을 가져옵니다.
        const fetchedProducts = await fetchProductsAPI();
        setProducts(fetchedProducts);
      } catch (e) {
        console.error(e);
        setError('상품을 불러오는 데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행됩니다.

  // 가격 정렬 상태에 따라 상품 목록을 정렬합니다.
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (priceSort === '가격 낮은 순') {
      sorted.sort((a, b) => a.price - b.price); // 오름차순 (낮은 가격순)
    } else if (priceSort === '가격 높은 순') {
      sorted.sort((a, b) => b.price - a.price); // 내림차순 (높은 가격순)
    }
    return sorted;
  }, [products, priceSort]);

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
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()}
          원
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSortModal = () => (
    <Modal
      transparent={true}
      visible={isModalVisible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View 
              style={[
                styles.modalContent,
                modalData?.layout && {
                  position: 'absolute',
                  top: modalData.layout.top,
                  left: modalData.layout.left,
                  width: modalData.layout.width,
                  height: modalData.layout.height,
                }
              ]}
            >
              {modalData?.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOptionButton}
                  onPress={() => handleSelectOption(option)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      modalData?.currentValue === option &&
                        styles.activeModalOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 68) }]} />

        {/* 1. 상단 헤더: 백 버튼 & 검색창 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity style={styles.searchIcon}>
            <SearchIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* 2. 필터 드롭다운 영역 */}
        <View style={styles.filterContainer}>
          <View ref={sortBtnRef}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => openModal(sortBtnRef, ['최신순', '추천순'], sortType, setSortType, 70)}
            >
              <Text style={styles.dropdownText}>{sortType} ▼</Text>
            </TouchableOpacity>
          </View>
          
          <View ref={priceBtnRef}>
            <TouchableOpacity 
              style={[styles.dropdownButton, styles.dropdownButtonWide]}
              onPress={() => openModal(priceBtnRef, ['가격 낮은 순', '가격 높은 순'], priceSort, setPriceSort, 70)}
            >
              <Text style={styles.dropdownText}>{priceSort} ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 회색 가로 구분선 */}
        <View style={styles.divider} />

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
            data={sortedProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
        
          />
        )}
        
        {/* 모달 렌더링 */}
        {renderSortModal()}
      </View>

      {/* 플로팅 상품등록 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('ProductRegistration')}
      >
        <Text style={styles.floatingButtonText}>상품등록</Text>
        <AddIcon width={22} height={22} />
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
};

export default ProductListScreen;