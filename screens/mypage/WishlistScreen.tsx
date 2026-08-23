import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './WishlistScreen.styles';
import HeartIcon from '../../assets/detail_heart.svg';
import ChatIcon from '../../assets/detail_chat.svg';
import StarIcon from '../../assets/star.svg';
import NextIcon from '../../assets/next-b.svg';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import TabBar from '../../components/TabBar';
import { formatTime } from '../../utils/formatTime';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

type TabType = 'product' | 'store';

const MOCK_WISHLIST_PRODUCTS = [
  { id: '1', name: '원신 클레 피규어', price: 45000, createdAt: '2026-08-20T10:30:00', heartCount: 12, chatCount: 3, image: require('../../assets/product_img.png') },
  { id: '2', name: '하이큐 아크릴 스탠드', price: 15000, createdAt: '2026-08-21T09:00:00', heartCount: 8, chatCount: 1, image: require('../../assets/product_img.png') },
  { id: '3', name: '원신 벤티 열쇠고리', price: 12000, createdAt: '2026-08-18T14:20:00', heartCount: 5, chatCount: 0, image: require('../../assets/product_img.png') },
  { id: '4', name: '주술회전 고죠 피규어', price: 68000, createdAt: '2026-08-15T11:00:00', heartCount: 20, chatCount: 6, image: require('../../assets/product_img.png') },
];

const MOCK_WISHLIST_STORES = [
  {
    id: '1',
    name: 'Play ONE PIECE',
    rating: 4.2,
    status: '영업 중',
    closeTime: '21:00에 영업 종료',
    address: '서울 마포구 양화로 188 AK&홍대 5층',
  },
  {
    id: '2',
    name: '애니메이트 홍대점',
    rating: 4.6,
    status: '영업 중',
    closeTime: '20:00에 영업 종료',
    address: '서울 마포구 양화로 188 AK&홍대 5층',
  },
  {
    id: '3',
    name: '가챠샵',
    rating: 3.9,
    status: '영업 중',
    closeTime: '22:00에 영업 종료',
    address: '서울 마포구 양화로 188 AK&홍대 5층',
  },
];

const WishlistScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('product');
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
          data={MOCK_WISHLIST_PRODUCTS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productId: item.id,
                  productName: item.name,
                  productPrice: item.price,
                  productImageUrl: '',
                })
              }
            >
              <Image
                source={item.image}
                style={[styles.productImage, { width: productImageSize, height: productImageSize }]}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()}원</Text>
                <View style={styles.productMetaContainer}>
                  <Text style={styles.metaTimeText}>{formatTime(item.createdAt)}</Text>
                  <View style={styles.metaIconsContainer}>
                    <HeartIcon width={8} height={8} style={styles.metaIcon} />
                    <Text style={styles.metaText}>{item.heartCount}</Text>
                    <ChatIcon width={8} height={8} style={styles.metaIcon} />
                    <Text style={styles.metaText}>{item.chatCount}</Text>
                  </View>
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
          data={MOCK_WISHLIST_STORES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.storeItem}>
              <Image source={require('../../assets/product_img.png')} style={styles.storeImage} resizeMode="cover" />
              <View style={styles.storeInfo}>
                <View style={styles.storeNameRow}>
                  <Text style={styles.storeName}>{item.name}</Text>
                  <View style={styles.storeRatingContainer}>
                    <StarIcon width={14} height={14} />
                    <Text style={styles.storeRating}>{item.rating}</Text>
                  </View>
                </View>
                <View style={styles.storeStatusRow}>
                  <Text style={styles.storeStatusOpen}>{item.status}</Text>
                  <Text style={styles.storeStatusDivider}>|</Text>
                  <Text style={styles.storeStatusClose}>{item.closeTime}</Text>
                </View>
                <Text style={styles.storeAddress}>{item.address}</Text>
                <View style={styles.storeDetailRow}>
                  <TouchableOpacity style={styles.storeDetailButton} activeOpacity={0.7}>
                    <Text style={styles.storeDetailButtonText}>상세정보</Text>
                    <NextIcon width={5} height={10} style={styles.storeDetailButtonIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
