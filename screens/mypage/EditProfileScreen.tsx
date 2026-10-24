import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './EditProfileScreen.styles';
import { userAPI } from '../../api/apiClient';
import { uploadProfileImage } from '../../utils/uploadProfileImage';
import { colors } from '../../styles/colors';
import RegistrationIcon from '../../assets/registration.svg';
import CommonInput from '../../components/CommonInput';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const NICKNAME_MAX_LENGTH = 12;

const EMPTY_PROFILE = { userId: '', nickname: '', bio: '', profileImageUrl: null as string | null };

const EditProfileScreen = ({ navigation }: Props) => {
  const [initial, setInitial] = useState(EMPTY_PROFILE);
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<Asset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    userAPI
      .getMe()
      .then(res => {
        const me = res.data.data;
        setInitial({ userId: me.username, nickname: me.nickname, bio: me.bio ?? '', profileImageUrl: me.profileImageUrl ?? null });
        setUserId(me.username);
        setNickname(me.nickname);
        setBio(me.bio ?? '');
      })
      .catch(e => console.error('프로필 조회 실패:', e));
  }, []);

  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [isDuplicateAvailable, setIsDuplicateAvailable] = useState(false);
  // 서버 응답을 받은 상태 (사용 가능/불가 무관). 닉네임을 다시 수정하기 전까지 버튼 비활성
  const [isCheckDone, setIsCheckDone] = useState(false);

  const isChanged = nickname !== initial.nickname || bio !== initial.bio || profileImage !== null;
  const isNicknameChanged = nickname.trim() !== initial.nickname;
  const canSave =
    !isSaving && isChanged && nickname.trim().length > 0 && (!isNicknameChanged || isDuplicateChecked);

  const handleChangeNickname = (text: string) => {
    setNickname(text);
    // 닉네임을 다시 수정하면 이전 중복확인 결과는 무효화
    setIsDuplicateChecked(false);
    setIsDuplicateAvailable(false);
    setIsCheckDone(false);
    setDuplicateMessage('');
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (result.didCancel || result.errorCode || !result.assets?.[0]) return;
    setProfileImage(result.assets[0]);
  };

  const handleCheckDuplicate = async () => {
    if (isCheckingDuplicate) return;

    const trimmed = nickname.trim();
    if (!trimmed) {
      setIsDuplicateChecked(false);
      setIsDuplicateAvailable(false);
      setDuplicateMessage('닉네임을 입력해주세요');
      return;
    }

    if (trimmed === initial.nickname) {
      setIsDuplicateChecked(true);
      setIsDuplicateAvailable(true);
      setIsCheckDone(true);
      setDuplicateMessage('현재 사용중인 닉네임입니다');
      return;
    }

    setIsCheckingDuplicate(true);
    setDuplicateMessage('');
    try {
      const res = await userAPI.checkNicknameAvailability(trimmed);
      const isAvailable = !!res.data?.data?.available;
      setIsDuplicateChecked(isAvailable);
      setIsDuplicateAvailable(isAvailable);
      setIsCheckDone(true);
      setDuplicateMessage(isAvailable ? '사용할 수 있는 닉네임이에요.' : '이미 사용중인 닉네임입니다');
    } catch {
      setIsDuplicateChecked(false);
      setIsDuplicateAvailable(false);
      setDuplicateMessage('중복확인 중 오류가 발생했어요. 다시 시도해주세요');
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      const profileImageKey = profileImage ? await uploadProfileImage(profileImage) : undefined;
      await userAPI.updateProfile({
        nickname: nickname.trim(),
        bio,
        profileImageKey,
      });
      navigation.navigate('Mypage');
    } catch (err: any) {
      const code = err.response?.data?.error?.code;
      const message =
        code === 'USER_004'
          ? '이미 사용 중인 닉네임이에요.'
          : code === 'COMMON_001'
            ? '입력한 정보가 올바르지 않아요.'
            : '저장 중 오류가 발생했어요. 다시 시도해주세요.';
      Alert.alert('회원정보 수정', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="회원정보 수정" onBack={() => navigation.navigate('Mypage')} style={styles.header} />

      {/* //프로필 이미지 컨테이너 */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>프로필 이미지</Text>
        <TouchableOpacity style={styles.profileImageWrapper} onPress={handlePickImage} activeOpacity={0.8}>
          <View style={styles.profileImage}>
            {(profileImage?.uri || initial.profileImageUrl) && (
              <Image source={{ uri: profileImage?.uri ?? initial.profileImageUrl! }} style={styles.profileImage} />
            )}
          </View>
          <View style={styles.editBadge}>
            <RegistrationIcon width={22} height={22} />
          </View>
        </TouchableOpacity>
      </View>

      {/* //정보 수정 폼 */}
      <View style={styles.formSection}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>아이디</Text>
          <CommonInput
            value={userId}
            editable={false}
            style={styles.disabledInputText}
          />
          <Text style={styles.idGuideText}>아이디는 설정 후 변경할 수 없어요. 신중하게 입력해 주세요.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            닉네임<Text style={styles.requiredMark}> *</Text>
          </Text>
          <View style={styles.inputRow}>
            <CommonInput
              containerStyle={styles.inputContainer}
              value={nickname}
              onChangeText={handleChangeNickname}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor={colors.gray07}
              maxLength={NICKNAME_MAX_LENGTH}
              warningText={duplicateMessage}
              warningTextStyle={[styles.duplicateMessageText, isDuplicateAvailable && styles.duplicateSuccessText]}
            />
            <View style={styles.duplicateColumn}>
              <TouchableOpacity
                style={[
                  styles.duplicateButton,
                  isCheckingDuplicate && styles.duplicateButtonDisabled,
                  isCheckDone && styles.duplicateButtonDone,
                ]}
                onPress={handleCheckDuplicate}
                activeOpacity={0.8}
                disabled={isCheckingDuplicate || isCheckDone}
              >
                <Text style={[styles.duplicateButtonText, isCheckDone && styles.duplicateButtonTextDone]}>
                  {isCheckingDuplicate ? '확인 중...' : '중복확인'}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.nicknameCounter, nickname.length >= NICKNAME_MAX_LENGTH && styles.nicknameCounterMax]}>
                {`${nickname.length}/${NICKNAME_MAX_LENGTH}`}
              </Text>
            </View>
          </View>
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
