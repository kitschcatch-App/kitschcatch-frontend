/**
 * 화면: 결제 화면 (PaymentScreen)
 * 역할: 선택한 상품에 대한 결제를 진행하는 화면입니다.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './PaymentScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../styles/colors';
import AddressBottomSheet from '../components/AddressBottomSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const PaymentScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets(); // 상단 안전 영역 크기 가져오기
  const { productName, productImageUrl, productPrice } = route.params;

  // 배송 메모 상태 관리
  const [selectedMemo, setSelectedMemo] = useState('배송시 요청사항 선택');
  const [isMemoExpanded, setIsMemoExpanded] = useState(false);
  
  // 결제 방법 상태 관리
  const [selectedPayment, setSelectedPayment] = useState('신용카드');
  
  // 배송지 변경 바텀 시트 상태 관리
  const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);

  const shippingFee = 5000; // 예시 배송비
  const totalPrice = productPrice + shippingFee;

  const MEMO_OPTIONS = [
    '요청사항 없음',
    '문 앞에 놓아주세요',
    '배송 전 연락 주세요',
    '부재 시 전화 주세요',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 영역 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>결제</Text>
          </View>
        </View>

        {/* 본문 영역 */}
        <View style={[styles.contentBackground, { backgroundColor: colors.main03 }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 1. 상품 정보 컨테이너 */}
            <View style={styles.productInfoContainer}>
              <Text style={styles.sectionTitle}>주문상품</Text>
              <View style={styles.productInfoRow}>
                <Image source={{ uri: productImageUrl }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
                  <Text style={styles.productPrice}>{productPrice.toLocaleString()}원</Text>
                </View>
              </View>
            </View>

            {/* 2. 배송정보 컨테이너 */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>배송지</Text>
                <TouchableOpacity onPress={() => setIsAddressSheetVisible(true)}>
                  <Text style={styles.changeAddressText}>배송지 변경</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.sectionContentRow, { alignItems: 'flex-end' }]}>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoName}>이수진</Text>
                  <Text style={styles.infoTel}>010-1234-5678</Text>
                  <Text style={styles.addressText}>경기도 화성시 병점구 안녕동</Text>
                  <Text style={styles.addressText}>1245678845612</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.memoDropdownButton, isMemoExpanded && { marginBottom: 5 }]} 
                onPress={() => setIsMemoExpanded(!isMemoExpanded)}
              >
                <Text style={styles.memoDropdownText}>{selectedMemo}</Text>
                <Text style={styles.memoDropdownIcon}>{isMemoExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              
              {isMemoExpanded && (
                <View style={styles.memoDropdownList}>
                  {MEMO_OPTIONS.map((option) => (
                    <TouchableOpacity 
                      key={option} 
                      style={styles.memoDropdownOption} 
                      onPress={() => { 
                        setSelectedMemo(option); 
                        setIsMemoExpanded(false); 
                      }}
                    >
                      <Text style={[styles.memoDropdownOptionText, selectedMemo === option && styles.activeMemoOptionText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 3. 결제 방법 컨테이너 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>결제 방법</Text>
              
              <View style={styles.paymentMethodContainer}>
                {/* 위 레이아웃 */}
                <View style={styles.paymentMethodRowTop}>
                  {['신용카드', '가상계좌', '간편결제'].map((method) => (
                    <TouchableOpacity 
                      key={method} 
                      style={[styles.paymentMethodButton, selectedPayment === method && styles.paymentMethodButtonActive]}
                      onPress={() => setSelectedPayment(method)}
                    >
                      <Text style={[styles.paymentMethodText, selectedPayment === method && styles.paymentMethodTextActive]}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* 아래 레이아웃 */}
                <View style={styles.paymentMethodRowBottom}>
                  {['핸드폰결제', '무통장입금'].map((method) => (
                    <TouchableOpacity 
                      key={method} 
                      style={[styles.paymentMethodButton, selectedPayment === method && styles.paymentMethodButtonActive]}
                      onPress={() => setSelectedPayment(method)}
                    >
                      <Text style={[styles.paymentMethodText, selectedPayment === method && styles.paymentMethodTextActive]}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* 4. 최종 결제 금액 컨테이너 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>최종결제금액</Text>

              <View style={styles.paymentDetailsContainer}>
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>상품 금액</Text>
                  <Text style={styles.paymentDetailValue}>{productPrice.toLocaleString()}원</Text>
                </View>
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>배송비</Text>
                  <Text style={styles.paymentDetailValue}>{shippingFee.toLocaleString()}원</Text>
                </View>
              </View>

              <View style={styles.paymentDivider} />

              <View style={styles.paymentTotalRow}>
                <Text style={styles.totalPaymentLabel}>총 결제금액</Text>
                <Text style={styles.totalPaymentLabel}>{totalPrice.toLocaleString()}원</Text>
              </View>
            </View>

            {/* 5. 결제하기 버튼 */}
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>결제하기</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

        {/* 배송지 변경 바텀 시트 */}
        <AddressBottomSheet 
          visible={isAddressSheetVisible} 
          onClose={() => setIsAddressSheetVisible(false)} 
        />

      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
