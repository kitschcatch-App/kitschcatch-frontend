import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './PurchaseHistoryScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import SortBottomSheet, { SortOption } from '../../components/SortBottomSheet';
import ConfirmView from '../../components/ConfirmView';
import SuccessView from '../../components/SuccessView';
import CheckIcon from '../../assets/check-sales.svg';
import DropdownIcon from '../../assets/dropdown.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseHistory'>;

type PurchaseStatus = '거래중' | '구매완료';

const PURCHASE_HISTORY = [
  { id: '1', title: '원신 클레 피규어', price: 45000, status: '거래중' as PurchaseStatus, date: '26.08.22', image: require('../../assets/product_img.png') },
  { id: '2', title: '하이큐 아크릴 스탠드', price: 15000, status: '구매완료' as PurchaseStatus, date: '26.08.15', image: require('../../assets/product_img.png') },
  { id: '3', title: '원신 벤티 열쇠고리', price: 12000, status: '구매완료' as PurchaseStatus, date: '26.08.10', image: require('../../assets/product_img.png') },
];

const PurchaseHistoryScreen = ({ navigation }: Props) => {
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [isSortSheetVisible, setSortSheetVisible] = useState(false);
  const [isMoreSheetVisible, setMoreSheetVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);

  const visiblePurchaseHistory = (excludeCompleted
    ? PURCHASE_HISTORY.filter((item) => item.status !== '구매완료')
    : PURCHASE_HISTORY
  )
    .slice()
    .sort((a, b) =>
      sortOption === '최신순' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
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
            const isConfirmed = confirmedIds.includes(item.id);
            return (
              <View key={item.id} style={styles.purchaseItem}>
                <TouchableOpacity
                  style={styles.purchaseItemRow}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('PurchaseOrderDetail', {
                    orderId: item.id,
                    orderNumber: '12345678',
                    productTitle: item.title,
                    productPrice: item.price,
                    productImage: item.image,
                  })}
                >
                  <Image source={item.image} style={styles.purchaseItemImage} resizeMode="cover" />
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

                {item.status === '구매완료' && (
                  <TouchableOpacity
                    style={[styles.confirmButton, isConfirmed && styles.confirmButtonDone]}
                    activeOpacity={0.7}
                    disabled={isConfirmed}
                    onPress={() => setConfirmedIds((prev) => [...prev, item.id])}
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
        visible={isSuccessVisible}
        title="게시글이 삭제되었습니다."
        onDismiss={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PurchaseHistoryScreen;
