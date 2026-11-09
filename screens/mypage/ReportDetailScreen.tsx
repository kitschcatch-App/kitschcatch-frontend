/**
 * 화면: 신고 상세 내용 입력 (ReportDetailScreen)
 * 역할: 신고하기 화면에서 사유를 고른 뒤 '다음'을 눌렀을 때, 구체적인 신고 내용을 입력하는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './ReportDetailScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import { reportAPI, userAPI } from '../../api/apiClient';
import BouncingView from '../../components/BouncingView';
import { colors } from '../../styles/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportDetail'>;

const ReportDetailScreen = ({ navigation, route }: Props) => {
  const isProduct = route.params.target === 'product';
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = content.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    const { targetType, targetId, reasonCode, alsoBlock, userId } = route.params;
    setSubmitting(true);
    try {
      await reportAPI.create({ targetType, targetId, reasonCode, description: content.trim() });
    } catch (e) {
      console.error('신고 접수 실패:', e);
      Alert.alert('신고하기', '신고를 접수하지 못했어요. 다시 시도해주세요.');
      setSubmitting(false);
      return;
    }
    // '신고하고 차단하기'로 들어온 경우 신고가 접수된 뒤 차단까지 진행 (차단 실패해도 신고는 완료)
    if (alsoBlock) await userAPI.blockUser(userId).catch(e => console.error('사용자 차단 실패:', e));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.doneContainer}>
          <BouncingView>
            <Image source={require('../../assets/report.png')} style={styles.doneImage} resizeMode="contain" />
          </BouncingView>
          <Text style={styles.doneTitle}>{isProduct ? '신고가 접수되었습니다.' : '사용자 신고가 접수되었습니다.'}</Text>
          <Text style={styles.doneDescription}>
            {isProduct
              ? '제출하신 내용과 관련 자료를 검토하겠습니다.\n검토 결과에 따라 상품이 비공개되거나 판매자가\n이용 제한을 받을 수 있습니다.'
              : '채팅과 거래기록을 확인한 후 운영정책에 따라 조치하겠습니다.\n개인정보 보호를 위해 구체적인 제재 결과는\n안내되지 않을 수 있습니다.'}
          </Text>
          <TouchableOpacity style={styles.homeButton} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.submitButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="신고하기" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.title}>상세 내용 입력</Text>
          <Text style={styles.subtitle}>신고 사유를 확인할 수 있도록 구체적인 내용을 작성해 주세요.</Text>
        </View>

        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder="신고내용을 작성하세요"
          placeholderTextColor={colors.gray06}
          multiline
          underlineColorAndroid="transparent"
        />

        <View style={styles.noticeContainer}>
          <Text style={styles.noticeDot}>•</Text>
          <Text style={styles.noticeText}>
            전화번호, 주소 등 불필요한 개인정보는 입력하지 마세요. 필요한 경우 사진이나 거래 증빙을 첨부할 수 있습니다.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          activeOpacity={0.7}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}>신고하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportDetailScreen;
