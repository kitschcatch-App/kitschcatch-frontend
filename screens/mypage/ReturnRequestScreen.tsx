/**
 * 화면: 반품요청 화면 (ReturnRequestScreen)
 * 역할: 구매자가 반품 사유·문의 내용·사진(최대 3장)을 입력해 환불(반품)을 요청하는 화면입니다.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { orderAPI } from '../../api/apiClient';
import ScreenHeader from '../../components/ScreenHeader';
import PhotoAttach from '../../components/PhotoAttach';
import CommonDropdown from '../../components/CommonDropdown';
import SuccessView from '../../components/SuccessView';
import { colors } from '../../styles/colors';
import { styles } from './ReturnRequestScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ReturnRequest'>;

const REASON_PLACEHOLDER = '반품사유 선택';
const REASON_OPTIONS = [
  '상품 설명과 다름',
  '상품에 문제가 있음',
  '오배송',
  '기타',
];
const MAX_CONTENT_LENGTH = 150;

const ReturnRequestScreen = ({ navigation, route }: Props) => {
  const { orderId, amount } = route.params;
  const [reason, setReason] = useState(REASON_PLACEHOLDER);
  const [isReasonExpanded, setReasonExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Asset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 반품 사유와 문의 내용이 필수
  const canSubmit =
    reason !== REASON_PLACEHOLDER && content.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 사진 업로드(URL 발급 → PUT → 완료) 후 imageIds를 환불 요청에 포함
      let imageIds: number[] | undefined;
      if (images.length > 0) {
        const files = images.map((a, i) => ({
          fileName: a.fileName ?? `refund-${i}.jpg`,
          contentType: a.type ?? 'image/jpeg',
          fileSize: a.fileSize ?? 1,
        }));
        const res = await orderAPI.getRefundImageUploadUrls(orderId, files);
        const uploads: { imageId: number; uploadUrl: string; headers?: Record<string, string> }[] =
          res.data.data.images;
        await Promise.all(
          uploads.map(async (u, i) => {
            const blob = await (await fetch(images[i].uri!)).blob();
            const put = await fetch(u.uploadUrl, {
              method: 'PUT',
              body: blob,
              headers: u.headers ?? { 'Content-Type': files[i].contentType },
            });
            if (!put.ok) throw new Error('반품 사진 업로드 실패');
            await orderAPI.completeRefundImage(orderId, u.imageId);
          }),
        );
        imageIds = uploads.map(u => u.imageId);
      }
      await orderAPI.requestRefund(
        orderId,
        amount,
        `[${reason}] ${content.trim()}`,
        imageIds,
      );
      setShowSuccess(true);
    } catch (e: any) {
      console.error('반품 요청 실패:', e);
      const code = e?.response?.data?.error?.code;
      Alert.alert(
        '반품요청',
        code?.startsWith('REFUND') || code?.startsWith('ORDER')
          ? '현재 상태에서는 처리할 수 없는 주문이에요.'
          : '처리 중 오류가 발생했어요. 다시 시도해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="반품요청" onBack={() => navigation.goBack()} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reasonSection}>
          <Text style={styles.sectionTitle}>반품사유</Text>
          <CommonDropdown
            label=""
            value={reason}
            options={REASON_OPTIONS}
            placeholder={REASON_PLACEHOLDER}
            isExpanded={isReasonExpanded}
            onToggle={() => setReasonExpanded(v => !v)}
            onSelect={option => {
              setReason(option);
              setReasonExpanded(false);
            }}
            containerStyle={styles.reasonDropdown}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>문의 내용</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="반품 사유와 상품 상태를 자세히 입력해주세요."
            placeholderTextColor={colors.gray06}
            maxLength={MAX_CONTENT_LENGTH}
            multiline
            textAlignVertical="top"
          />
        </View>

        <PhotoAttach
          images={images}
          onChange={setImages}
          notice="상품 상태 및 오류를 확인할 수 있는 사진을 첨부해주세요."
        />
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, canSubmit && styles.submitButtonActive]}
        activeOpacity={0.8}
        disabled={!canSubmit}
        onPress={handleSubmit}
      >
        <Text style={[styles.submitText, canSubmit && styles.submitTextActive]}>
          문의하기
        </Text>
      </TouchableOpacity>

      <SuccessView
        visible={showSuccess}
        title={
          '판매자에게 반품 요청이 전달되었습니다.\n반품 처리가 완료되면 알려드릴게요.'
        }
        onDismiss={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default ReturnRequestScreen;
