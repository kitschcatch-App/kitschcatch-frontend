import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './PaymentScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../styles/colors';
import AddressBottomSheet, { SelectedAddress } from '../components/AddressBottomSheet';
import { useMockMode } from '../contexts/MockModeContext';
import { orderAPI, paymentAPI } from '../api/apiClient';
import { getMockCreateOrder, getMockCreatePayment, mockDelay } from '../api/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

// UI 표시 라벨, 백엔드 enum, 토스 SDK에 넘길 결제수단명을 매핑
interface PaymentMethod {
  label: string;
  backendEnum: string;
  tossMethod: string;
  disabled?: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { label: '신용카드', backendEnum: 'CARD', tossMethod: '카드' },
  { label: '가상계좌', backendEnum: 'VIRTUAL_ACCOUNT', tossMethod: '가상계좌', disabled: true },
  { label: '간편결제', backendEnum: 'EASY_PAY', tossMethod: '간편결제', disabled: true },
  { label: '핸드폰결제', backendEnum: 'MOBILE_PHONE', tossMethod: '휴대폰' },
  { label: '무통장입금', backendEnum: 'TRANSFER', tossMethod: '계좌이체' },
];

// 토스 결제창(WebView)이 열려 있는 동안 필요한 데이터
interface WebViewPaymentData {
  html: string;
  paymentId: number;
  pgOrderId: string;
  successUrlBase: string; // 성공 리다이렉트 URL 감지용 prefix
  failUrlBase: string;    // 실패 리다이렉트 URL 감지용 prefix
}

