/**
 * 화면: 상품 상세 화면 (ProductDetailScreen)
 * 역할: 상품 목록에서 선택한 특정 상품의 상세 정보(이미지, 가격, 설명, 판매자 정보 등)와 하단 액션 바를 보여주는 컴포넌트입니다.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './ProductDetailScreen.styles';
import HeartIcon from '../assets/heart.svg';
import DetailHeartIcon from '../assets/detail_heart.svg';
import DetailChatIcon from '../assets/detail_chat.svg';
import BottomNav from '../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import axios from 'axios';
import { productAPI } from '../api/apiClient';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

// 한글 출력용 카테고리, 상태 매핑 객체 추가
const CONDITION_DISPLAY_MAP: Record<string, string> = {
  'NEW': '새상품',
  'LIKE_NEW': '사용감 적음',
  'USED': '사용감 있음',
  'HEAVILY_USED': '사용감 많음',
};

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  'ANIME_MANGA': '애니 / 만화',
  'GAME': '게임',
  'GOODS': '굿즈',
  'COSPLAY': '코스프레',
  'BOOK': '서적',
  'MEDIA': '음반 / 영상',
  'ETC': '기타',
  'FIGURE': '피규어',
};

const STATUS_DISPLAY_MAP: Record<string, string> = {
  'ON_SALE': '판매중',
  'RESERVED': '예약중',
  'SOLD_OUT': '판매완료',
};

// 인증 시스템 구현 전 임시 현재 유저 ID (TODO: 로그인 연동 후 auth context로 교체)
const CURRENT_USER_ID = 'sasukezzang';

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets(); // 기기의 안전 영역(상태바 등) 높이를 가져옵니다.

  // 이전 화면(ProductList)에서 넘겨준 파라미터 받기
  const { productId, productName, productPrice, productImageUrl } = route.params;

  // 백엔드에서 받아올 상품 상세 정보 상태
  const [productDetail, setProductDetail] = useState({
    id: productId,
    name: productName,
    price: productPrice,
    imageUrl: productImageUrl,
    description: '상품 정보를 불러오는 중입니다...',
    sellerName: '불러오는 중...',
    category: '',
    condition: '',
    status: '',
    createdAt: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusExpanded, setStatusExpanded] = useState(false);

  // 애니메이션 값 설정
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(150)).current; 

  // 상품 상세 API 호출
  useEffect(() => {
    // 화면을 벗어날 때 진행 중인 API 요청을 취소하기 위한 컨트롤러
    const abortController = new AbortController();

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        // 모듈화된 axios API 호출
        const response = await productAPI.getPostDetail(productId, {
          signal: abortController.signal,
        });
        const data = response.data; // axios는 JSON 파싱을 자동으로 처리합니다.
        
        // 응답 데이터가 배열일 경우 첫 번째 요소 추출
        const post = Array.isArray(data) ? data[0] : data;
        
        // 가격에 콤마가 포함된 문자열("35,000")로 올 경우 숫자로 변환
        const priceNumber = typeof post.price === 'string' ? Number(post.price.replace(/,/g, '')) : post.price;

        // 기존 route.params에서 가져온 데이터(prev)를 기반으로 덮어쓰기
        setProductDetail(prev => ({
          ...prev,
          id: post.postid?.toString() || post.postId?.toString() || prev.id,
          name: post.title || prev.name,
          price: priceNumber !== undefined ? priceNumber : prev.price,
          imageUrl: post.imageURL || prev.imageUrl,
          description: post.description || '상세 설명이 없습니다.',
          sellerName: post.sellerId || '알 수 없음',
          category: post.productCategory || 'ETC',
          condition: post.productCondition || 'USED',
          status: post.productStatus || post.status || 'ON_SALE',
          createdAt: post.createdAt || new Date().toISOString(),
        }));
      } catch (error: any) {
        if (axios.isCancel(error)) return;
        
        console.error('상품 상세 정보 조회 실패:', error);
        // [테스트용] 
        setProductDetail(prev => ({
          ...prev,
          description: "귀멸의 칼날 피규어 무이치로 판매상태 좋습니다. \n직거래 택배거래 둘 다 가능\n택배는 편의점 반값택배로 보내드려요.",
          sellerName: "졸린코끼리", // 수정하기 버튼 테스트
          category: "FIGURE",
          condition: "LIKE_NEW",
          status: "ON_SALE",
          createdAt: "2026-04-13T14:00:00",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();

    // 클린업 함수: 컴포넌트 언마운트 시 진행중인 fetch 요청 취소 (메모리 누수 방지)
    return () => {
      abortController.abort();
    };
  }, [productId]); // productId가 변경될 때만 재실행하도록 의존성 배열 최적화

  useEffect(() => {
    // ProductDetailScreen -> ProductListScreen으로 이동 시 애니메이션 적용
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

  // ProductDetailScreen에서 ProductListScreen으로 돌아갈 때 애니메이션 적용
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

  // 등록된 시간 포맷팅 함수 ("방금 전", "N시간 전", "N달 전" 등)
  const formatTime = (dateString: string) => {
    if (!dateString) return '';

    // 백엔드 날짜 문자열에 타임존 정보가 없으면 한국 표준시(KST, +09:00) 기준으로 파싱
    const timePart = dateString.split('T')[1] || '';
    const hasTimezone = timePart.includes('Z') || timePart.includes('+') || timePart.includes('-');
    const kstDateString = hasTimezone ? dateString : `${dateString}+09:00`;

    const date = new Date(kstDateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) {
      return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
    }

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 30) return `${diffDays}일 전`;
    if (diffMonths < 12) return `${diffMonths}달 전`;
    
    return `${diffYears}년 전`;
  };

  const isSeller = productDetail.sellerName === CURRENT_USER_ID;

  return (
    <View style={styles.container}>
      {/* 상단 (페이드 인 애니메이션 적용) */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 1. 상품 이미지 및 상태 드롭다운 (화면의 약 60%) */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: productDetail.imageUrl }} style={styles.productImage} />

            {/* 판매자용 상태 드롭다운 영역 (이미지 우측 하단) */}
            {isSeller && (
              <View style={styles.statusDropdownContainer}>
                <TouchableOpacity 
                  style={styles.statusButton} 
                  onPress={() => setStatusExpanded(!isStatusExpanded)}
                >
                  <Text style={styles.statusButtonText}>{STATUS_DISPLAY_MAP[productDetail.status] || productDetail.status} ▼</Text>
                </TouchableOpacity>
                
                {isStatusExpanded && (
                  <View style={styles.dropdownList}>
                    {['판매중', '예약중', '판매완료'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownItem}
                        onPress={async () => {
                          const key = Object.keys(STATUS_DISPLAY_MAP).find(k => STATUS_DISPLAY_MAP[k] === option) || option;
                          try {
                            await productAPI.updatePost(productDetail.id, {
                              postid: productDetail.id,
                              sellerId: productDetail.sellerName,
                              title: productDetail.name,
                              description: productDetail.description,
                              price: String(productDetail.price),
                              imageURL: productDetail.imageUrl,
                              productCategory: productDetail.category,
                              productCondition: productDetail.condition,
                              productStatus: key,
                            });
                          } catch (error) {
                            console.error('상태 업데이트 실패:', error);
                          }
                          setProductDetail(prev => ({ ...prev, status: key }));
                          setStatusExpanded(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 구분선 */}
          <View style={styles.divider} />
          
          {/* 2. 상품 정보 영역 */}
          <View style={styles.infoContainer}>
            {!isSeller && productDetail.status ? (
              <Text style={styles.productStatus}>{STATUS_DISPLAY_MAP[productDetail.status] || productDetail.status}</Text>
            ) : null}
            <Text style={styles.productName}>{productDetail.name}</Text>
            <Text style={styles.productPrice}>
              {Number(productDetail.price).toLocaleString()}원
            </Text>
            <Text style={styles.productDescription}>{productDetail.description}</Text>

            {/* 메타 데이터 영역 (하트, 채팅, 등록시간 / 카테고리, 사용감) */}
            <View style={styles.metaContainer}>
              <View style={styles.metaLeft}>
                <Text style={styles.metaTag}>{CONDITION_DISPLAY_MAP[productDetail.condition] || productDetail.condition}</Text>
                <Text style={styles.metaTag}>{CATEGORY_DISPLAY_MAP[productDetail.category] || productDetail.category}</Text>
              </View>
              <View style={styles.metaRight}>
                <DetailHeartIcon width={8} height={8} style={styles.metaIcon} />
                <Text style={styles.metaText}>12</Text>
                <DetailChatIcon width={8} height={8} style={styles.metaIcon} />
                <Text style={styles.metaText}>3</Text>
                <Text style={styles.metaTime}>{formatTime(productDetail.createdAt)}</Text>
              </View>
            </View>
          </View>

          {/* 구분선 */}
          <View style={styles.productSeparator} />

          {/* 3. 판매자 정보 영역 */}
          <View style={styles.sellerContainer}>
            <Text style={styles.transactionCount}>판매자 거래 횟수 3회</Text>
            <View style={styles.sellerRight}>
              <Text style={styles.sellerName}>{productDetail.sellerName}</Text>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.sellerProfileImage} />
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
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* 하단 (아래에서 위로 슬라이드 애니메이션 적용) */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        {/* 4. 고정된 하단 액션 바: 판매자면 수정하기, 구매자면 채팅하기 + 결제하기 */}
        <View style={styles.actionBar}>
          {productDetail.sellerName === CURRENT_USER_ID ? (
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => navigation.navigate('ProductEdit', {
                postId: productDetail.id,
                title: productDetail.name,
                description: productDetail.description,
                price: productDetail.price,
                imageURL: productDetail.imageUrl,
                productCategory: productDetail.category,
                productCondition: productDetail.condition,
                productStatus: productDetail.status,
                sellerId: productDetail.sellerName,
              })}
            >
              <Text style={styles.buyButtonText}>수정하기</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.wishButton}>
                <HeartIcon width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('Chat', {
                  sellerName: productDetail.sellerName,
                  productName: productDetail.name,
                  productImageUrl: productDetail.imageUrl,
                })}
              >
                <Text style={styles.chatButtonText}>채팅하기</Text>
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
                <Text style={styles.buyButtonText}>결제하기</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <BottomNav />
      </Animated.View>
    </View>
  );
};

export default ProductDetailScreen;