import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import ExitIcon from '../assets/exit.svg';
import { styles } from './PaymentCompleteScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentComplete'>;

const PaymentCompleteScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const { productName, productPrice, totalPrice, productImageUrl } = route.params;
  
  // 임시 주문번호 생성 (실제 서버 연동 시 응답값 사용)
  const orderNumber = '12345678';

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 영역 */}
        <View style={styles.headerContainer}>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>결제완료</Text>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate('ProductList')}>
            <ExitIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Image source={require('../assets/paymentcomplete.png')} style={styles.completeImage} resizeMode="contain" />
            <Text style={styles.mainText}>결제가 완료되었습니다</Text>
            <Text style={styles.subText}>주문이 정상적으로 접수되었어요</Text>
          </View>

          <View style={styles.divider} />

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
                  <Text style={styles.orderNumber}>주문번호 {orderNumber}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 주문내역보기 버튼 */}
          <TouchableOpacity style={styles.historyButton} activeOpacity={0.8}>
            <Text style={styles.historyButtonText}>주문내역 보기</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PaymentCompleteScreen;