/**
 * 화면: 상품 등록 화면 (ProductRegistrationScreen)
 * 역할: 사용자가 판매할 상품의 정보를 입력하고 등록하는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ExitIcon from '../assets/exit.svg'; // exit.svg 파일이 assets 폴더에 있다고 가정합니다.
import CameraIcon from '../assets/camera.svg';
import { styles } from './ProductRegistrationScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import CommonInput from '../components/CommonInput';
import CommonDropdown from '../components/CommonDropdown';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductRegistration'>;

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
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      {/* 입력 요소가 많아지므로 ScrollView로 감싸서 스크롤이 가능하게 변경하는 것을 권장합니다. */}
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
            {/* 사진 등록 버튼 (첫 번째 컨테이너) */}
            <TouchableOpacity style={styles.photoBox}>
              <CameraIcon width={20} height={18} />
              <Text style={styles.photoCountText}>0/6</Text>
            </TouchableOpacity>
            
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={styles.photoBox} />
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
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>상품등록</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductRegistrationScreen;
