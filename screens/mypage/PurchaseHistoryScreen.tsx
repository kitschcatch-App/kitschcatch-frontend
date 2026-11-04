import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PurchaseHistoryScreen.styles';
import { orderAPI, userAPI } from '../../api/apiClient';
import { formatShortDate, ORDER_STATUS_LABEL } from '../../utils/mypage';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import SortBottomSheet, { SortOption } from '../../components/SortBottomSheet';
import ConfirmView from '../../components/ConfirmView';
import RatingPopup from '../../components/RatingPopup';
import SuccessView from '../../components/SuccessView';
import CheckIcon from '../../assets/check-sales.svg';
import DropdownIcon from '../../assets/dropdown.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseHistory'>;

const DEFAULT_PRODUCT_IMAGE = require('../../assets/product_img.png');

interface PurchaseItem {
  id: string;
  title: string;
  price: number;
  orderStatus: string;
  status: string;
  date: string;
  orderedAt: string;
}

const toPurchaseItem = (order: any): PurchaseItem => ({
  id: order.orderId,
  title: order.postTitle,
  price: order.amount,
  orderStatus: order.orderStatus,
  status: ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus,
  date: formatShortDate(order.orderedAt),
  orderedAt: order.orderedAt,
});

const PurchaseHistoryScreen = ({ navigation }: Props) => {
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [isSortSheetVisible, setSortSheetVisible] = useState(false);
  const [isMoreSheetVisible, setMoreSheetVisible] = useState(false);
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const [isPurchaseSuccessVisible, setPurchaseSuccessVisible] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseItem[]>([]);

  const loadPurchases = useCallback(() => {
    // ponytail: 최대 100건만 조회. 무한 스크롤은 목록이 길어지면 추가.
    userAPI
      .getPurchaseOrders({ page: 0, size: 100 })
      .then(res => setPurchaseHistory(res.data.data.content.map(toPurchaseItem)))
      .catch(e => console.error('구매내역 조회 실패:', e));
  }, []);

  useFocusEffect(loadPurchases);

  const handleConfirmPurchase = async (orderId: string) => {
    try {
      await orderAPI.confirmPurchase(orderId);
      loadPurchases();
      setPurchaseSuccessVisible(true);
    } catch (err: any) {
      // ORDER_005: 발송 전이거나 환불 요청 중
      Alert.alert('구매확정', err.response?.data?.error?.code === 'ORDER_005'
        ? '발송 전이거나 환불 진행 중인 주문은 구매확정할 수 없어요.'
        : '구매확정 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  const visiblePurchaseHistory = (excludeCompleted
    ? purchaseHistory.filter((item) => item.orderStatus !== 'PURCHASE_CONFIRMED')
    : purchaseHistory
  )
    .slice()
    .sort((a, b) =>
      sortOption === '최신순' ? b.orderedAt.localeCompare(a.orderedAt) : a.orderedAt.localeCompare(b.orderedAt)
    );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="구매내역" onBack={() => navigation.goBack()} />

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
          <Text style={styles.checkboxLabel}>구매완료 내역 제외</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortRow} activeOpacity={0.7} onPress={() => setSortSheetVisible(true)}>
          <Text style={styles.sortLabel}>{sortOption}</Text>
          <DropdownIcon width={10} height={10} style={styles.sortIcon} />
        </TouchableOpacity>
      </View>

      {visiblePurchaseHistory.length === 0 ? (
        <EmptyState
          image={require('../../assets/purchase-details.png')}
          title="아직 구매한 상품이 없어요!"
          description="관심 있는 상품을 찾아 첫 거래를 시작해보세요."
        />
      ) : (
        <ScrollView
          style={styles.purchaseListContainer}
          contentContainerStyle={styles.purchaseListContent}
          showsVerticalScrollIndicator={false}
        >
          {visiblePurchaseHistory.map((item) => {
            const isConfirmed = item.orderStatus === 'PURCHASE_CONFIRMED';
            return (
              <View key={item.id} style={styles.purchaseItem}>
                <TouchableOpacity
                  style={styles.purchaseItemRow}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('PurchaseOrderDetail', {
                    orderId: item.id,
                    orderNumber: item.id,
                    productTitle: item.title,
                    productPrice: item.price,
                    productImage: DEFAULT_PRODUCT_IMAGE,
                  })}
                >
                  <Image source={DEFAULT_PRODUCT_IMAGE} style={styles.purchaseItemImage} resizeMode="cover" />
                  <View style={styles.purchaseItemInfo}>
                    <View style={styles.purchaseItemTitleRow}>
                      <Text style={styles.purchaseItemTitle} numberOfLines={1}>{item.title}</Text>
                      <TouchableOpacity
                        style={styles.moreButton}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        onPress={() => setMoreSheetVisible(true)}
                      >
                        <View style={styles.moreButtonDot} />
                        <View style={styles.moreButtonDot} />
                        <View style={styles.moreButtonDot} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.purchaseItemPrice}>{item.price.toLocaleString()}원</Text>
                    <View style={styles.purchaseItemStatusRow}>
                      <Text style={styles.purchaseItemStatus}>{item.status}</Text>
                      <Text style={styles.purchaseItemDate}>{item.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {(item.orderStatus === 'PAID' || item.orderStatus === 'PURCHASE_CONFIRMED') && (
                  <TouchableOpacity
                    style={[styles.confirmButton, isConfirmed && styles.confirmButtonDone]}
                    activeOpacity={0.7}
                    disabled={isConfirmed}
                    onPress={() => setRatingOrderId(item.id)}
                  >
                    <Text style={[styles.confirmButtonText, isConfirmed && styles.confirmButtonTextDone]}>
                      {isConfirmed ? '구매 확정 완료' : '구매확정'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
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

      {/* ponytail: 별점 저장 API 미정이라 선택값은 전송하지 않고 구매확정만 처리 */}
      <RatingPopup
        visible={ratingOrderId !== null}
        onConfirm={() => {
          if (ratingOrderId) handleConfirmPurchase(ratingOrderId);
          setRatingOrderId(null);
        }}
      />

      <ConfirmView
        visible={isConfirmVisible}
        title="게시글을 삭제하시겠습니까?"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          setSuccessVisible(true);
        }}
      />

      <SuccessView
        visible={isPurchaseSuccessVisible}
        title="구매확정이 완료되었습니다."
        onDismiss={() => setPurchaseSuccessVisible(false)}
      />

      <SuccessView
        visible={isSuccessVisible}
        title="게시글이 삭제되었습니다."
        onDismiss={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PurchaseHistoryScreen;
