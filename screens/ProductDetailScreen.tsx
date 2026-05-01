/**
 * 화면: 상품 상세 화면 (ProductDetailScreen)
 * 역할: 상품 목록에서 선택한 특정 상품의 상세 정보(이미지, 가격, 설명, 판매자 정보 등)와 하단 액션 바를 보여주는 컴포넌트입니다.
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import { styles } from './ProductDetailScreen.styles';
import NavHomeIcon from '../assets/nav_home.svg';
import NavSearchIcon from '../assets/nav_search.svg';
import NavChatIcon from '../assets/nav_chat.svg';
import NavProfileIcon from '../assets/nav_profile.svg';
import HeartIcon from '../assets/heart.svg';

const ProductDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets(); // 기기의 안전 영역(상태바 등) 높이를 가져옵니다.

  // 이전 화면(ProductList)에서 넘겨준 파라미터 받기
  const { productId, productName, productPrice, productImageUrl } = route.params || {};

  // UI 구성을 위한 임시 상품 데이터 (추후 실제 API 데이터로 교체하세요)
  const mockProductDetail = {
    id: productId,
    name: productName || '상품명을 불러올 수 없습니다.',
    price: productPrice || 0,
    imageUrl: productImageUrl || 'https://example.com/image.jpg', // 실제 이미지가 없으면 회색 배경으로 표시
    description: '상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명\n상품설명',
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* 4. 고정된 하단 액션 바 (채팅하기, 결제하기) */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.wishButton}>
          <HeartIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.chatButtonText}>채팅하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 네비게이션 바 */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProductList')}>
          <NavHomeIcon width={24} height={24} />
          <Text style={styles.navText}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <NavSearchIcon width={24} height={24} />
          <Text style={styles.navText}>상품검색</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <NavChatIcon width={23} height={23} />
          <Text style={styles.navText}>채팅목록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <NavProfileIcon width={28} height={28} />
          <Text style={styles.navText}>회원정보</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;