// 토스 결제 성공 후 리다이렉트 URL에서 paymentKey 등 쿼리 파라미터를 추출
const parseQueryParam = (url: string, param: string): string | null => {
  const match = url.match(new RegExp(`[?&]${param}=([^&#]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const PaymentScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { productId, productName, productImageUrl, productPrice } = route.params;
  const { isMockMode } = useMockMode();

  // 배송 메모 드롭다운
  const [selectedMemo, setSelectedMemo] = useState('배송시 요청사항 선택');
  const [isMemoExpanded, setIsMemoExpanded] = useState(false);

  // 결제 수단 선택
  const [selectedPayment, setSelectedPayment] = useState('신용카드');

  // 배송지 바텀시트 및 선택된 주소
  const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    name: '이수진',
    phone: '010-1234-5678',
    address: '경기도 화성시 병점구 안녕동 1245678845612',
  });

  // 결제 진행 상태 및 WebView 데이터 (null이면 WebView 닫힘)
  const [isLoading, setIsLoading] = useState(false);
  const [webViewPayment, setWebViewPayment] = useState<WebViewPaymentData | null>(null);

  const shippingFee = 5000;
  const totalPrice = productPrice + shippingFee;

  const MEMO_OPTIONS = [
    '요청사항 없음',
    '문 앞에 놓아주세요',
    '배송 전 연락 주세요',
    '부재 시 전화 주세요',
  ];

  const getErrorMessage = (error: any): string => {
    const errCode = error?.response?.data?.error?.code;
    const errMsg = error?.response?.data?.error?.message;
    if (errCode === 'ORDER_002') return '현재 주문할 수 없는 상품입니다.';
    if (errCode === 'ORDER_003') return '주문 결제 시간이 만료되었습니다. 다시 시도해주세요.';
    if (errCode === 'PAYMENT_003') return '결제 대행사 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    if (errCode === 'PAYMENT_004') return '결제 금액이 일치하지 않습니다.';
    return errMsg || '오류가 발생했습니다. 다시 시도해주세요.';
  };

  const buildTossHtml = (
    clientKey: string,
    pgOrderId: string,
    amount: number,
    orderName: string,
    successUrl: string,
    failUrl: string,
    tossMethod: string,
  ) => `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>
<script src="https://js.tosspayments.com/v1/payment"><\/script>
<script>
  var tossPayments = TossPayments('${clientKey}');
  tossPayments.requestPayment('${tossMethod}', {
    amount: ${amount},
    orderId: '${pgOrderId}',
    orderName: '${orderName.replace(/'/g, "\\'")}',
    successUrl: '${successUrl}',
    failUrl: '${failUrl}',
  }).catch(function(err) {
    window.location.href = '${failUrl}?code=' + encodeURIComponent(err.code || '') + '&message=' + encodeURIComponent(err.message || '');
  });
<\/script>
</body>
</html>`;

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const method = PAYMENT_METHODS.find(m => m.label === selectedPayment)!;

      // [1단계] 주문 생성
      let orderId: number;
      if (isMockMode) {
        await mockDelay();
        orderId = getMockCreateOrder(Number(productId), productPrice).data.data.id;
      } else {
        const res = await orderAPI.createOrder({ postId: Number(productId) });
        orderId = res.data.data.id;
      }

      // [2단계] 결제 생성
      let paymentId: number;
      let clientKey: string;
      let pgOrderId: string;
      let orderName: string;
      let successUrl: string;
      let failUrl: string;

      if (isMockMode) {
        await mockDelay();
        const mock = getMockCreatePayment(orderId, method.backendEnum, productPrice);
        const pd = mock.data.data;
        paymentId = pd.paymentId;
        clientKey = pd.clientKey;
        pgOrderId = pd.pgOrderId;
        orderName = pd.orderName;
        successUrl = pd.successUrl;
        failUrl = pd.failUrl;
      } else {
        const res = await paymentAPI.createPayment({ orderId, method: method.backendEnum });
        const pd = res.data.data;
        paymentId = pd.paymentId;
        clientKey = pd.clientKey;
        pgOrderId = pd.pgOrderId;
        orderName = pd.orderName;
        successUrl = pd.successUrl;
        failUrl = pd.failUrl;
      }

      // [3단계] 토스페이먼츠 결제창 열기
      if (isMockMode) {
        // 목 모드: WebView 없이 바로 결제 완료로 이동
        await mockDelay();
        navigation.navigate('PaymentComplete', {
          productName,
          productPrice,
          totalPrice,
          productImageUrl,
          pgOrderId,
        });
        return;
      }

      const html = buildTossHtml(clientKey, pgOrderId, productPrice, orderName, successUrl, failUrl, method.tossMethod);
      setWebViewPayment({
        html,
        paymentId,
        pgOrderId,
        successUrlBase: successUrl.split('?')[0],
        failUrlBase: failUrl.split('?')[0],
      });
    } catch (error) {
      Alert.alert('오류', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleShouldStartLoad = useCallback((request: any) => {
    if (!webViewPayment) return true;
    const { url } = request;

    if (url && url.startsWith(webViewPayment.successUrlBase)) {
      setWebViewPayment(null);
      setIsLoading(true);
      const paymentKey = parseQueryParam(url, 'paymentKey') || '';
      paymentAPI.confirmPayment(webViewPayment.paymentId, { paymentKey })
        .then(() => {
          navigation.navigate('PaymentComplete', {
            productName,
            productPrice,
            totalPrice,
            productImageUrl,
            pgOrderId: webViewPayment.pgOrderId,
          });
        })
        .catch((error) => Alert.alert('결제 오류', getErrorMessage(error)))
        .finally(() => setIsLoading(false));
      return false;
    }

    if (url && url.startsWith(webViewPayment.failUrlBase)) {
      setWebViewPayment(null);
      Alert.alert('결제 실패', '결제가 취소되었거나 실패했습니다.');
      return false;
    }

    return true;
  }, [webViewPayment, navigation, productName, productPrice, totalPrice, productImageUrl]);

  if (webViewPayment) {
    return (
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <View style={styles.container}>
          <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setWebViewPayment(null)}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>결제</Text>
            </View>
          </View>
          <WebView
            source={{ html: webViewPayment.html }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            javaScriptEnabled
            domStorageEnabled
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    );
  }

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

        {/* 로딩 오버레이 */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.main01} />
          </View>
        )}

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
                  <Text style={styles.infoName}>{selectedAddress.name}</Text>
                  <Text style={styles.infoTel}>{selectedAddress.phone}</Text>
                  <Text style={styles.addressText}>{selectedAddress.address}</Text>
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
                {/* 상단: 신용카드, 가상계좌, 간편결제 */}
                <View style={styles.paymentMethodRow}>
                  {PAYMENT_METHODS.slice(0, 3).map(({ label, disabled }) => (
                    <TouchableOpacity
                      key={label}
                      style={[
                        styles.paymentMethodButton,
                        selectedPayment === label && styles.paymentMethodButtonActive,
                      ]}
                      onPress={() => !disabled && setSelectedPayment(label)}
                    >
                      <Text style={[
                        styles.paymentMethodText,
                        selectedPayment === label && styles.paymentMethodTextActive,
                      ]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* 하단: 핸드폰결제, 무통장입금 */}
                <View style={styles.paymentMethodRowBottom}>
                  {PAYMENT_METHODS.slice(3).map(({ label }) => (
                    <TouchableOpacity
                      key={label}
                      style={[styles.paymentMethodButton, selectedPayment === label && styles.paymentMethodButtonActive]}
                      onPress={() => setSelectedPayment(label)}
                    >
                      <Text style={[styles.paymentMethodText, selectedPayment === label && styles.paymentMethodTextActive]}>{label}</Text>
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
            <TouchableOpacity
              style={[styles.payButton, isLoading && styles.payButtonDisabled]}
              onPress={handlePay}
              disabled={isLoading}
            >
              <Text style={styles.payButtonText}>결제하기</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

        {/* 배송지 변경 바텀 시트 */}
        <AddressBottomSheet
          visible={isAddressSheetVisible}
          onClose={() => setIsAddressSheetVisible(false)}
          onSelect={(address) => setSelectedAddress(address)}
        />

      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
