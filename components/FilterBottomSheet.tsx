/**
 * 컴포넌트: 필터 바텀 시트 (FilterBottomSheet)
 * 역할: 상품 목록 화면에서 필터 버튼을 눌렀을 때 나타나는 하단 모달창입니다.
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './FilterBottomSheet.styles';
import { colors } from '../styles/colors';

export type FilterState = {
  sort: string;
  isOnSaleOnly: boolean;
  minPrice: string;
  maxPrice: string;
  conditions: string[];
};

interface Props {
  visible: boolean;
  onClose: () => void;
  filterState: FilterState;
  onApply: (filters: FilterState) => void;
}

const FilterBottomSheet = ({ visible, onClose, filterState, onApply }: Props) => {
  const insets = useSafeAreaInsets();
  const sortOptions = ['추천순', '최신순', '가격 높은 순', '가격 낮은 순'];
  const [selectedSort, setSelectedSort] = useState('추천순');
  const [isOnSaleOnly, setIsOnSaleOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const conditionOptions = [
    { label: '새상품', value: 'NEW' },
    { label: '사용감 적음', value: 'LIKE_NEW' },
    { label: '사용감 있음', value: 'USED' },
    { label: '사용감 많음', value: 'DAMAGED' },
  ];
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (value: string) => {
    setSelectedConditions((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  // 가격 입력 시 3자리마다 콤마(,) 자동 추가 함수
  const formatPrice = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    if (numericText === '') return '';
    const noLeadingZeros = parseInt(numericText, 10).toString(); // 앞의 불필요한 0 제거
    return noLeadingZeros.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 애니메이션을 위한 값
  const toggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: isOnSaleOnly ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOnSaleOnly, toggleAnim]);

  useEffect(() => {
    if (visible) {
      setSelectedSort(filterState.sort);
      setIsOnSaleOnly(filterState.isOnSaleOnly);
      setMinPrice(filterState.minPrice);
      setMaxPrice(filterState.maxPrice);
      setSelectedConditions(filterState.conditions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // 배경색 부드럽게 전환
  const toggleTrackColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5E5', colors.main01]
  });

  // 동그라미(Thumb) 좌우 이동
  const toggleThumbPosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28]
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* 뒷배경(오버레이) 터치 시 모달 닫힘 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* 내부 콘텐츠 터치 시 모달 닫히지 않도록 이벤트 전파 방지 */}
          <TouchableWithoutFeedback>
            <View style={[styles.bottomSheetContainer, { paddingBottom: Math.max(insets.bottom + 15, 40) }]}>
              {/* 상단 핸들 손잡이 */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              <View style={styles.header}>
                <Text style={styles.title}>정렬</Text>
              </View>
              
              {/* 정렬 필터 항목 */}
              <View style={styles.optionsContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton, 
                      selectedSort === option && styles.optionButtonActive,
                      { flex: option.includes('가격') ? 1.3 : 1 }
                    ]}
                    onPress={() => setSelectedSort(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, selectedSort === option && styles.optionTextActive]} numberOfLines={2}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 판매중만 보기 토글 영역 */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>판매중만 보기</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setIsOnSaleOnly((prev) => !prev)}>
                  <Animated.View style={[styles.customToggleTrack, { backgroundColor: toggleTrackColor }]}>
                    <Animated.View style={[styles.customToggleThumb, { transform: [{ translateX: toggleThumbPosition }] }]} />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {/* 가격 입력 영역 */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>가격</Text>
                <View style={styles.priceInputContainer}>
                  <View style={styles.priceInputWrapper}>
                    <TextInput
                      style={styles.priceInput}
                      value={minPrice}
                      onChangeText={(text) => setMinPrice(formatPrice(text))}
                      placeholder="0"
                      placeholderTextColor={colors.gray05}
                      keyboardType="numeric"
                    />
                    <Text style={styles.priceUnit}>원</Text>
                  </View>
                  <Text style={styles.priceDash}>-</Text>
                  <View style={styles.priceInputWrapper}>
                    <TextInput
                      style={styles.priceInput}
                      value={maxPrice}
                      onChangeText={(text) => setMaxPrice(formatPrice(text))}
                      placeholder="100,000,000"
                      placeholderTextColor={colors.gray05}
                      keyboardType="numeric"
                    />
                    <Text style={styles.priceUnit}>원</Text>
                  </View>
                </View>
              </View>

              {/* 사용감 선택 영역 */}
              <View style={styles.conditionContainer}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionLabel}>사용감</Text>
                  <Text style={styles.conditionSubLabel}>중복선택가능</Text>
                </View>
                <View style={styles.conditionOptionsContainer}>
                  {conditionOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        selectedConditions.includes(option.value) && styles.optionButtonActive,
                        { paddingHorizontal: 16 }
                      ]}
                      onPress={() => toggleCondition(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.optionText, selectedConditions.includes(option.value) && styles.optionTextActive]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 선택완료 버튼 */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  onApply({ sort: selectedSort, isOnSaleOnly, minPrice, maxPrice, conditions: selectedConditions });
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>선택완료</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterBottomSheet;