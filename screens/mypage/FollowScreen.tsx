import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useRefreshControl } from '../../hooks/useRefreshControl';
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

// 팔로워는 20명씩 이어서 불러오고, 팔로잉은 맞팔로우 판별에 쓰이므로 100명까지 한 번에 조회.
// ponytail: 팔로잉이 100명을 넘으면 맞팔로우 표시가 부정확할 수 있음.
const FOLLOWER_PAGE_SIZE = 20;
const FOLLOWING_PAGE_SIZE = 100;

// 화면을 다시 열어도 재조회하지 않도록 캐시 (내 id, 사용자별 판매물품 수)
let cachedMyId: number | null = null;
const productCountCache = new Map<number, number>();

// 판매중 상품 수 (목록 API에 없어서 행이 화면에 나타날 때 사용자별로 조회)
const ProductCount = ({ userId }: { userId: number }) => {
  const [count, setCount] = useState<number | null>(productCountCache.get(userId) ?? null);
  useEffect(() => {
    if (productCountCache.has(userId)) return;
    userAPI
      .getUserPosts(userId, { status: 'ON_SALE', page: 0, size: 1 })
      .then(res => {
        productCountCache.set(userId, res.data.data.totalElements);
        setCount(res.data.data.totalElements);
      })
      .catch(e => console.error('판매물품 수 조회 실패:', e));
  }, [userId]);
  return <Text style={styles.userProductCount}>판매물품 {count ?? '-'}개</Text>;
};

const FollowScreen = ({ navigation, route }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>(route.params?.initialTab ?? 'follower');
  const otherUserId = route.params?.userId;
  const isOther = otherUserId !== undefined;
  const [followerList, setFollowerList] = useState<FollowUser[]>([]);
  const [followingList, setFollowingList] = useState<FollowUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteCompleteVisible, setDeleteCompleteVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 최초 목록 로딩 중
  const [followerTotal, setFollowerTotal] = useState(0);
  const loadingMoreRef = useRef(false);
  const targetIdRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      if (otherUserId === undefined && cachedMyId === null) {
        cachedMyId = (await userAPI.getMe()).data.data.id;
      }
      const targetId = (otherUserId ?? cachedMyId) as number;
      targetIdRef.current = targetId;
      const [followers, followings] = await Promise.all([
        userAPI.getFollowers(targetId, 0, FOLLOWER_PAGE_SIZE),
        userAPI.getFollowings(targetId, 0, FOLLOWING_PAGE_SIZE),
      ]);
      setFollowerTotal(followers.data.data.totalElements);
      setFollowerList(followers.data.data.content);
      setFollowingList(followings.data.data.content);
    } catch (e) {
      console.error('팔로우 목록 조회 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, [otherUserId]);

  useEffect(() => {
    load();
  }, [load]);
  const refreshControl = useRefreshControl(load);

  // 팔로워 탭 끝에 닿으면 다음 20명
  const loadMoreFollowers = async () => {
    if (activeTab !== 'follower' || loadingMoreRef.current || targetIdRef.current === null) return;
    if (followerList.length >= followerTotal) return;
    loadingMoreRef.current = true;
    try {
      const res = await userAPI.getFollowers(
        targetIdRef.current,
        Math.floor(followerList.length / FOLLOWER_PAGE_SIZE),
        FOLLOWER_PAGE_SIZE,
      );
      setFollowerList(prev => [...prev, ...res.data.data.content.filter((u: FollowUser) => !prev.some(p => p.id === u.id))]);
    } catch (e) {
      console.error('팔로워 추가 조회 실패:', e);
    } finally {
      loadingMoreRef.current = false;
    }
  };

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
      <ScreenHeader title="팔로우 목록" onBack={() => (isOther ? navigation.goBack() : navigation.navigate('Mypage'))} />

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
        refreshControl={refreshControl}
        onEndReached={loadMoreFollowers}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            activeOpacity={0.7}
            disabled={activeTab !== 'following'}
            onPress={() => navigation.push('OtherUserProfile', { userId: item.id })}
          >
            {item.profileImageUrl ? (
              <Image source={{ uri: item.profileImageUrl }} style={styles.userImage} />
            ) : (
              <View style={styles.userImage} />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userNickname}>{item.nickname}</Text>
              <ProductCount userId={item.id} />
            </View>
            {/* 다른 사용자의 목록은 읽기 전용이라 맞팔로우/삭제 버튼 없음 */}
            {!isOther && (
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
              {activeTab === 'following' && (
                <TouchableOpacity
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  onPress={() => setSelectedUserId(item.id)}
                >
                  <ExitIcon width={12} height={12} />
                </TouchableOpacity>
              )}
            </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 80 }} />
          ) : (
          <EmptyState
            image={activeTab === 'follower' ? require('../../assets/follow.png') : require('../../assets/follower.png')}
            title={
              activeTab === 'follower'
                ? isOther ? '아직 팔로우한 회원이 없어요!' : '아직 나를 팔로우한 회원이 없어요!'
                : '아직 팔로잉한 회원이 없어요!'
            }
            description={
              isOther
                ? undefined
                : activeTab === 'follower'
                  ? '회원님의 상품을 등록하고 더 많은 사람들과 만나보세요.'
                  : '관심 있는 판매자를 팔로우하고 새로운 상품을 확인해보세요.'
            }
          />
          )
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
