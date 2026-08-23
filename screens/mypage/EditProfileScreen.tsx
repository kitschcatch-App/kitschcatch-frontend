import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './EditProfileScreen.styles';
import { colors } from '../../styles/colors';
import BackIcon from '../../assets/back.svg';
import RegistrationIcon from '../../assets/registration.svg';
import CommonInput from '../../components/CommonInput';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

// TODO: 프로필 조회 API 연동 전까지 MyPageScreen과 동일한 목업 값 사용
const INITIAL_PROFILE = {
  userId: 'sleepyelephant',
  nickname: '졸린코끼리',
  bio: '원신, 하이큐 굿즈 모아요',
  profileImage: null as Asset | null,
};

const EditProfileScreen = ({ navigation }: Props) => {
  const [userId, setUserId] = useState(INITIAL_PROFILE.userId);
  const [nickname, setNickname] = useState(INITIAL_PROFILE.nickname);
  const [bio, setBio] = useState(INITIAL_PROFILE.bio);
  const [profileImage, setProfileImage] = useState<Asset | null>(INITIAL_PROFILE.profileImage);

  const isChanged =
    userId !== INITIAL_PROFILE.userId ||
    nickname !== INITIAL_PROFILE.nickname ||
    bio !== INITIAL_PROFILE.bio ||
    profileImage !== INITIAL_PROFILE.profileImage;
  const isValid = userId.trim().length > 0 && nickname.trim().length > 0;
  const canSave = isChanged && isValid;

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (result.didCancel || result.errorCode || !result.assets?.[0]) return;
    setProfileImage(result.assets[0]);
  };

  const handleSave = () => {
    if (!canSave) return;
    // TODO: 회원정보 수정 API 연동
    navigation.navigate('Mypage');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* //헤더 컨테이너 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Mypage')}>
          <BackIcon width={10} height={18} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원정보 수정</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* //프로필 이미지 컨테이너 */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>프로필 이미지</Text>
        <TouchableOpacity style={styles.profileImageWrapper} onPress={handlePickImage} activeOpacity={0.8}>
          <View style={styles.profileImage}>
            {profileImage?.uri && <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />}
          </View>
          <View style={styles.editBadge}>
            <RegistrationIcon width={22} height={22} />
          </View>
        </TouchableOpacity>
      </View>

      {/* //정보 수정 폼 */}
      <View style={styles.formSection}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            아이디<Text style={styles.requiredMark}> *</Text>
          </Text>
          <CommonInput
            value={userId}
            onChangeText={setUserId}
            placeholder="아이디를 입력해주세요"
            placeholderTextColor={colors.gray07}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            닉네임<Text style={styles.requiredMark}> *</Text>
          </Text>
          <CommonInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor={colors.gray07}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>한줄소개</Text>
          <CommonInput
            value={bio}
            onChangeText={setBio}
            placeholder="한줄소개를 입력해주세요"
            placeholderTextColor={colors.gray07}
            maxLength={24}
            showCharCount
            currentLength={bio.length}
          />
        </View>
      </View>

      {/* //저장 버튼 */}
      <TouchableOpacity
        style={[styles.saveButton, canSave && styles.saveButtonActive]}
        onPress={handleSave}
        activeOpacity={canSave ? 0.8 : 1}
      >
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
