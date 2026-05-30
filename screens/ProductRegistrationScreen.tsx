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
import { MOCK_PRESIGNED_URLS, MOCK_CREATE_POST, mockDelay } from '../api/mockData';
import { uploadImagesToS3 } from '../utils/uploadImages';
import { useMockMode } from '../contexts/MockModeContext';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductRegistration'>;

// 한글 드롭다운 옵션을 백엔드 ProductCondition enum 값으로 변환하는 매핑 객체
const CONDITION_MAP: Record<string, string> = {
  '새상품': 'NEW',
  '사용감 적음': 'LIKE_NEW',
  '사용감 있음': 'USED',
  '사용감 많음': 'DAMAGED',
};

// 명세서 4.1: 백엔드는 한글 라벨 값으로 직렬화/역직렬화합니다.
// 예시: "productCategory": "굿즈" → 변환 없이 한글 그대로 전송해야 합니다.

const ProductRegistrationScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { isMockMode } = useMockMode();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('사용감 선택');
  const [isConditionExpanded, setConditionExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('카테고리 선택');
  const [isCategoryExpanded, setCategoryExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const CONDITION_OPTIONS = ['새상품', '사용감 적음', '사용감 있음', '사용감 많음'];
  const CATEGORY_OPTIONS = ['애니/만화', '게임', '굿즈', '코스프레', '서적', '음반/영상', '기타'];

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

  // 상품 등록 핸들러 (Mock / Real 모드 공통)
  const handleSubmit = async () => {
    // ── 공통 유효성 검사 ────────────────────────────────────────────────────
    if (!productName || !productPrice || !productDescription) {
      Alert.alert('알림', '필수 입력 항목을 모두 채워주세요.');
      return;
    }
    if (selectedCondition === '사용감 선택' || selectedCategory === '카테고리 선택') {
      Alert.alert('알림', '드롭다운 항목을 모두 선택해주세요.');
      return;
    }
    if (!isPolicyAgreed) {
      Alert.alert('알림', '운영 정책에 동의해주세요.');
      return;
    }
    if (selectedImages.length === 0) {
      Alert.alert('알림', '상품 사진을 1장 이상 등록해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      if (isMockMode) {
        // ── Mock 모드: 가상 데이터로 등록 시뮬레이션 ──────────────────────
        await mockDelay(600 + Math.random() * 400);
        // Presigned URL 발급 시뮬레이션 (실제 업로드 없음)
        const mockImageKeys = selectedImages.map((_, i) =>
          MOCK_PRESIGNED_URLS.data.data.images[0]?.imageKey ?? `products/mock-key-${i}.jpg`
        );
        console.log('[Mock] 등록 데이터:', {
          title: productName,
          price: productPrice,
          productCategory: selectedCategory,
          productCondition: CONDITION_MAP[selectedCondition],
          imageKeys: mockImageKeys,
          mockPostId: MOCK_CREATE_POST.data.data.id,
        });
        Alert.alert(
          '🧪 Mock 등록 성공',
          `"${productName}" 상품이 가상으로 등록되었습니다.\n(Mock ID: ${MOCK_CREATE_POST.data.data.id})`,
          [{ text: '확인', onPress: () => navigation.goBack() }],
        );
      } else {
        // ── Real 모드: 실제 백엔드 API 호출 ───────────────────────────────
        // 1. Presigned URL 발급
        const requestPayload = selectedImages.map((img, index) => ({
          originalFileName: img.fileName || `image_${Date.now()}_${index}.jpg`,
          contentType: img.type || 'image/jpeg',
        }));
        const presignedRes = await productAPI.getPresignedUrls(requestPayload);
        if (!presignedRes.data?.success) {
          throw new Error('Presigned URL 발급에 실패했습니다.');
        }
        const presignedDataList = presignedRes.data.data.images;

        // 2. S3 이미지 업로드 (병렬)
        const uploadedImageKeys = await uploadImagesToS3(selectedImages, presignedDataList);

        // 3. 상품 등록
        const requestData = {
          title: productName,
          description: productDescription,
          price: Number(productPrice.replace(/,/g, '')),
          productCategory: selectedCategory,
          productCondition: CONDITION_MAP[selectedCondition] || 'NEW',
          imageKeys: uploadedImageKeys,
        };
        const response = await productAPI.createPost(requestData);
        if (response.data?.success) {
          Alert.alert('성공', '상품이 성공적으로 등록되었습니다.', [
            { text: '확인', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('오류', '상품 등록에 실패했습니다. (서버 응답 오류)');
        }
      }
    } catch (error: any) {
      const errorData = error.response?.data
        ? (typeof error.response.data === 'object'
            ? JSON.stringify(error.response.data, null, 2)
            : error.response.data)
        : error.message ?? '알 수 없는 오류';
      console.error('상품 등록 에러:', errorData);
      Alert.alert('오류', `상품 등록 중 문제가 발생했습니다.\n\n${errorData}`);
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
          <View style={styles.headerIconPlaceholder} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.headerTitle}>상품등록</Text>
            {isMockMode && (
              <View style={{
                backgroundColor: 'rgba(70,201,178,0.85)',
                paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
              }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>🧪 Mock</Text>
              </View>
            )}
          </View>

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
