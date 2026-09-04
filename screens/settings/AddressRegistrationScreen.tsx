/**
 * 화면: 배송지 등록 (AddressRegistrationScreen)
 * 역할: 이름/연락처/우편번호/주소/상세주소를 입력받아 새 배송지를 등록하는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './AddressRegistrationScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import CommonInput from '../../components/CommonInput';
import SuccessView from '../../components/SuccessView';
import RadioOnIcon from '../../assets/radiobutton-on.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressRegistration'>;

const AddressRegistrationScreen = ({ navigation, route }: Props) => {
  const editingAddress = route.params?.address;
  const isEditMode = editingAddress !== undefined;

  const [name, setName] = useState(editingAddress?.name ?? '');
  const [phone, setPhone] = useState(editingAddress?.phone ?? '');
  const [zipCode, setZipCode] = useState(editingAddress?.zipCode ?? '');
  const [address, setAddress] = useState(editingAddress?.address ?? '');
  const [detailAddress, setDetailAddress] = useState(editingAddress?.detailAddress ?? '');
  const [isDefault, setIsDefault] = useState(editingAddress?.isDefault ?? false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const isFormValid =
    name.trim() !== '' &&
    phone.trim() !== '' &&
    zipCode.trim() !== '' &&
    address.trim() !== '' &&
    detailAddress.trim() !== '';

  const isChanged =
    !isEditMode ||
    name !== (editingAddress?.name ?? '') ||
    phone !== (editingAddress?.phone ?? '') ||
    zipCode !== (editingAddress?.zipCode ?? '') ||
    address !== (editingAddress?.address ?? '') ||
    detailAddress !== (editingAddress?.detailAddress ?? '') ||
    isDefault !== (editingAddress?.isDefault ?? false);

  const canSubmit = isFormValid && isChanged;

  const handleSearchZipCode = () => {
    // TODO: 우편번호 검색(다음 우편번호 API 등) 연동
  };

  const handleRegister = () => {
    if (!canSubmit) return;
    // TODO: 배송지 등록/수정 API 연동
    setSuccessVisible(true);
    setTimeout(() => {
      navigation.goBack();
    }, 800);
  };

  const handleSuccessDismiss = () => {
    setSuccessVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title={isEditMode ? '배송지 수정' : '배송지 등록'}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <Text style={styles.label}>이름</Text>
            <CommonInput
              value={name}
              onChangeText={setName}
              placeholder="받는이의 이름 입력"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>연락처</Text>
            <CommonInput
              value={phone}
              onChangeText={setPhone}
              placeholder="연락처를 입력"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>우편번호</Text>
            <View style={styles.zipRow}>
              <CommonInput
                containerStyle={styles.zipInput}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="우편번호 검색"
              />
              <TouchableOpacity
                style={styles.searchButton}
                activeOpacity={0.8}
                onPress={handleSearchZipCode}
              >
                <Text style={styles.searchButtonText}>조회</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>주소</Text>
            <CommonInput
              value={address}
              onChangeText={setAddress}
              placeholder="우편번호 검색시 자동입력"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>상세주소</Text>
            <CommonInput
              value={detailAddress}
              onChangeText={setDetailAddress}
              placeholder="동/호수 입력"
            />
          </View>

          <TouchableOpacity
            style={styles.defaultRow}
            activeOpacity={0.7}
            onPress={() => setIsDefault((prev) => !prev)}
          >
            {isDefault ? (
              <RadioOnIcon width={20} height={20} />
            ) : (
              <View style={styles.radioOff} />
            )}
            <Text style={styles.defaultText}>기본배송지로 설정</Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[styles.registerButton, !canSubmit && styles.registerButtonDisabled]}
          activeOpacity={canSubmit ? 0.8 : 1}
          onPress={handleRegister}
        >
          <Text
            style={[styles.registerButtonText, !canSubmit && styles.registerButtonTextDisabled]}
          >
            등록하기
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <SuccessView
        visible={isSuccessVisible}
        title={isEditMode ? '배송지 수정이 완료되었습니다.' : '배송지 등록이 완료되었습니다.'}
        onDismiss={handleSuccessDismiss}
      />
    </SafeAreaView>
  );
};

export default AddressRegistrationScreen;
