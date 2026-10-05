/**
 * 화면: 리뷰 작성 화면 (ReviewWriteScreen)
 * 역할: 매장상세의 '리뷰 작성하기'를 눌렀을 때 진입하며, 리뷰 사진(최대 3장)을 첨부합니다.
 *       닫기(exit)를 누르면 매장상세 화면으로 돌아갑니다.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import SuccessView from '../../components/SuccessView';
import ExitIcon from '../../assets/exit.svg';
import CameraIcon from '../../assets/camera.svg';
import StarIcon from '../../assets/star.svg';
import StarGrayIcon from '../../assets/star-g.svg';
import { colors } from '../../styles/colors';
import { styles } from './ReviewWriteScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewWrite'>;

const MAX_PHOTOS = 3;
const MAX_REVIEW_LENGTH = 85;

const ReviewWriteScreen = ({ navigation }: Props) => {
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  // 별점과 리뷰 내용이 있어야 등록 가능 (사진은 선택)
  const canSubmit = rating > 0 && reviewText.trim().length > 0;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // 완료 팝업이 뜨고 800ms 뒤 이전 화면(매장상세)으로 이동
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => navigation.goBack(), 800);
    return () => clearTimeout(timer);
  }, [showSuccess, navigation]);

  const showLimitToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePickImage = async () => {
    if (selectedImages.length >= MAX_PHOTOS) {
      showLimitToast();
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_PHOTOS - selectedImages.length,
      quality: 0.8,
    });
    if (result.didCancel || result.errorCode || !result.assets) return;
    if (result.assets.length > MAX_PHOTOS - selectedImages.length) {
      showLimitToast();
    }
    setSelectedImages(prev => [...prev, ...result.assets!].slice(0, MAX_PHOTOS));
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title="리뷰작성"
        leftElement={
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="닫기"
          >
            <ExitIcon width={14} height={14} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.photoLayout}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScrollContent}
        >
          <TouchableOpacity style={styles.photoBox} onPress={handlePickImage}>
            <CameraIcon width={20} height={18} />
            <Text style={styles.photoCountText}>
              {selectedImages.length}/{MAX_PHOTOS}
            </Text>
          </TouchableOpacity>

          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {Array.from({
            length: Math.max(0, MAX_PHOTOS - selectedImages.length),
          }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.photoBox} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.ratingSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>별점등록</Text>
          <Text style={styles.ratingCountText}>({rating}/5)</Text>
        </View>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity
              key={n}
              activeOpacity={0.8}
              onPress={() => setRating(n)}
            >
              {n <= rating ? (
                <StarIcon width={40} height={40} />
              ) : (
                <StarGrayIcon width={40} height={40} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>리뷰</Text>
        <TextInput
          style={styles.reviewInput}
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="리뷰를 작성해주세요"
          placeholderTextColor={colors.gray06}
          maxLength={MAX_REVIEW_LENGTH}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.reviewLengthText}>
          {reviewText.length}/{MAX_REVIEW_LENGTH}
        </Text>
      </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, canSubmit && styles.submitButtonActive]}
        activeOpacity={0.8}
        disabled={!canSubmit}
        // ponytail: 리뷰 등록 API 미연동이라 저장 없이 완료 팝업만 노출. API 붙으면 성공 시점에 setShowSuccess.
        onPress={() => setShowSuccess(true)}
      >
        <Text
          style={[styles.submitText, canSubmit && styles.submitTextActive]}
        >
          리뷰 등록하기
        </Text>
      </TouchableOpacity>

      <SuccessView
        visible={showSuccess}
        title="리뷰등록이 완료되었습니다."
        onDismiss={() => setShowSuccess(false)}
      />

      <Animated.View
        style={[styles.toastOverlay, { opacity: toastOpacity }]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>
          사진은 최대 {MAX_PHOTOS}장까지 선택 가능합니다.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ReviewWriteScreen;
