/**
 * 화면: 상품 상세 화면 (ProductDetailScreen)
 * 역할: 상품 목록에서 선택한 특정 상품의 상세 정보(이미지, 가격, 설명, 판매자 정보 등)와 하단 액션 바를 보여주는 컴포넌트입니다.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './ProductDetailScreen.styles';
import HeartIcon from '../assets/heart.svg';
import BottomNav from '../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets(); // 기기의 안전 영역(상태바 등) 높이를 가져옵니다.

  // 이전 화면(ProductList)에서 넘겨준 파라미터 받기
  const { productId, productName, productPrice, productImageUrl } = route.params;

  // UI 구성을 위한 임시 상품 데이터 (추후 실제 API 데이터로 교체하세요)
  const mockProductDetail = {
    id: productId,
    name: productName,
    price: productPrice,
    imageUrl: productImageUrl,
    description: '상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명',
  };

  // 애니메이션 값 설정
  const fadeAnim = useRef(new Animated.Value(0)).current; // 초기 투명도 0 (완전 투명)
  const slideAnim = useRef(new Animated.Value(150)).current; // 하단에서 150px 아래에서 시작

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

  return (
    <View style={styles.container}>
      {/* 상단 (페이드 인 애니메이션 적용) */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 1. 상품 이미지 (화면의 약 60%) */}
          <Image source={{ uri: mockProductDetail.imageUrl }} style={styles.productImage} />
          
          {/* 2. 상품 정보 영역 */}
          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{mockProductDetail.name}</Text>
            <Text style={styles.productPrice}>
              {Number(mockProductDetail.price).toLocaleString()}원
            </Text>
            <Text style={styles.productDescription}>{mockProductDetail.description}</Text>
          </View>

          {/* 구분선 */}
          <View style={styles.productSeparator} />

          {/* 3. 판매자 정보 영역 */}
          <View style={styles.sellerContainer}>
            <Text style={styles.transactionCount}>판매자 거래 횟수 3회</Text>
            <View style={styles.sellerRight}>
              <Text style={styles.sellerName}>졸린코끼리</Text>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.sellerProfileImage} />
            </View>
          </View>
        </ScrollView>

        {/* 뒤로가기 버튼 (이미지 위에 겹치도록 설정) */}
        <View style={[styles.header, { top: insets.top + 44 }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* 하단 (아래에서 위로 슬라이드 애니메이션 적용) */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        {/* 4. 고정된 하단 액션 바 (채팅하기, 결제하기) */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.wishButton}>
            <HeartIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.chatButton} 
            onPress={() => navigation.navigate('Chat', { 
              sellerName: '졸린코끼리',
              productName: mockProductDetail.name,
              productImageUrl: mockProductDetail.imageUrl
            })}
          >
            <Text style={styles.chatButtonText}>채팅하기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={() => navigation.navigate('Payment', {
              productId: mockProductDetail.id,
              productName: mockProductDetail.name,
              productPrice: mockProductDetail.price,
              productImageUrl: mockProductDetail.imageUrl
            })}
          >
            <Text style={styles.buyButtonText}>결제하기</Text>
          </TouchableOpacity>
        </View>

        <BottomNav />
      </Animated.View>
    </View>
  );
};

export default ProductDetailScreen;