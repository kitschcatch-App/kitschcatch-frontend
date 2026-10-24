import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './WishlistScreen.styles';
import StarIcon from '../../assets/star.svg';
import NextIcon from '../../assets/next-b.svg';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import TabBar from '../../components/TabBar';
import { formatTime } from '../../utils/formatTime';
import { productAPI, storeAPI } from '../../api/apiClient';
import { useMockMode } from '../../contexts/MockModeContext';
import { getOpenStatus, type BusinessHour } from '../../utils/storeHours';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

type TabType = 'product' | 'store';

type WishlistProduct = {
  id: number;
  title: string;
  price: number;
  favoritedAt: string;
  thumbnailUrl?: string | null;
};

const PRODUCT_PAGE_SIZE = 20;

// Mock 모드용 (서버 응답 GET /users/me/favorite-posts 와 같은 모양)
const MOCK_WISHLIST_PRODUCTS: WishlistProduct[] = [
  { id: 1, title: '원신 클레 피규어', price: 45000, favoritedAt: '2026-08-20T10:30:00' },
  { id: 2, title: '하이큐 아크릴 스탠드', price: 15000, favoritedAt: '2026-08-21T09:00:00' },
  { id: 3, title: '원신 벤티 열쇠고리', price: 12000, favoritedAt: '2026-08-18T14:20:00' },
  { id: 4, title: '주술회전 고죠 피규어', price: 68000, favoritedAt: '2026-08-15T11:00:00' },
];

type WishlistStore = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string | null;
};

const STORE_PAGE_SIZE = 20;

// Mock 모드용 (서버 응답 GET /users/me/favorite-stores 와 같은 모양)
const MOCK_WISHLIST_STORES: WishlistStore[] = [
  { id: 1, name: 'Play ONE PIECE', address: '서울 마포구 양화로 188 AK&홍대 5층', latitude: 37.5568, longitude: 126.9236 },
  { id: 2, name: '애니메이트 홍대점', address: '서울 마포구 양화로 188 AK&홍대 5층', latitude: 37.5563, longitude: 126.9236 },
  { id: 3, name: '가챠샵', address: '서울 마포구 양화로 188 AK&홍대 5층', latitude: 37.5598, longitude: 126.9425 },
];

// ponytail: 매장 평점 API가 없어 매장 상세/지도 팝업과 같은 임시값 사용. API 붙으면 교체.
const STORE_RATING_PLACEHOLDER = 4.5;

// Mock 모드용 영업시간 (매일 11:00~21:00)
const MOCK_BUSINESS_HOURS: BusinessHour[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
].map(dayOfWeek => ({ dayOfWeek, openTime: '11:00', closeTime: '21:00', closed: false }));

