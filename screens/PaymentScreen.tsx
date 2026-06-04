/**
 * 화면: 결제 화면 (PaymentScreen)
 * 역할: 상품 구매를 위해 배송지를 확인하고 결제 수단을 선택하여 결제를 진행하는 화면입니다.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Linking, AppState, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './PaymentScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../styles/colors';
import AddressBottomSheet, { SelectedAddress } from '../components/AddressBottomSheet';
import Config from 'react-native-config';
import { useMockMode } from '../contexts/MockModeContext';
import { orderAPI, paymentAPI } from '../api/apiClient';
import { getMockCreateOrder, mockDelay } from '../api/mockData';

// Toss JS SDK v1은 successUrl/failUrl이 반드시 https://로 시작해야 한다.
// onShouldStartLoadWithRequest에서 실제 로드 전에 가로채므로 서버가 없어도 동작한다.
const TOSS_SUCCESS_URL = 'https://payment.kitschcatch.com/success';
const TOSS_FAIL_URL = 'https://payment.kitschcatch.com/fail';

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
  paymentId: string;
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
  const webViewRef = useRef<WebView>(null);

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
  const [openingExternalApp, setOpeningExternalApp] = useState(false);

  // Linking 콜백에서 최신 webViewPayment에 접근하기 위한 ref
  const webViewPaymentRef = useRef<WebViewPaymentData | null>(null);
  useEffect(() => { webViewPaymentRef.current = webViewPayment; }, [webViewPayment]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setOpeningExternalApp(false);
    });
    return () => sub.remove();
  }, []);

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
    if (errCode === 'PAYMENT_001') return '결제 정보를 찾을 수 없습니다.';
    if (errCode === 'PAYMENT_002') return '결제 금액이 일치하지 않습니다.';
    if (errCode === 'PAYMENT_003') return '잘못된 결제 상태 전환입니다. 다시 시도해주세요.';
    if (errCode === 'PAYMENT_005') return '결제 대행사 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    if (errCode === 'ORDER_001') return '주문 정보를 찾을 수 없습니다.';
    if (errCode === 'ORDER_002') return '현재 주문할 수 없는 상품입니다.';
    if (errCode === 'ORDER_003') return '주문 결제 시간이 만료되었습니다. 다시 시도해주세요.';
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
    extraParams: Record<string, string> = {},
  ) => {
    const extraParamsJs = Object.entries(extraParams)
      .map(([k, v]) => `      ${k}: '${v}',`)
      .join('\n');
    return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>
<script src="https://js.tosspayments.com/v1/payment"><\/script>
<script>
  function rn(msg) {
    try { window.ReactNativeWebView.postMessage(JSON.stringify({type:'log', message: msg})); } catch(e) {}
  }
  rn('[Toss] clientKey=' + '${clientKey}'.substring(0,12) + '...');
  rn('[Toss] method=${tossMethod}, amount=${amount}, orderId=${pgOrderId}');
  rn('[Toss] successUrl=${successUrl}');
  try {
    var tossPayments = TossPayments('${clientKey}');
    rn('[Toss] SDK 초기화 완료, requestPayment 호출 중...');
    tossPayments.requestPayment('${tossMethod}', {
      amount: ${amount},
      orderId: '${pgOrderId}',
      orderName: '${orderName.replace(/'/g, "\\'")}',
      successUrl: '${successUrl}',
      failUrl: '${failUrl}',
${extraParamsJs}
    }).catch(function(err) {
      rn('[Toss] requestPayment catch: code=' + (err.code||'') + ' message=' + (err.message||''));
      window.location.href = '${failUrl}?code=' + encodeURIComponent(err.code || '') + '&message=' + encodeURIComponent(err.message || '');
    });
  } catch(e) {
    rn('[Toss] 초기화 예외: ' + e.message);
  }
<\/script>
</body>
</html>`;
  };

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const method = PAYMENT_METHODS.find(m => m.label === selectedPayment)!;

      // Mock 모드: Toss WebView 없이 바로 결제 완료 화면으로 이동
      if (isMockMode) {
        await mockDelay();
        const mockOrderId = `ORD-MOCK-${getMockCreateOrder(Number(productId), productPrice).data.data.id}`;
        navigation.navigate('PaymentComplete', {
          productName,
          productPrice,
          totalPrice,
          productImageUrl,
          pgOrderId: mockOrderId,
        });
        return;
      }

      // [1단계] 주문 생성 → orderId + paymentId 수령
      // 백엔드가 주문 생성 시 결제 레코드도 함께 생성하여 paymentId를 반환
      let orderRes: any;
      try {
        orderRes = await orderAPI.createOrder({
          postId: Number(productId),
          amount: productPrice,
          paymentMethod: method.backendEnum,
        });
      } catch (error: any) {
        console.error('[결제] 주문 생성 실패:', JSON.stringify(error?.response?.data));
        throw error;
      }
      const orderData = orderRes.data.data;
      console.log('[결제] 주문 생성 응답:', JSON.stringify(orderData));
      const orderId: string = orderData.orderId ?? orderData.id;
      const paymentId: string = orderData.paymentId;
      if (!orderId || !paymentId) {
        throw new Error('주문 ID 또는 결제 ID를 받지 못했습니다.');
      }

      // [2단계] Toss 결제창 열기
      // clientKey, successUrl, failUrl은 프론트엔드에서 관리 (백엔드 제공 안 함)
      const clientKey = Config.TOSS_CLIENT_KEY!;
      const extraParams: Record<string, string> = {};
      if (method.tossMethod === '휴대폰' || method.tossMethod === '계좌이체') {
        // 휴대폰: customerMobilePhone 필수 / 계좌이체: 현금영수증 발급을 위해 필요
        extraParams.customerMobilePhone = selectedAddress.phone.replace(/-/g, '');
      }
      const html = buildTossHtml(
        clientKey,
        orderId,       // Toss orderId = 내부 주문 ID
        productPrice,
        productName,
        TOSS_SUCCESS_URL,
        TOSS_FAIL_URL,
        method.tossMethod,
        extraParams,
      );
      setWebViewPayment({
        html,
        paymentId,
        pgOrderId: orderId,
        successUrlBase: TOSS_SUCCESS_URL,
        failUrlBase: TOSS_FAIL_URL,
      });
    } catch (error) {
      Alert.alert('오류', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 결제 성공 URL 처리 (WebView 내부 및 외부 앱 복귀 공통)
  const processSuccess = useCallback((url: string, data: WebViewPaymentData) => {
    setWebViewPayment(null);
    setIsLoading(true);
    if (isMockMode) {
      navigation.navigate('PaymentComplete', {
        productName, productPrice, totalPrice, productImageUrl, pgOrderId: data.pgOrderId,
      });
      setIsLoading(false);
      return;
    }
    const paymentKey = parseQueryParam(url, 'paymentKey') || '';
    paymentAPI.confirmPayment(data.paymentId, { paymentKey })
      .then(() => paymentAPI.getPayment(data.paymentId))
      .then((statusRes) => {
        const status = statusRes.data.data?.status;
        if (status !== 'SUCCESS') {
          Alert.alert('결제 오류', '결제가 완료되지 않았습니다. 잠시 후 다시 시도해주세요.');
          return;
        }
        navigation.navigate('PaymentComplete', {
          productName, productPrice, totalPrice, productImageUrl, pgOrderId: data.pgOrderId,
        });
      })
      .catch((error) => Alert.alert('결제 오류', getErrorMessage(error)))
      .finally(() => setIsLoading(false));
  }, [isMockMode, navigation, productName, productPrice, totalPrice, productImageUrl]);

  // 외부 은행 앱이 결제 완료 후 kitschcatch:// 딥링크로 복귀할 때 처리
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const data = webViewPaymentRef.current;
      if (!data) return;
      if (url.startsWith(data.successUrlBase)) {
        setOpeningExternalApp(false);
        processSuccess(url, data);
      } else if (url.startsWith(data.failUrlBase)) {
        const code = parseQueryParam(url, 'code') || '';
        const message = parseQueryParam(url, 'message') || '결제가 취소되었거나 실패했습니다.';
        setWebViewPayment(null);
        setOpeningExternalApp(false);
        Alert.alert('결제 실패', `[${code}] ${message}`);
      }
    });
    return () => sub.remove();
  }, [processSuccess]);

  const handleWebViewMessage = useCallback((e: any) => {
    try {
      const { type, url, message } = JSON.parse(e.nativeEvent.data);
      if (type === 'deeplink' && url) {
        setOpeningExternalApp(true);
        Linking.openURL(url).catch(() => setOpeningExternalApp(false));
      } else if (type === 'log') {
        console.log('[WebView]', message);
      }
    } catch {}
  }, []);

  const handleWebViewError = useCallback((syntheticEvent: any) => {
    const { url, code } = syntheticEvent.nativeEvent;
    const isDeepLinkScheme = url && !url.startsWith('http://') && !url.startsWith('https://');
    if (code === -10 || isDeepLinkScheme) {
      setOpeningExternalApp(true);
      Linking.openURL(url).catch(() => setOpeningExternalApp(false));
    } else if (code === -1) {
      // 서버가 빈 응답을 반환: 결제 리다이렉트 체인 중 발생하는 정상적인 흐름
      // 외부 앱이 이미 열렸을 가능성이 있으므로 오버레이 표시 후 복귀 시 자동 해제
      setOpeningExternalApp(true);
      setTimeout(() => setOpeningExternalApp(false), 5000);
    }
  }, []);

  const handleShouldStartLoad = useCallback((request: any) => {
    if (!webViewPayment) return true;
    const { url } = request;
    if (!url) return false;

    console.log('[ShouldLoad]', url);

    // 결제 성공 콜백 (WebView 내 네비게이션으로 도달한 경우)
    if (url.startsWith(webViewPayment.successUrlBase)) {
      processSuccess(url, webViewPayment);
      return false;
    }

    // 결제 실패/취소 콜백
    if (url.startsWith(webViewPayment.failUrlBase)) {
      const code = parseQueryParam(url, 'code') || '';
      const message = parseQueryParam(url, 'message') || '결제가 취소되었거나 실패했습니다.';
      setWebViewPayment(null);
      Alert.alert('결제 실패', `[${code}] ${message}`);
      return false;
    }

    // 외부 앱 딥링크(tossbank://, supertoss://, intent:// 등) → 외부 앱으로 위임
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:') && !url.startsWith('javascript:')) {
      setOpeningExternalApp(true);
      Linking.openURL(url).catch(() => setOpeningExternalApp(false));
      return false;
    }

    return true;
  }, [webViewPayment, processSuccess]);

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
            ref={webViewRef}
            source={{ html: webViewPayment.html, baseUrl: 'https://tosspayments.com' }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            injectedJavaScriptBeforeContentLoaded={`
              (function() {
                function isDeepLink(url) {
                  if (!url) return false;
                  // scheme:// 형태를 가지면서 http/https가 아닌 것만 앱 딥링크로 판단
                  // #앵커, 상대경로, about:, javascript: 등은 딥링크가 아님
                  return /^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(String(url)) &&
                         !/^https?:\/\//i.test(String(url));
                }
                function notify(url) {
                  try { window.ReactNativeWebView.postMessage(JSON.stringify({type:'deeplink',url:url})); } catch(e) {}
                }
                var _origOpen = window.open;
                window.open = function(url, target, features) {
                  try { window.ReactNativeWebView.postMessage(JSON.stringify({type:'log', message:'[window.open] url=' + url})); } catch(e) {}
                  if (isDeepLink(url)) { notify(url); return window; }
                  if (url) { window.location.href = url; return window; }
                  return _origOpen ? _origOpen.apply(this, arguments) : window;
                };
                try {
                  var locDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'href');
                  if (locDesc && locDesc.set) {
                    var _origSet = locDesc.set;
                    Object.defineProperty(Location.prototype, 'href', {
                      get: locDesc.get,
                      set: function(url) { if (isDeepLink(url)) notify(url); else _origSet.call(this, url); },
                      configurable: true, enumerable: true
                    });
                  }
                  var _origReplace = Location.prototype.replace;
                  Location.prototype.replace = function(url) { if (isDeepLink(url)) notify(url); else _origReplace.call(this, url); };
                  var _origAssign = Location.prototype.assign;
                  Location.prototype.assign = function(url) { if (isDeepLink(url)) notify(url); else _origAssign.call(this, url); };
                } catch(e) {}
                document.addEventListener('click', function(e) {
                  var el = e.target;
                  while (el && el.tagName !== 'A') el = el.parentNode;
                  if (el && el.tagName === 'A') {
                    var href = el.getAttribute('href');
                    if (isDeepLink(href)) { e.preventDefault(); e.stopPropagation(); notify(href); }
                  }
                }, true);
                true;
              })();
            `}
            onMessage={handleWebViewMessage}
            onError={handleWebViewError}
            onHttpError={(e) => console.log('[WebView HTTP오류]', e.nativeEvent.statusCode, e.nativeEvent.url)}
            onLoadStart={(e) => console.log('[WebView LoadStart]', e.nativeEvent.url)}
            style={{ flex: 1 }}
          />
          {openingExternalApp && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={colors.main01} />
              <Text style={{ marginTop: 12, color: '#666', fontSize: 14 }}>외부 앱으로 이동 중입니다...</Text>
            </View>
          )}
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
