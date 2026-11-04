/**
 * 화면: 1:1 문의하기 (InquiryScreen)
 * 역할: 고객센터에서 문의 유형·내용·사진(최대 3장)을 입력해 1:1 문의를 접수하는 화면입니다.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import CommonDropdown from '../../components/CommonDropdown';
import PhotoAttach from '../../components/PhotoAttach';
import ToggleSwitch from '../../components/ToggleSwitch';
import BouncingView from '../../components/BouncingView';
import { addInquiry } from '../../utils/inquiryStore';
import { colors } from '../../styles/colors';
import { styles } from './InquiryScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Inquiry'>;

const TYPE_PLACEHOLDER = '문의유형 선택';
const TYPE_OPTIONS = [
  '계정·로그인',
  '상품 / 거래',
  '주문·결제',
  '발송·배송',
  '취소·환불·반품',
  '정산',
  '거래 신고·분쟁',
  '채팅·알림',
  '개인정보·수신동의',
  '오류·기타',
];

// ponytail: 운영 요일·시간은 고객센터 정책 확정 전 임시 값. 확정되면 교체.
const SUPPORT_DAYS = '평일';
const SUPPORT_HOURS = '09:00~18:00';

const InquiryScreen = ({ navigation }: Props) => {
  const [type, setType] = useState(TYPE_PLACEHOLDER);
  const [isTypeExpanded, setTypeExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Asset[]>([]);
  const [answerAlarm, setAnswerAlarm] = useState(true);
  const [receiptNo, setReceiptNo] = useState<string | null>(null);

  // 문의 유형과 문의 내용이 필수
  const canSubmit = type !== TYPE_PLACEHOLDER && content.trim().length > 0;

  // ponytail: 1:1 문의 API 미정이라 접수번호는 임시로 생성. API 붙으면 응답의 문의번호를 사용.
  const handleSubmit = () => {
    const id = `INQ-${Date.now().toString().slice(-8)}`;
    addInquiry({ id, type, content: content.trim() });
    setReceiptNo(id);
  };

  if (receiptNo) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.doneContainer}>
          <BouncingView>
            <Image
              source={require('../../assets/report.png')}
              style={styles.doneImage}
              resizeMode="contain"
            />
          </BouncingView>
          <Text style={styles.doneTitle}>문의가 접수되었습니다.</Text>
          <Text style={styles.doneText}>
            {`접수번호는 ${receiptNo}예요.
답변은 문의내역에서 확인 가능합니다.`}
          </Text>
          <Text style={[styles.doneText, styles.doneNotice]}>
            {`고객센터는 ${SUPPORT_DAYS} ${SUPPORT_HOURS}에 운영합니다.
운영시간 외에 접수된 문의는 다음 운영일부터 순서대로 확인해요.`}
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="1:1 문의하기" onBack={() => navigation.goBack()} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.typeSection}>
          <Text style={styles.sectionTitle}>문의 유형</Text>
          <CommonDropdown
            label=""
            value={type}
            options={TYPE_OPTIONS}
            placeholder={TYPE_PLACEHOLDER}
            isExpanded={isTypeExpanded}
            onToggle={() => setTypeExpanded(v => !v)}
            onSelect={option => {
              setType(option);
              setTypeExpanded(false);
            }}
            containerStyle={styles.typeDropdown}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>문의 내용</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="문의 내용을 자세히 알려주세요. 거래 관련 문의라면 주문번호와 상품명을 함께 적어주시면 확인에 도움이 돼요."
            placeholderTextColor={colors.gray06}
            multiline
            textAlignVertical="top"
          />
        </View>

        <PhotoAttach
          images={images}
          onChange={setImages}
          notice="오류가 발생했다면 발생 시각, 이용 기기, 오류 화면을 첨부해 주세요. 비밀번호, 카드번호 전체, 주민등록번호는 입력하지 마세요."
        />

        <View style={styles.alarmSection}>
          <Text style={styles.sectionTitle}>답변알림</Text>
          <ToggleSwitch value={answerAlarm} onValueChange={setAnswerAlarm} />
        </View>
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
    </SafeAreaView>
  );
};

export default InquiryScreen;
