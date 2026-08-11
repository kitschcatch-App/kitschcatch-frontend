/**
 * 화면: 상품 상세 화면 (ProductDetailScreen)
 * 역할: 상품 목록에서 선택한 특정 상품의 상세 정보(이미지, 가격, 설명, 판매자 정보 등)와 하단 액션 바를 보여주는 컴포넌트입니다.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator, Modal, FlatList, useWindowDimensions } from 'react-native';
import ErrorView from '../components/ErrorView';
import { ERROR_MESSAGES, ErrorMessage } from '../constants/errorMessages';
import { CONDITION_DISPLAY_MAP, CATEGORY_DISPLAY_MAP, STATUS_DISPLAY_MAP, CATEGORY_REVERSE_MAP } from '../constants/displayMaps';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import BackIcon from '../assets/back.svg';
import { styles } from './ProductDetailScreen.styles';
import HeartIcon from '../assets/heart.svg';
import DetailHeartIcon from '../assets/detail_heart.svg';
import DetailChatIcon from '../assets/detail_chat.svg';
import BottomNav from '../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import axios from 'axios';
import { secureStorage } from '../utils/secureStorage';
import { productAPI, chatAPI } from '../api/apiClient';
import { getMockPostDetail, getMockCreateChatRoom, mockDelay } from '../api/mockData';
import { useMockMode } from '../contexts/MockModeContext';
import { formatTime } from '../utils/formatTime';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const { isMockMode } = useMockMode();

  // 이전 화면(ProductList)에서 넘겨준 파라미터 받기
  const { productId, productName, productPrice, productImageUrl } = route.params;

  // 백엔드에서 받아올 상품 상세 정보 상태
  const [productDetail, setProductDetail] = useState<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    imageUrls: string[];       // 전체 이미지 URL 목록 (캐러셀용)
    description: string;
    sellerName: string;
    sellerId: number | null;   // 판매자 숫자 ID (본인 게시글 여부 판별용)
    imageKeys: string[];       // S3 이미지 키 목록 (수정 화면 전달용)
    category: string;
    condition: string;
    status: string;
    createdAt: string;
  }>({
    id: productId,
    name: productName,
    price: productPrice,
    imageUrl: productImageUrl,
    imageUrls: [productImageUrl],
    description: '상품 정보를 불러오는 중입니다...',
    sellerName: '불러오는 중...',
    sellerId: null,
    imageKeys: [],
    category: '',
    condition: '',
    status: '',
    createdAt: '',
  });
  const [imageIndex, setImageIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<string>('');

  // 애니메이션 값 설정
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(150)).current;
  const isInitialFocus = useRef(true);

  // 상품 상세 API 호출
  useEffect(() => {
    const abortController = new AbortController();

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        let post: any;

        if (isMockMode) {
          // ── Mock 모드: mockData.ts의 가상 데이터 사용 ──────────────────────
          await mockDelay(400 + Math.random() * 300);
          post = getMockPostDetail(productId).data.data;
        } else {
          // ── Real 모드: 실제 백엔드 API 호출 ───────────────────────────────
          const response = await productAPI.getPostDetail(productId, {
            signal: abortController.signal,
          });
          post = response.data.data;
        }

        const images: any[] = post.images ?? [];
        setProductDetail(prev => ({
          ...prev,
          id: post.id?.toString() || prev.id,
          name: post.title || prev.name,
          price: post.price || prev.price,
          imageUrl: images[0]?.imageUrl || prev.imageUrl,
          imageUrls: images.length > 0 ? images.map((img: any) => img.imageUrl) : prev.imageUrls,
          imageKeys: images.map((img: any) => img.imageKey),
          description: post.description || '상세 설명이 없습니다.',
          sellerName: post.sellerNickname || post.sellerId?.toString() || '알 수 없음',
          sellerId: post.sellerId ?? null,
          category: CATEGORY_REVERSE_MAP[post.productCategory] || post.productCategory || 'ETC',
          condition: post.productCondition || 'USED',
          status: post.productStatus || 'ON_SALE',
          createdAt: post.createdAt || new Date().toISOString(),
        }));
        setImageIndex(0);
      } catch (error: any) {
        if (axios.isCancel(error)) return;
        console.error('상품 상세 정보 조회 실패:', error);
        const status = error?.response?.status;
        const errCode = error?.response?.data?.error?.code;
        if (status === 404 || errCode === 'POST_NOT_FOUND') {
          setErrorMsg(ERROR_MESSAGES.PRODUCT_DETAIL.DELETED);
        } else if (errCode?.includes('SOLD_OUT')) {
          setErrorMsg(ERROR_MESSAGES.PRODUCT_DETAIL.SOLD_OUT);
        } else if (errCode?.includes('UNAVAILABLE') || status === 403) {
          setErrorMsg(ERROR_MESSAGES.PRODUCT_DETAIL.UNAVAILABLE);
        } else {
          setErrorMsg(ERROR_MESSAGES.SYSTEM.TEMPORARY);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();

    return () => {
      abortController.abort();
    };
  }, [productId, isMockMode, retryTrigger]);

  // 화면 진입 애니메이션
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // 로그인된 사용자 ID 불러오기 (로그인 시 저장한 user.id)
  useEffect(() => {
    const loadCurrentUser = async () => {
      const stored = await secureStorage.getItem('userId');
      if (stored) setCurrentUserId(Number(stored));
    };
    loadCurrentUser();
  }, []);

  // ProductEdit에서 돌아올 때 상품 정보 새로고침
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isInitialFocus.current) {
        isInitialFocus.current = false;
        return;
      }
      setRetryTrigger(t => t + 1);
    });
    return unsubscribe;
  }, [navigation]);

  const openStatusModal = () => {
    setTempStatus(productDetail.status);
    setIsStatusModalVisible(true);
  };

  const handleStatusSubmit = async () => {
    if (tempStatus !== productDetail.status) {
      try {
        if (isMockMode) {
          await mockDelay(400 + Math.random() * 300);
          console.log(`[Mock] 판매상태 수정 완료: ${productDetail.status} -> ${tempStatus}`);
        } else {
          await productAPI.updatePost(productDetail.id, { productStatus: tempStatus });
        }
        setProductDetail(prev => ({ ...prev, status: tempStatus }));
      } catch (error) {
        console.error('상태 업데이트 실패:', error);
      }
    }
    setIsStatusModalVisible(false);
  };

  // ProductDetailScreen -> ProductListScreen으로 이동 시 애니메이션 적용
  const handleGoBack = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  // 로그인 유저 ID와 판매자 ID를 비교하여 본인 게시글 여부 판별
  const isSeller = currentUserId !== null && currentUserId === productDetail.sellerId;

  return (
    <View style={styles.container}>
      {/* 상단 (페이드 인 애니메이션 적용) */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 1. 상품 이미지 캐러셀 */}
          <View style={styles.imageContainer}>
            <FlatList
              data={productDetail.imageUrls}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={[styles.productImage, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.5 }]} />
              )}
            />

            {/* 이미지 인디케이터 */}
            {productDetail.imageUrls.length > 1 && (
              <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 6 }}>
                {productDetail.imageUrls.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: i === imageIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}
                  />
                ))}
              </View>
            )}

            {/* 상단 그라데이션 (뒤로가기 버튼 가독성 확보용) */}
            <View pointerEvents="none" style={styles.topGradient}>
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#000000" stopOpacity={0.55} />
                    <Stop offset="0.35" stopColor="#000000" stopOpacity={0.28} />
                    <Stop offset="0.7" stopColor="#000000" stopOpacity={0.08} />
                    <Stop offset="1" stopColor="#000000" stopOpacity={0} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#topFade)" />
              </Svg>
            </View>

            {/* Mock 모드 배지 (이미지 좌측 상단) */}
            {isMockMode && (
              <View style={{
                position: 'absolute', top: 10, left: 10,
                backgroundColor: 'rgba(70,201,178,0.85)',
                paddingHorizontal: 10, paddingVertical: 4,
                borderRadius: 12, zIndex: 10,
              }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>🧪 Mock</Text>
              </View>
            )}
          </View>


          {/* 2. 상품 정보 영역 */}
          <View style={styles.infoContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={[styles.productName, { flex: 1, marginRight: 10 }]}>{productDetail.name}</Text>
              {!isSeller && (
                <TouchableOpacity style={styles.wishButton}>
                  <HeartIcon width={25} height={25} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.productPrice}>
              {Number(productDetail.price).toLocaleString()}원
            </Text>
            <Text style={styles.productDescription}>{productDetail.description}</Text>

            {/* 뱃지(판매상태/카테고리/사용감) + 메타 정보(등록시간/하트/채팅) 영역 */}
            <View style={styles.metaContainer}>
              <View style={styles.badgeRow}>
                {!isSeller && productDetail.status ? (
                  <Text style={styles.tagBadge}>{STATUS_DISPLAY_MAP[productDetail.status] || productDetail.status}</Text>
                ) : null}
                <Text style={styles.tagBadge}>{CATEGORY_DISPLAY_MAP[productDetail.category] || productDetail.category}</Text>
                <Text style={styles.tagBadge}>{CONDITION_DISPLAY_MAP[productDetail.condition] || productDetail.condition}</Text>
              </View>
              <View style={styles.metaRight}>
                <Text style={styles.metaTime}>{formatTime(productDetail.createdAt)}</Text>
                <DetailHeartIcon width={8} height={8} style={styles.metaIcon} />
                <Text style={styles.metaText}>12</Text>
                <DetailChatIcon width={8} height={8} style={styles.metaIcon} />
                <Text style={styles.metaText}>3</Text>
              </View>
            </View>
          </View>

          {/* 구분선 */}
          <View style={styles.productSeparator} />

          {/* 3. 판매자 정보 영역 */}
          <View style={styles.sellerContainer}>
            <Text style={styles.transactionCount}>판매자 거래 횟수 3회</Text>
            <View style={styles.sellerRight}>
              <Text style={styles.sellerName}>졸린코끼리</Text>
              <View style={styles.sellerProfileImageWrapper}>
                <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.sellerProfileImage} />
                <View style={styles.sellerRatingBadge}>
                  <Text style={styles.sellerRatingText}>3.8</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 로딩 중일 때 표시할 스피너 */}
        {isLoading && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 20 }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}

        {/* 뒤로가기 버튼 (이미지 위에 겹치도록 설정) */}
        <View style={[styles.header, { top: insets.top + 44 }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <BackIcon width={10} height={18} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* 하단 (아래에서 위로 슬라이드 애니메이션 적용) */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        {/* 4. 고정된 하단 액션 바: 판매자면 수정하기, 구매자면 채팅하기 + 결제하기 */}
        <View style={styles.actionBar}>
          {isSeller ? (
            <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[styles.buyButton, { flex: 1, marginHorizontal: 0 }]}
                onPress={openStatusModal}
              >
                <Text style={styles.buyButtonText}>판매상태 수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buyButton, { flex: 1, marginHorizontal: 0 }]}
                onPress={() => navigation.navigate('ProductEdit', {
                  postId: productDetail.id,
                  title: productDetail.name,
                  description: productDetail.description,
                  price: productDetail.price,
                  imageURL: productDetail.imageUrl,
                  imageUrls: productDetail.imageUrls,
                  imageKeys: productDetail.imageKeys,
                  productCategory: productDetail.category,
                  productCondition: productDetail.condition,
                  productStatus: productDetail.status,
                  sellerId: productDetail.sellerId?.toString() || '',
                })}
              >
                <Text style={styles.buyButtonText}>상품정보 수정</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={styles.chatButton}
                disabled={isChatLoading}
                onPress={async () => {
                  try {
                    setIsChatLoading(true);
                    let chatRoomId: number;
                    let opponentNickname: string;

                    if (isMockMode) {
                      await mockDelay(300);
                      const mock = getMockCreateChatRoom(Number(productDetail.id));
                      chatRoomId = mock.data.chatRoomId;
                      opponentNickname = mock.data.sellerNickname;
                    } else {
                      const res = await chatAPI.createChatRoom(Number(productDetail.id));
                      // 서버가 { data: {...} } 래퍼를 사용하는 경우도 처리
                      const resBody = res.data?.data ?? res.data;
                      chatRoomId = resBody.chatRoomId;
                      opponentNickname = resBody.sellerNickname;
                      if (!chatRoomId) {
                        console.error('채팅방 ID 없음, 응답:', JSON.stringify(res.data));
                        throw new Error('채팅방 ID를 받지 못했습니다.');
                      }
                    }

                    navigation.navigate('Chat', { chatRoomId, opponentNickname });
                  } catch (e: any) {
                    if (e?.response?.status === 401) {
                      navigation.navigate('Login');
                    } else {
                      console.error('채팅방 생성 실패:', e);
                    }
                  } finally {
                    setIsChatLoading(false);
                  }
                }}
              >
                <Text style={styles.chatButtonText}>
                  {isChatLoading ? '연결 중...' : '1:1 구매문의'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => navigation.navigate('Payment', {
                  productId: productDetail.id,
                  productName: productDetail.name,
                  productPrice: productDetail.price,
                  productImageUrl: productDetail.imageUrl,
                })}
              >
                <Text style={styles.buyButtonText}>바로 결제하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <BottomNav />
      </Animated.View>

      <ErrorView
        visible={!!errorMsg}
        title={errorMsg?.title ?? ''}
        subtitle={errorMsg?.subtitle ?? ''}
        onPress={() => {
          setErrorMsg(null);
          setRetryTrigger(t => t + 1);
        }}
      />

      {/* 상태 수정 모달 */}
      <Modal
        visible={isStatusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>판매상태</Text>
            <View style={styles.modalOptionsRow}>
              {['ON_SALE', 'RESERVED', 'SOLD_OUT'].map((statusKey) => (
                <TouchableOpacity
                  key={statusKey}
                  style={[
                    styles.modalOptionBtn,
                    tempStatus === statusKey && styles.modalOptionBtnActive
                  ]}
                  onPress={() => setTempStatus(statusKey)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    tempStatus === statusKey && styles.modalOptionTextActive
                  ]}>
                    {STATUS_DISPLAY_MAP[statusKey]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleStatusSubmit}>
              <Text style={styles.modalSubmitText}>선택완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetailScreen;