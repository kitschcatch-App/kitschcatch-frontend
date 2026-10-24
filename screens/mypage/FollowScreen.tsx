import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './FollowScreen.styles';
import { userAPI } from '../../api/apiClient';
import ExitIcon from '../../assets/exit.svg';
import ConfirmView from '../../components/ConfirmView';
import CommonPopup from '../../components/CommonPopup';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import TabBar from '../../components/TabBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Follow'>;

type TabType = 'follower' | 'following';

type FollowUser = { id: number; nickname: string; profileImageUrl?: string | null };

// ponytail: 각 목록 최대 100명만 조회. 무한 스크롤은 목록이 길어지면 추가.
const PAGE_SIZE = 100;

const FollowScreen = ({ navigation, route }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>(route.params?.initialTab ?? 'follower');
  const [followerList, setFollowerList] = useState<FollowUser[]>([]);
  const [followingList, setFollowingList] = useState<FollowUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteCompleteVisible, setDeleteCompleteVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const myId = (await userAPI.getMe()).data.data.id;
        const [followers, followings] = await Promise.all([
          userAPI.getFollowers(myId, 0, PAGE_SIZE),
          userAPI.getFollowings(myId, 0, PAGE_SIZE),
        ]);
        setFollowerList(followers.data.data.content);
        setFollowingList(followings.data.data.content);
      } catch (e) {
        console.error('팔로우 목록 조회 실패:', e);
      }
    };
    load();
  }, []);

  // 내가 팔로우 중인 사용자 id. 팔로워 중 이미 맞팔로우한 사람 구분에 사용
  const followingIds = new Set(followingList.map(user => user.id));

  // 삭제 = 언팔로우. 팔로워 탭에서도 내 팔로잉에서 해당 사용자를 뺀다.
  const handleExitConfirm = async () => {
    if (selectedUserId === null) return;
    try {
      await userAPI.unfollow(selectedUserId);
      setFollowingList(prev => prev.filter(user => user.id !== selectedUserId));
      setDeleteCompleteVisible(true);
    } catch (e) {
      console.error('언팔로우 실패:', e);
      Alert.alert('팔로우', '삭제 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setSelectedUserId(null);
    }
  };

  const handleMutualFollow = async (user: FollowUser) => {
    try {
      await userAPI.follow(user.id);
      setFollowingList(prev => [...prev, user]);
      setToastVisible(true);
    } catch (e) {
      console.error('팔로우 실패:', e);
      Alert.alert('팔로우', '팔로우 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="팔로우 목록" onBack={() => navigation.navigate('Mypage')} />

      <TabBar
        tabs={[
          { key: 'follower', label: '팔로우' },
          { key: 'following', label: '팔로잉' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 목록 컨테이너 */}
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContainerInner}
        data={activeTab === 'follower' ? followerList : followingList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={styles.userImage} />
            ) : (
              <View style={styles.userImage} />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userNickname}>{item.nickname}</Text>
              <Text style={styles.userProductCount}>판매물품 -개</Text>
            </View>
            <View style={styles.userActions}>
              {activeTab === 'follower' && !followingIds.has(item.id) && (
                <TouchableOpacity
                  style={styles.mutualButton}
                  activeOpacity={0.7}
                  onPress={() => handleMutualFollow(item)}
                >
                  <Text style={styles.mutualButtonText}>맞팔로우</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => setSelectedUserId(item.id)}
              >
                <ExitIcon width={12} height={12} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            image={activeTab === 'follower' ? require('../../assets/follow.png') : require('../../assets/follower.png')}
            title={activeTab === 'follower' ? '아직 나를 팔로우한 회원이 없어요!' : '아직 팔로잉한 회원이 없어요!'}
            description={
              activeTab === 'follower'
                ? '회원님의 상품을 등록하고 더 많은 사람들과 만나보세요.'
                : '관심 있는 판매자를 팔로우하고 새로운 상품을 확인해보세요.'
            }
          />
        }
      />

      <ConfirmView
        visible={selectedUserId !== null}
        title="팔로잉 목록에서 삭제할까요?"
        onCancel={() => setSelectedUserId(null)}
        onConfirm={handleExitConfirm}
      />

      <Toast visible={toastVisible} message="팔로우가 완료되었습니다!" onDismiss={() => setToastVisible(false)} />

      <CommonPopup
        visible={deleteCompleteVisible}
        title="팔로잉 목록에서 삭제되었습니다."
        buttonText="이전화면으로 돌아가기"
        onPress={() => {
          setDeleteCompleteVisible(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default FollowScreen;
