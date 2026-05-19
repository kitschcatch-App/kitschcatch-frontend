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

type Props = NativeStackScreenProps<RootStackParamList, 'ProductEdit'>;

const CONDITION_MAP: Record<string, string> = {
  '새상품': 'NEW',
  '사용감 적음': 'LIKE_NEW',
  '사용감 있음': 'USED',
  '사용감 많음': 'HEAVILY_USED',
};
const CONDITION_DISPLAY_MAP: Record<string, string> = {
  'NEW': '새상품',
  'LIKE_NEW': '사용감 적음',
  'USED': '사용감 있음',
  'HEAVILY_USED': '사용감 많음',
};

const CATEGORY_MAP: Record<string, string> = {
  '애니 / 만화': 'ANIME_MANGA',
  '게임': 'GAME',
  '굿즈': 'GOODS',
  '코스프레': 'COSPLAY',
  '서적': 'BOOK',
  '음반 / 영상': 'MEDIA',
  '기타': 'ETC',
  '피규어': 'FIGURE',
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

const STATUS_MAP: Record<string, string> = {
  '판매중': 'ON_SALE',
  '예약중': 'RESERVED',
  '판매완료': 'SOLD_OUT',
};
const STATUS_DISPLAY_MAP: Record<string, string> = {
  'ON_SALE': '판매중',
  'RESERVED': '예약중',
  'SOLD_OUT': '판매완료',
};

const CONDITION_OPTIONS = ['새상품', '사용감 적음', '사용감 있음', '사용감 많음'];
const CATEGORY_OPTIONS = ['애니 / 만화', '게임', '굿즈', '코스프레', '서적', '음반 / 영상', '기타', '피규어'];
const STATUS_OPTIONS = ['판매중', '예약중', '판매완료'];

const ProductEditScreen = ({ route, navigation }: Props) => {
  const { postId, title, description, price, imageURL, productCategory, productCondition, productStatus, sellerId } = route.params;
  const insets = useSafeAreaInsets();

  const [productName, setProductName] = useState(title);
  const [productPrice, setProductPrice] = useState(price.toLocaleString());
  const [productDescription, setProductDescription] = useState(description);
  const [selectedCondition, setSelectedCondition] = useState(CONDITION_DISPLAY_MAP[productCondition] || '사용감 선택');
  const [isConditionExpanded, setConditionExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_DISPLAY_MAP[productCategory] || '카테고리 선택');
  const [isCategoryExpanded, setCategoryExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_DISPLAY_MAP[productStatus] || '판매상태 선택');
  const [isStatusExpanded, setStatusExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  const handlePriceChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText === '') {
      setProductPrice('');
      return;
    }
    const noLeadingZeros = parseInt(numericText, 10).toString();
    const formattedPrice = noLeadingZeros.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setProductPrice(formattedPrice);
  };

  const isPriceOverLimit = Number(productPrice.replace(/,/g, '')) > 1000000000;

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

  const handleSubmit = async () => {
    if (!productName || !productPrice || !productDescription) {
      Alert.alert('알림', '필수 입력 항목을 모두 채워주세요.');
      return;
    }
    if (selectedCondition === '사용감 선택' || selectedCategory === '카테고리 선택' || selectedStatus === '판매상태 선택') {
      Alert.alert('알림', '드롭다운 항목을 모두 선택해주세요.');
      return;
    }

    setIsLoading(true);

    const requestData = [{
      postid: postId,
      sellerId,
      title: productName,
      description: productDescription,
      price: productPrice,
      imageURL: selectedImages.length > 0 ? selectedImages[0].uri! : imageURL,
      productCategory: CATEGORY_MAP[selectedCategory] || productCategory,
      productCondition: CONDITION_MAP[selectedCondition] || productCondition,
      productStatus: STATUS_MAP[selectedStatus] || productStatus,
    }];

    try {
      const response = await productAPI.updatePost(postId, requestData);
      if (response.status === 200 || response.status === 201) {
        Alert.alert('성공', '상품이 수정되었습니다.', [{ text: '확인', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('오류', '상품 수정에 실패했습니다. (서버 응답 오류)');
      }
    } catch (error) {
      console.error('수정 API 에러:', error);
      console.log('가상 백엔드로 전송된 데이터:', JSON.stringify(requestData, null, 2));
      Alert.alert('성공(가상)', '상품이 수정되었습니다.', [{ text: '확인', onPress: () => navigation.goBack() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 */}
        <View style={styles.headerContainer}>
          <View style={styles.headerIconPlaceholder} />
          <Text style={styles.headerTitle}>상품수정</Text>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <ExitIcon width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* 상품 사진 */}
        <View style={styles.photoLayout}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoScrollView}
            contentContainerStyle={styles.photoScrollContent}
          >
            <TouchableOpacity style={styles.photoBox} onPress={handlePickImage}>
              <CameraIcon width={20} height={18} />
              <Text style={styles.photoCountText}>
                {selectedImages.length > 0
                  ? selectedImages.length
                  : imageURL && imageURL !== 'string' ? 1 : 0}/6
              </Text>
            </TouchableOpacity>

            {/* 기존 이미지 미리보기 (새 이미지를 선택하지 않은 경우) */}
            {selectedImages.length === 0 && imageURL && imageURL !== 'string' && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: imageURL }} style={styles.selectedImage} />
              </View>
            )}

            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveImage(index)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {Array.from({ length: Math.max(0, 5 - selectedImages.length) }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.photoBox} />
            ))}
          </ScrollView>
        </View>

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

        <CommonInput
          label="가격"
          placeholder="가격을 입력해주세요"
          value={productPrice}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          warningText={isPriceOverLimit ? '가격은 10억원 이하로 입력해주세요' : false}
          containerStyle={styles.priceLayout}
        />

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

        <CommonDropdown
          label="사용감"
          value={selectedCondition}
          options={CONDITION_OPTIONS}
          placeholder="사용감 선택"
          isExpanded={isConditionExpanded}
          onToggle={() => setConditionExpanded(!isConditionExpanded)}
          onSelect={(option) => { setSelectedCondition(option); setConditionExpanded(false); }}
          containerStyle={styles.conditionLayout}
        />

        <CommonDropdown
          label="카테고리"
          value={selectedCategory}
          options={CATEGORY_OPTIONS}
          placeholder="카테고리 선택"
          isExpanded={isCategoryExpanded}
          onToggle={() => setCategoryExpanded(!isCategoryExpanded)}
          onSelect={(option) => { setSelectedCategory(option); setCategoryExpanded(false); }}
          containerStyle={styles.categoryLayout}
        />

        <CommonDropdown
          label="판매상태"
          value={selectedStatus}
          options={STATUS_OPTIONS}
          placeholder="판매상태 선택"
          isExpanded={isStatusExpanded}
          onToggle={() => setStatusExpanded(!isStatusExpanded)}
          onSelect={(option) => { setSelectedStatus(option); setStatusExpanded(false); }}
          containerStyle={styles.statusLayout}
        />

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.submitButtonText}>수정완료</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Animated.View style={[styles.toastOverlay, { opacity: toastOpacity }]} pointerEvents="none">
        <Text style={styles.toastText}>사진은 최대 6장까지 선택 가능합니다.</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ProductEditScreen;
