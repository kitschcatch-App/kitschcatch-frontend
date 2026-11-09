/**
 * 화면: 다른 사용자 판매상품 (UserProductsScreen)
 * 역할: 다른 사용자 프로필의 판매상품 더보기를 눌렀을 때 해당 회원의 판매 중 상품을 2열 목록으로 보여줍니다.
 * 상품 카드 스타일은 ProductListScreen과 동일하게 맞춰 그 스타일을 재사용합니다.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from '../product/ProductListScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import HeartIcon from '../../assets/detail_heart.svg';
import ChatIcon from '../../assets/detail_chat.svg';
import { userAPI } from '../../api/apiClient';
import { formatTime } from '../../utils/formatTime';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProducts'>;

interface UserProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  createdAt?: string;
}

const PAGE_SIZE = 20;

const UserProductsScreen = ({ route, navigation }: Props) => {
  const { userId, nickname } = route.params;
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchPage = useCallback(
    async (target: number) => {
      try {
        const res = await userAPI.getUserPosts(userId, { status: 'ON_SALE', page: target, size: PAGE_SIZE });
        const data = res.data.data;
        const items: UserProduct[] = data.content.map((p: any) => ({
          id: String(p.id),
          name: p.title,
          price: p.price,
          imageUrl: p.images?.[0]?.imageUrl ?? '',
          createdAt: p.createdAt,
        }));
        setProducts(prev => (target === 0 ? items : [...prev, ...items]));
        // 이 API 응답엔 last 필드가 없어 totalPages로 마지막 페이지를 판단
        setIsLastPage(target + 1 >= data.totalPages);
        setPage(target);
      } catch (e) {
        console.error('다른 사용자 판매상품 조회 실패:', e);
        setIsLastPage(true); // 실패 시 onEndReached가 재요청을 반복하지 않도록 중단
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  const refreshControl = useRefreshControl(() => fetchPage(0));

  const handleLoadMore = () => {
    if (loadingMore || isLastPage) return;
    setLoadingMore(true);
    fetchPage(page + 1);
  };

  const renderItem = ({ item }: { item: UserProduct }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.push('ProductDetail', {
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          productImageUrl: item.imageUrl,
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()}원</Text>
        <View style={styles.productMetaContainer}>
          <Text style={styles.metaTimeText}>{formatTime(item.createdAt ?? '')}</Text>
          <View style={styles.metaIconsContainer}>
            {/* ponytail: 찜/채팅 수 API 연동 전 ProductListScreen과 같은 mock 값 */}
            <HeartIcon width={8} height={8} style={styles.metaIcon} />
            <Text style={styles.metaText}>12</Text>
            <ChatIcon width={8} height={8} style={styles.metaIcon} />
            <Text style={styles.metaText}>3</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title={`${nickname}의 판매상품`} onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            style={styles.productList}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productListContent}
            refreshControl={refreshControl}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={<EmptyState title="판매 중인 상품이 없어요!" />}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color="#000" style={{ marginVertical: 12 }} /> : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProductsScreen;
