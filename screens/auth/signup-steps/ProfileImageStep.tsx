/**
 * 컴포넌트: 회원가입 - 프로필 사진 등록 스텝 (ProfileImageStep)
 * 역할: SignUpScreen 3번째 스텝에서 프로필 사진을 선택합니다 (선택 입력, 건너뛰기 가능).
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import CameraIcon from '../../../assets/registration.svg';
import { styles } from '../SignUpScreen.styles';

interface Props {
  value: Asset | null;
  onChange: (value: Asset | null) => void;
  showError?: boolean;
}

const ProfileImageStep = ({ value, onChange, showError }: Props) => {
  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (result.didCancel || result.errorCode || !result.assets?.[0]) return;
    onChange(result.assets[0]);
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepGuideText}>프로필이미지를 등록해주세요!</Text>
      <TouchableOpacity style={styles.profileImageWrapper} onPress={handlePickImage} activeOpacity={0.8}>
        <View style={[styles.profileImageCircle, showError && styles.inputError]}>
          {value?.uri && <Image source={{ uri: value.uri }} style={styles.profileImage} />}
        </View>
        <View style={styles.cameraBadge}>
          <CameraIcon width={20} height={20} />
        </View>
      </TouchableOpacity>
      {showError && <Text style={styles.stepWarningText}>프로필 이미지를 등록해주세요</Text>}
    </View>
  );
};

export default ProfileImageStep;
