/**
 * 화면: 상품 등록 화면 (ProductRegistrationScreen)
 * 역할: 사용자가 판매할 상품의 정보를 입력하고 등록하는 화면입니다.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ExitIcon from '../assets/exit.svg';
import CameraIcon from '../assets/camera.svg';
import { styles } from './ProductRegistrationScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import CommonInput from '../components/CommonInput';
import CommonDropdown from '../components/CommonDropdown';
import { productAPI } from '../api/apiClient';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductRegistration'>;

// 한글 드롭다운 옵션을 API 명세서에 맞는 영문으로 변환하는 매핑 객체
const CONDITION_MAP: Record<string, string> = {
  '새상품': 'NEW',
  '사용감 적음': 'LIKE_NEW',
  '사용감 있음': 'USED',
  '사용감 많음': 'HEAVILY_USED',
};
const CATEGORY_MAP: Record<string, string> = {
  '애니 / 만화': 'ANIME_MANGA',
  '게임': 'GAME',
  '굿즈': 'GOODS',
  '코스프레': 'COSPLAY',
  '서적': 'BOOK',
  '음반 / 영상': 'MEDIA',
  '기타': 'ETC',
};
const STATUS_MAP: Record<string, string> = {
  '판매중': 'ON_SALE',
  '예약중': 'RESERVED',
  '판매완료': 'SOLD_OUT',
};

const ProductRegistrationScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets(); // 상단 안전 영역 크기 가져오기
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('사용감 선택');
  const [isConditionExpanded, setConditionExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('카테고리 선택');
  const [isCategoryExpanded, setCategoryExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('판매상태 선택');
  const [isStatusExpanded, setStatusExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const CONDITION_OPTIONS = ['새상품', '사용감 적음', '사용감 있음', '사용감 많음'];
  const CATEGORY_OPTIONS = ['애니 / 만화', '게임', '굿즈', '코스프레', '서적', '음반 / 영상', '기타'];
  const STATUS_OPTIONS = ['판매중', '예약중', '판매완료'];

  // 가격 입력 시 콤마 자동 생성 핸들러
  const handlePriceChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    if (numericText === '') {
      setProductPrice('');
      return;
    }
    const noLeadingZeros = parseInt(numericText, 10).toString(); // 앞의 불필요한 0 제거
    const formattedPrice = noLeadingZeros.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 3자리마다 콤마 추가
    setProductPrice(formattedPrice);
  };

  const isPriceOverLimit = Number(productPrice.replace(/,/g, '')) > 1000000000; // 10억 초과 여부 확인

  const handleSelectCondition = (option: string) => {
    setSelectedCondition(option);
    setConditionExpanded(false);
  };

  const handleSelectCategory = (option: string) => {
    setSelectedCategory(option);
    setCategoryExpanded(false);
  };

  const handleSelectStatus = (option: string) => {
    setSelectedStatus(option);
    setStatusExpanded(false);
  };

  const showLimitToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handlePickImage = async () => {
    if (selectedImages.length >= 6) {
      showLimitToast();
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 6 - selectedImages.length,
      quality: 0.8,
    });
    if (result.didCancel || result.errorCode || !result.assets) return;
    if (result.assets.length > 6 - selectedImages.length) {
      showLimitToast();
    }
    setSelectedImages(prev => [...prev, ...result.assets!].slice(0, 6));
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // 상품 등록 API 호출 핸들러
  const handleSubmit = async () => {
    // 1. 유효성 검사
    if (!productName || !productPrice || !productDescription) {
      Alert.alert('알림', '필수 입력 항목을 모두 채워주세요.');
      return;
    }
    if (selectedCondition === '사용감 선택' || selectedCategory === '카테고리 선택' || selectedStatus === '판매상태 선택') {
      Alert.alert('알림', '드롭다운 항목을 모두 선택해주세요.');
      return;
    }
    if (!isPolicyAgreed) {
      Alert.alert('알림', '운영 정책에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    // 2. 데이터 구성 (배열 안의 객체 형태)
    const requestData = [{
      sellerId: "sasukezzang", // TODO: 실제 연동 시 로그인된 유저 ID 사용
      title: productName,
      description: productDescription,
      price: productPrice, // 명세서 요구대로 콤마가 포함된 문자열 전송
      imageURL: "string", // TODO: 이미지 업로드 로직 구현 후 실제 URL 반영
      productCategory: CATEGORY_MAP[selectedCategory] || "ETC",
      productCondition: CONDITION_MAP[selectedCondition] || "USED",
      productStatus: STATUS_MAP[selectedStatus] || "ON_SALE"
    }];

    try {
      // 모듈화된 axios API 호출
      const response = await productAPI.createPost(requestData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('성공', '상품이 성공적으로 등록되었습니다.', [{ text: '확인', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('오류', '상품 등록에 실패했습니다. (서버 응답 오류)');
      }
    } catch (error) {
      console.error('API 연동 에러:', error);
      // [테스트용] 백엔드 미연결 시 가상 통신 성공 시뮬레이션 폴백
      console.log('가상 백엔드로 전송된 데이터:', JSON.stringify(requestData, null, 2));
      Alert.alert('성공(가상)', '상품이 성공적으로 등록되었습니다.', [{ text: '확인', onPress: () => navigation.goBack() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 영역 */}
        <View style={styles.headerContainer}>
          {/* 왼쪽 공간을 차지하여 제목을 중앙에 맞추기 위한 빈 View */}
          <View style={styles.headerIconPlaceholder} />
          
          <Text style={styles.headerTitle}>상품등록</Text>

          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <ExitIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 상품 사진 등록 레이아웃 */}
        <View style={styles.photoLayout}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoScrollView}
            contentContainerStyle={styles.photoScrollContent}
          >
            {/* 사진 등록 버튼: 항상 표시, 6장일 때 탭하면 토스트 */}
            <TouchableOpacity style={styles.photoBox} onPress={handlePickImage}>
              <CameraIcon width={20} height={18} />
              <Text style={styles.photoCountText}>{selectedImages.length}/6</Text>
            </TouchableOpacity>

            {/* 선택된 이미지 썸네일 */}
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveImage(index)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* 빈 슬롯 (남은 자리) */}
            {Array.from({ length: Math.max(0, 5 - selectedImages.length) }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.photoBox} />
            ))}
          </ScrollView>
        </View>

        {/* 상품명 입력 레이아웃 */}
        <CommonInput
          label="상품명"
          placeholder="상품명을 입력해주세요"
          value={productName}
          onChangeText={setProductName}
          maxLength={50}
          multiline
          showCharCount
          currentLength={productName.length}
          warningText={productName.length >= 50 ? '상품명은 50자 이하로 입력해주세요' : false}
          containerStyle={styles.productNameLayout}
        />

        {/* 상품 가격 입력 레이아웃 */}
        <CommonInput
          label="가격"
          placeholder="가격을 입력해주세요"
          value={productPrice}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          warningText={isPriceOverLimit ? '가격은 10억원 이하로 입력해주세요' : false}
          containerStyle={styles.priceLayout}
        />

        {/* 상품 설명 입력 레이아웃 */}
        <CommonInput
          label="상품 설명"
          placeholder="상품 설명을 입력해주세요"
          value={productDescription}
          onChangeText={setProductDescription}
          maxLength={1500}
          multiline
          showCharCount
          currentLength={productDescription.length}
          warningText={productDescription.length >= 1500 ? '설명은 1500자 이하로 입력해주세요' : false}
          containerStyle={styles.descriptionLayout}
        />

        {/* 사용감 선택 레이아웃 */}
        <CommonDropdown
          label="사용감"
          value={selectedCondition}
          options={CONDITION_OPTIONS}
          placeholder="사용감 선택"
          isExpanded={isConditionExpanded}
          onToggle={() => setConditionExpanded(!isConditionExpanded)}
          onSelect={handleSelectCondition}
          containerStyle={styles.conditionLayout}
        />

        {/* 카테고리 선택 레이아웃 */}
        <CommonDropdown
          label="카테고리"
          value={selectedCategory}
          options={CATEGORY_OPTIONS}
          placeholder="카테고리 선택"
          isExpanded={isCategoryExpanded}
          onToggle={() => setCategoryExpanded(!isCategoryExpanded)}
          onSelect={handleSelectCategory}
          containerStyle={styles.categoryLayout}
        />

        {/* 판매상태 선택 레이아웃 */}
        <CommonDropdown
          label="판매상태"
          value={selectedStatus}
          options={STATUS_OPTIONS}
          placeholder="판매상태 선택"
          isExpanded={isStatusExpanded}
          onToggle={() => setStatusExpanded(!isStatusExpanded)}
          onSelect={handleSelectStatus}
          containerStyle={styles.statusLayout}
        />

        {/* 운영정책 동의 레이아웃 */}
        <View style={styles.policyLayout}>
          <TouchableOpacity
            style={styles.policyContainer}
            onPress={() => setIsPolicyAgreed(!isPolicyAgreed)}
            activeOpacity={0.8}
          >
            <Text style={[styles.policyText, isPolicyAgreed && styles.policyTextActive]}>
              키치캐치의 운영 정책을 확인하고 동의합니다
            </Text>
            <View style={[styles.radioButton, isPolicyAgreed && styles.radioButtonActive]}>
              {isPolicyAgreed && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* 상품 등록 버튼 */}
        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator/>
          ) : (
            <Text style={styles.submitButtonText}>상품등록</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* 최대 사진 수 초과 토스트 */}
      <Animated.View style={[styles.toastOverlay, { opacity: toastOpacity }]} pointerEvents="none">
        <Text style={styles.toastText}>사진은 최대 6장까지 선택 가능합니다.</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ProductRegistrationScreen;
