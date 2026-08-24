import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { styles } from './FollowScreen.styles';
import ExitIcon from '../../assets/exit.svg';
import ConfirmView from '../../components/ConfirmView';
import CommonPopup from '../../components/CommonPopup';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import TabBar from '../../components/TabBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Follow'>;

type TabType = 'follower' | 'following';

const INITIAL_FOLLOWER_LIST = [
  { id: '1', nickname: '떠오르는별', productCount: 12, isMutual: false },
  { id: '2', nickname: '조용한바다', productCount: 5, isMutual: false },
  { id: '3', nickname: '초코라떼', productCount: 8, isMutual: true },
];

const INITIAL_FOLLOWING_LIST = [
  { id: '1', nickname: '민트초코러버', productCount: 9 },
  { id: '2', nickname: '고양이집사', productCount: 3 },
  { id: '3', nickname: '레트로수집가', productCount: 15 },
];

const FollowScreen = ({ navigation, route }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>(route.params?.initialTab ?? 'follower');
  const [followerList, setFollowerList] = useState(INITIAL_FOLLOWER_LIST);
  const [followingList, setFollowingList] = useState(INITIAL_FOLLOWING_LIST);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteCompleteVisible, setDeleteCompleteVisible] = useState(false);

  const handleExitConfirm = () => {
    if (activeTab === 'follower') {
      setFollowerList((prev) => prev.filter((user) => user.id !== selectedUserId));
    } else {
      setFollowingList((prev) => prev.filter((user) => user.id !== selectedUserId));
    }
    setSelectedUserId(null);
    setDeleteCompleteVisible(true);
  };

  const handleMutualFollow = (userId: string) => {
    setFollowerList((prev) => prev.map((user) => (user.id === userId ? { ...user, isMutual: true } : user)));
    setToastVisible(true);
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.userImage} />
            <View style={styles.userInfo}>
              <Text style={styles.userNickname}>{item.nickname}</Text>
              <Text style={styles.userProductCount}>판매물품 {item.productCount}개</Text>
            </View>
            <View style={styles.userActions}>
              {activeTab === 'follower' && !('isMutual' in item && item.isMutual) && (
                <TouchableOpacity
                  style={styles.mutualButton}
                  activeOpacity={0.7}
                  onPress={() => handleMutualFollow(item.id)}
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
