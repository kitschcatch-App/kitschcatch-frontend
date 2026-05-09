/**
 * 화면: 결제 화면 (PaymentScreen)
 * 역할: 선택한 상품에 대한 결제를 진행하는 화면입니다.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ImageBackground, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './PaymentScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const PaymentScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets(); // 상단 안전 영역 크기 가져오기
  const { productName, productImageUrl, productPrice } = route.params;

  // 배송 메모 상태 관리
  const [selectedMemo, setSelectedMemo] = useState('배송시 요청사항 선택');
  const [isMemoModalVisible, setMemoModalVisible] = useState(false);
  const [modalLayout, setModalLayout] = useState<{ top: number; left: number; width: number } | null>(null);
  const memoBtnRef = useRef<View>(null);
  
  // 결제 방법 상태 관리
  const [selectedPayment, setSelectedPayment] = useState('신용카드');

  const shippingFee = 5000; // 예시 배송비
  const totalPrice = productPrice + shippingFee;

  const MEMO_OPTIONS = [
    '요청사항 없음',
    '문 앞에 놓아주세요',
    '배송 전 연락 주세요',
    '부재 시 전화 주세요',
  ];

  const openMemoModal = () => {
    memoBtnRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setModalLayout({ top: pageY + height + 5, left: pageX, width });
      setMemoModalVisible(true);
    });
  };

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

        {/* 상품 정보 영역 */}
        <View style={styles.productInfoContainer}>
          <Image source={{ uri: productImageUrl }} style={styles.productImage} />
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
        </View>

        {/* 본문 영역 */}
        <ImageBackground source={require('../assets/payment.png')} style={styles.contentBackground}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 1. 주문자 정보 컨테이너 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>주문자 정보</Text>
              
              <View style={styles.sectionContentRow}>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoText}>주문자 성함</Text>
                  <Text style={styles.infoText}>010-1234-5678</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. 배송정보 컨테이너 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>배송정보</Text>
              <View style={[styles.sectionContentRow, { alignItems: 'flex-end' }]}>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoText}>배송지</Text>
                  <Text style={styles.addressText}>경기도 화성시 병점구 안녕동 1245678</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>수정</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.addressMemo}>배송 메모</Text>
              <View ref={memoBtnRef} collapsable={false}>
                <TouchableOpacity style={styles.memoDropdownButton} onPress={openMemoModal}>
                  <Text style={styles.memoDropdownText}>{selectedMemo}</Text>
                  <Text style={styles.memoDropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
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
                      <Text style={styles.paymentMethodText}>{method}</Text>
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
                      <Text style={styles.paymentMethodText}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* 4. 최종 결제 금액 컨테이너 */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>최종 결제 금액</Text>

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
                <Text style={styles.totalPaymentLabel}>총 결제 금액</Text>
                <Text style={styles.totalPaymentValue}>{totalPrice.toLocaleString()}원</Text>
              </View>
            </View>

            {/* 5. 결제하기 버튼 */}
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>결제하기</Text>
            </TouchableOpacity>

          </ScrollView>
        </ImageBackground>
        
        {/* 배송 메모 모달 */}
        <Modal transparent visible={isMemoModalVisible} animationType="fade" onRequestClose={() => setMemoModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setMemoModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, modalLayout && { position: 'absolute', top: modalLayout.top-35, left: modalLayout.left+11, width: modalLayout.width-20 }]}>
                  {MEMO_OPTIONS.map((option) => (
                    <TouchableOpacity 
                      key={option} 
                      style={styles.modalOptionButton} 
                      onPress={() => { 
                        setSelectedMemo(option); 
                        setMemoModalVisible(false); 
                      }}
                    >
                      <Text style={[styles.modalOptionText, selectedMemo === option && styles.activeModalOptionText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
