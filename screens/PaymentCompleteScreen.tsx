/**
 * 화면: 결제 완료 화면 (PaymentCompleteScreen)
 * 역할: 결제가 성공적으로 완료된 후 주문 정보를 요약하여 보여주는 화면입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import NextIcon from '../assets/next.svg';
import { styles } from './PaymentCompleteScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentComplete'>;

const DEPOSIT_PAYMENT_METHODS = ['VIRTUAL_ACCOUNT', 'TRANSFER'];

const PaymentCompleteScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { productName, totalPrice, productImageUrl, pgOrderId, paymentMethod } = route.params;
  const isDepositPayment = !!paymentMethod && DEPOSIT_PAYMENT_METHODS.includes(paymentMethod);

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 영역 */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>결제완료</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Image source={require('../assets/paymentcomplete.png')} style={[styles.completeImage, { width: screenWidth * 0.5, height: screenWidth * 0.5 }]} resizeMode="contain" />
            {isDepositPayment ? (
              <>
                <Text style={styles.mainText}>구매가 완료되었습니다</Text>
                <View style={styles.depositInfoContainer}>
                  <Text style={styles.depositDeadlineLabel}>입금기한</Text>
                  <Text style={styles.depositDeadlineDate}>2026.08.07 14:30까지</Text>
                  <Text style={styles.depositNoticeText}>입금기한 내 미입금 시 주문이 자동으로 취소됩니다.</Text>
                  <TouchableOpacity style={styles.depositPolicyRow}>
                    <Text style={styles.depositPolicyText}>입금 정책</Text>
                    <NextIcon width={5} height={8} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.mainText}>결제가 완료되었습니다</Text>
                <Text style={styles.subText}>주문이 정상적으로 접수되었어요</Text>
              </>
            )}
          </View>

          {/* 주문상품 영역 */}
          <View style={styles.orderProductContainer}>
            <Text style={styles.sectionTitle}>주문상품</Text>
            <View style={styles.productRowWrapper}>
              <View style={styles.productRow}>
                <Image source={{ uri: productImageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <View>
                    <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
                    <Text style={styles.productPrice}>{totalPrice.toLocaleString()}원</Text>
                  </View>
                  <Text style={styles.orderNumber}>주문번호 {pgOrderId}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 주문내역보기 버튼 */}
          <TouchableOpacity
            style={styles.historyButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductList')}
          >
            <Text style={styles.historyButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PaymentCompleteScreen;