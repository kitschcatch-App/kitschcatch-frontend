import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ImageSourcePropType, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './SalesHistoryScreen.styles';
import { productAPI, userAPI } from '../../api/apiClient';
import { formatShortDate, mapOrderIdByPost, POST_STATUS_LABEL } from '../../utils/mypage';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import SortBottomSheet, { SortOption } from '../../components/SortBottomSheet';
import ConfirmView from '../../components/ConfirmView';
import SuccessView from '../../components/SuccessView';
import CommonPopup from '../../components/CommonPopup';
import CheckIcon from '../../assets/check-sales.svg';
import DropdownIcon from '../../assets/dropdown.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SalesHistory'>;

const DEFAULT_PRODUCT_IMAGE = require('../../assets/product_img.png');

interface SaleItem {
  id: string;
  orderId?: string; // 주문이 없는 상품(판매 중)은 없음
  title: string;
  price: number;
  status: string;
  date: string;
  createdAt: string;
  image: ImageSourcePropType;
}

const toSaleItem = (post: any, orderIds: Record<string, string>): SaleItem => ({
  id: String(post.id),
  orderId: orderIds[String(post.id)],
  title: post.title,
  price: post.price,
  status: POST_STATUS_LABEL[post.productStatus] ?? post.productStatus,
  date: formatShortDate(post.createdAt),
  createdAt: post.createdAt,
  image: post.images?.[0]?.imageUrl ? { uri: post.images[0].imageUrl } : DEFAULT_PRODUCT_IMAGE,
});

const SalesHistoryScreen = ({ navigation }: Props) => {
  const [salesHistory, setSalesHistory] = useState<SaleItem[]>([]);
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [isSortSheetVisible, setSortSheetVisible] = useState(false);
  const [isMoreSheetVisible, setMoreSheetVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const [isNoOrderVisible, setNoOrderVisible] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadSales = useCallback(() => {
    // ponytail: 최대 100건만 조회. 무한 스크롤은 목록이 길어지면 추가.
    Promise.all([
      userAPI.getMyPosts({ page: 0, size: 100 }),
      userAPI.getSaleOrders({ page: 0, size: 100 }),
    ])
      .then(([posts, orders]) => {
        const orderIds = mapOrderIdByPost(orders.data.data.content);
        setSalesHistory(posts.data.data.content.map((p: any) => toSaleItem(p, orderIds)));
      })
      .catch(e => console.error('판매내역 조회 실패:', e));
  }, []);

  useFocusEffect(loadSales);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await productAPI.deletePost(deleteTargetId);
      setSuccessVisible(true);
      loadSales();
    } catch (e) {
      console.error('게시글 삭제 실패:', e);
      Alert.alert('게시글 삭제', '삭제 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const visibleSalesHistory = (excludeCompleted
    ? salesHistory.filter((item) => item.status !== '판매완료')
    : salesHistory
  )
    .slice()
    .sort((a, b) =>
      sortOption === '최신순' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)
    );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="판매내역" onBack={() => navigation.goBack()} />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          activeOpacity={0.7}
          onPress={() => setExcludeCompleted(!excludeCompleted)}
        >
          {excludeCompleted ? (
            <CheckIcon width={14} height={14} />
          ) : (
            <View style={styles.checkbox} />
          )}
          <Text style={styles.checkboxLabel}>판매완료 내역 제외</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortRow} activeOpacity={0.7} onPress={() => setSortSheetVisible(true)}>
          <Text style={styles.sortLabel}>{sortOption}</Text>
          <DropdownIcon width={10} height={10} style={styles.sortIcon} />
        </TouchableOpacity>
      </View>

      {visibleSalesHistory.length === 0 ? (
        <EmptyState
          image={require('../../assets/sales-details.png')}
          title="아직 판매한 상품이 없어요!"
          description="판매를 시작하고 나만의 거래 내역을 만들어보세요."
        />
      ) : (
        <ScrollView
          style={styles.salesListContainer}
          contentContainerStyle={styles.salesListContent}
          showsVerticalScrollIndicator={false}
        >
          {visibleSalesHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.salesItem}
              activeOpacity={0.7}
              onPress={() => {
                if (!item.orderId) {
                  setNoOrderVisible(true);
                  return;
                }
                navigation.navigate('OrderDetail', {
                  orderId: item.orderId,
                  orderNumber: item.orderId,
                  productTitle: item.title,
                  productPrice: item.price,
                  productImage: item.image,
                });
              }}
            >
              <Image source={item.image} style={styles.salesItemImage} resizeMode="cover" />
              <View style={styles.salesItemInfo}>
                <View style={styles.salesItemTitleRow}>
                  <Text style={styles.salesItemTitle} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => {
                      setDeleteTargetId(item.id);
                      setMoreSheetVisible(true);
                    }}
                  >
                    <View style={styles.moreButtonDot} />
                    <View style={styles.moreButtonDot} />
                    <View style={styles.moreButtonDot} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.salesItemPrice}>{item.price.toLocaleString()}원</Text>
                <View style={styles.salesItemStatusRow}>
                  <Text style={styles.salesItemStatus}>{item.status}</Text>
                  <Text style={styles.salesItemDate}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <SortBottomSheet
        visible={isSortSheetVisible}
        onClose={() => setSortSheetVisible(false)}
        selectedSort={sortOption}
        onSelect={setSortOption}
      />

      <SortBottomSheet
        visible={isMoreSheetVisible}
        onClose={() => setMoreSheetVisible(false)}
        title="삭제"
        titleStyle={styles.deleteSheetTitle}
        onTitlePress={() => {
          setMoreSheetVisible(false);
          setConfirmVisible(true);
        }}
      />

      <ConfirmView
        visible={isConfirmVisible}
        title="게시글을 삭제하시겠습니까?"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          handleDelete();
        }}
      />

      <CommonPopup
        visible={isNoOrderVisible}
        title="이 상품은 아직 들어온 주문이 없어요."
        buttonText="확인"
        onPress={() => setNoOrderVisible(false)}
      />

      <SuccessView
        visible={isSuccessVisible}
        title="게시글이 삭제되었습니다."
        onDismiss={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SalesHistoryScreen;