// 관심 매장 한 줄. 목록 API에는 영업시간이 없어 매장 상세 API로 영업 여부를 채운다.
const WishlistStoreItem = ({
  store,
  isMockMode,
  onPressDetail,
}: {
  store: WishlistStore;
  isMockMode: boolean;
  onPressDetail: () => void;
}) => {
  const [hours, setHours] = useState<BusinessHour[] | null>(isMockMode ? MOCK_BUSINESS_HOURS : null);

  useEffect(() => {
    if (isMockMode) return;
    let cancelled = false;
    storeAPI
      .getStore(store.id)
      .then(res => {
        if (!cancelled) setHours(res.data?.data?.businessHours ?? []);
      })
      .catch(e => console.warn('매장 영업시간 조회 실패:', e));
    return () => {
      cancelled = true;
    };
  }, [store.id, isMockMode]);

  const status = hours ? getOpenStatus(hours) : null;

  return (
    <View style={styles.storeItem}>
      <Image
        source={store.thumbnailUrl ? { uri: store.thumbnailUrl } : require('../../assets/product_img.png')}
        style={styles.storeImage}
        resizeMode="cover"
      />
      <View style={styles.storeInfo}>
        <View style={styles.storeNameRow}>
          <Text style={styles.storeName}>{store.name}</Text>
          <View style={styles.storeRatingContainer}>
            <StarIcon width={14} height={14} />
            <Text style={styles.storeRating}>{STORE_RATING_PLACEHOLDER}</Text>
          </View>
        </View>
        <View style={styles.storeStatusRow}>
          {status?.status === 'OPEN' && (
            <>
              <Text style={styles.storeStatusOpen}>영업 중</Text>
              <Text style={styles.storeStatusDivider}>|</Text>
              <Text style={styles.storeStatusClose}>{status.closeTime}에 영업 종료</Text>
            </>
          )}
          {status?.status === 'CLOSED' && <Text style={styles.storeStatusClose}>영업 종료</Text>}
        </View>
        <Text style={styles.storeAddress}>{store.address}</Text>
        <View style={styles.storeDetailRow}>
          <TouchableOpacity style={styles.storeDetailButton} activeOpacity={0.7} onPress={onPressDetail}>
            <Text style={styles.storeDetailButtonText}>상세정보</Text>
            <NextIcon width={5} height={10} style={styles.storeDetailButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const WishlistScreen = ({ navigation }: Props) => {
  const { isMockMode } = useMockMode();
  const [activeTab, setActiveTab] = useState<TabType>('product');
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [productPage, setProductPage] = useState(0);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [stores, setStores] = useState<WishlistStore[]>([]);
  const [storePage, setStorePage] = useState(0);
  const [storeTotalPages, setStoreTotalPages] = useState(1);
  const [isLoadingStores, setIsLoadingStores] = useState(false);

  // 관심 상품 목록: 화면에 들어올 때마다 새로 조회 (상품 상세에서 해제하고 돌아온 경우 반영)
  useFocusEffect(
    useCallback(() => {
      if (isMockMode) {
        setProducts(MOCK_WISHLIST_PRODUCTS);
        return;
      }
      let cancelled = false;
      productAPI
        .getFavoritePosts(0, PRODUCT_PAGE_SIZE)
        .then(res => {
          if (cancelled) return;
          const data = res.data.data;
          setProducts(data.content);
          setProductPage(data.page);
          setProductTotalPages(data.totalPages);
        })
        .catch(e => console.error('관심 상품 조회 실패:', e));
      return () => {
        cancelled = true;
      };
    }, [isMockMode]),
  );

  const handleLoadMoreProducts = async () => {
    if (isMockMode || isLoadingProducts || productPage + 1 >= productTotalPages) return;
    try {
      setIsLoadingProducts(true);
      const res = await productAPI.getFavoritePosts(productPage + 1, PRODUCT_PAGE_SIZE);
      const data = res.data.data;
      setProducts(prev => [...prev, ...data.content]);
      setProductPage(data.page);
      setProductTotalPages(data.totalPages);
    } catch (e) {
      console.error('관심 상품 추가 조회 실패:', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // 관심 매장 목록: 화면에 들어올 때마다 새로 조회 (매장 상세에서 해제하고 돌아온 경우 반영)
  useFocusEffect(
    useCallback(() => {
      if (isMockMode) {
        setStores(MOCK_WISHLIST_STORES);
        return;
      }
      let cancelled = false;
      storeAPI
        .getFavoriteStores(0, STORE_PAGE_SIZE)
        .then(res => {
          if (cancelled) return;
          const data = res.data.data;
          setStores(data.content);
          setStorePage(data.page);
          setStoreTotalPages(data.totalPages);
        })
        .catch(e => console.error('관심 매장 조회 실패:', e));
      return () => {
        cancelled = true;
      };
    }, [isMockMode]),
  );

  const handleLoadMoreStores = async () => {
    if (isMockMode || isLoadingStores || storePage + 1 >= storeTotalPages) return;
    try {
      setIsLoadingStores(true);
      const res = await storeAPI.getFavoriteStores(storePage + 1, STORE_PAGE_SIZE);
      const data = res.data.data;
      setStores(prev => [...prev, ...data.content]);
      setStorePage(data.page);
      setStoreTotalPages(data.totalPages);
    } catch (e) {
      console.error('관심 매장 추가 조회 실패:', e);
    } finally {
      setIsLoadingStores(false);
    }
  };
  const { width: screenWidth } = useWindowDimensions();
  const productImageSize = screenWidth / 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="관심목록" onBack={() => navigation.goBack()} />

      <TabBar
        tabs={[
          { key: 'product', label: '상품' },
          { key: 'store', label: '매장' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'product' ? (
        <FlatList
          key="product-list"
          style={styles.productList}
          contentContainerStyle={styles.productListContent}
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMoreProducts}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productId: String(item.id),
                  productName: item.title,
                  productPrice: item.price,
                  productImageUrl: item.thumbnailUrl ?? '',
                })
              }
            >
              <Image
                source={item.thumbnailUrl ? { uri: item.thumbnailUrl } : require('../../assets/product_img.png')}
                style={[styles.productImage, { width: productImageSize, height: productImageSize }]}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()}원</Text>
                <View style={styles.productMetaContainer}>
                  <Text style={styles.metaTimeText}>{formatTime(item.favoritedAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState
              image={require('../../assets/wish-product.png')}
              title="아직 관심 상품이 없어요!"
              description="마음에 드는 상품을 찜하고 다시 확인해보세요."
            />
          }
        />
      ) : (
        <FlatList
          key="store-list"
          style={styles.storeList}
          contentContainerStyle={styles.storeListContent}
          data={stores}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMoreStores}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <WishlistStoreItem
              store={item}
              isMockMode={isMockMode}
              onPressDetail={() =>
                navigation.navigate('StoreDetail', {
                  storeId: String(item.id),
                  storeName: item.name,
                  latitude: item.latitude,
                  longitude: item.longitude,
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              image={require('../../assets/wish-store.png')}
              title="아직 관심 매장이 없어요!"
              description="마음에 드는 매장을 찜하고 새로운 상품을 확인해보세요."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;
