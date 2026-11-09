/**
 * 화면: 다른 사용자 프로필 (OtherUserProfileScreen)
 * 역할: 상품 상세에서 판매자를 눌렀을 때 다른 회원의 공개 프로필, 거래활동, 판매 상품을 보여줍니다.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, ImageURISource, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styles } from './OtherUserProfileScreen.styles';
import ScreenHeader from '../../components/ScreenHeader';
import ReportBlockMenu from '../../components/ReportBlockMenu';
import NextIcon from '../../assets/next.svg';
import StarIcon from '../../assets/star.svg';
import MoreIcon from '../../assets/more.svg';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { userAPI } from '../../api/apiClient';

type Props = NativeStackScreenProps<RootStackParamList, 'OtherUserProfile'>;

// 이미지가 없으면 빈 소스 → 이미지 스타일의 회색 배경이 그대로 보인다.
const DEFAULT_PRODUCT_IMAGE: ImageURISource = {};

interface Profile {
  username: string;
  nickname: string;
  bio: string;
  profileImageUrl: string | null;
}

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
}

const OtherUserProfileScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [canFollow, setCanFollow] = useState(false); // 본인·차단 상태면 false
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
      try {
        const [user, followers, followings, trust, posts, me] = await Promise.all([
          userAPI.getUser(userId),
          // ponytail: 내 팔로우 여부는 팔로워 100명 안에서만 확인. 더 많아지면 서버 필드 요청.
          userAPI.getFollowers(userId, 0, 100),
          userAPI.getFollowings(userId, 0, 1),
          userAPI.getTrustInfo(userId),
          userAPI.getUserPosts(userId, { status: 'ON_SALE', page: 0, size: 100 }),
          userAPI.getMe(),
        ]);
        const u = user.data.data;
        setProfile({ username: u.username, nickname: u.nickname, bio: u.bio ?? '', profileImageUrl: u.profileImageUrl ?? null });
        setFollowerCount(followers.data.data.totalElements);
        setCanFollow(!!u.canFollow);
        setIsFollowing(followers.data.data.content.some((f: any) => f.id === me.data.data.id));
        setFollowingCount(followings.data.data.totalElements);
        setTradeCount(trust.data.data.completedTransactionCount ?? 0);
        setRating(trust.data.data.averageRating ?? null);
        setProducts(
          posts.data.data.content.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            price: p.price,
            imageUrl: p.images?.[0]?.imageUrl ?? null,
          })),
        );
      } catch (e) {
        console.error('다른 사용자 프로필 조회 실패:', e);
      } finally {
        setIsLoading(false);
      }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);
  const refreshControl = useRefreshControl(load);

  // 팔로우/언팔로우 (화면에 먼저 반영하고 실패하면 되돌림)
  const toggleFollow = async () => {
    if (isTogglingFollow) return;
    const next = !isFollowing;
    setIsTogglingFollow(true);
    setIsFollowing(next);
    setFollowerCount(c => c + (next ? 1 : -1));
    try {
      await (next ? userAPI.follow(userId) : userAPI.unfollow(userId));
    } catch (e) {
      console.error('팔로우 변경 실패:', e);
      setIsFollowing(!next);
      setFollowerCount(c => c + (next ? -1 : 1));
      Alert.alert('팔로우', '처리하지 못했어요. 다시 시도해주세요.');
    } finally {
      setIsTogglingFollow(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title="다른 사용자"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            style={styles.headerMoreButton}
            accessibilityLabel="더보기 메뉴"
            onPress={() => setMenuVisible(v => !v)}
          >
            <MoreIcon width={4} height={18} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} />
      ) : (
      <ScrollView
        refreshControl={refreshControl}
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerInner}
        showsVerticalScrollIndicator={false}
      >
        {/* 사용자 프로필 컨테이너 */}
        <View style={styles.profileContainer}>
          {profile?.profileImageUrl ? (
            <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <View style={styles.profileInfo}>
            <View style={styles.nicknameRow}>
              <Text style={styles.username}>{profile?.nickname ?? ''}</Text>
              {!!profile?.username && <Text style={styles.userId}>@{profile.username}</Text>}
            </View>
            <Text style={styles.introduction}>{profile?.bio ?? ''}</Text>
            <View style={styles.followCountContainer}>
              <TouchableOpacity
                onPress={() => navigation.push('Follow', { userId, initialTab: 'follower' })}
              >
                <Text style={styles.followCount}>팔로우 {followerCount}</Text>
              </TouchableOpacity>
              <Text style={styles.followDivider}>|</Text>
              <TouchableOpacity
                onPress={() => navigation.push('Follow', { userId, initialTab: 'following' })}
              >
                <Text style={styles.followCount}>팔로잉 {followingCount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {canFollow && (
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followButtonActive]}
            activeOpacity={0.7}
            onPress={toggleFollow}
          >
            <Text style={styles.followButtonText}>{isFollowing ? '팔로잉' : '팔로우'}</Text>
          </TouchableOpacity>
        )}

        {/* 거래활동 컨테이너 */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityCount}>거래활동 {tradeCount}회</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>별점</Text>
            <StarIcon width={14} height={14} />
            <Text style={styles.ratingScore}>{rating === null ? '-' : rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* 판매상품 컨테이너 */}
        <View style={styles.productContainer}>
          <View style={styles.productHeaderRow}>
            <Text style={styles.productHeaderTitle}>판매상품</Text>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() =>
                navigation.push('UserProducts', { userId, nickname: profile?.nickname ?? '' })
              }
            >
              <Text style={styles.moreText}>더보기</Text>
              <NextIcon width={5} height={9} />
            </TouchableOpacity>
          </View>

          <View style={styles.productList}>
            {products.length === 0 ? (
              <Text style={styles.productEmpty}>판매 중인 상품이 없습니다.</Text>
            ) : (
              products.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.productItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.push('ProductDetail', {
                      productId: item.id,
                      productName: item.title,
                      productPrice: item.price,
                      productImageUrl: item.imageUrl ?? '',
                    })
                  }
                >
                  <Image
                    source={item.imageUrl ? { uri: item.imageUrl } : DEFAULT_PRODUCT_IMAGE}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.productPrice}>{item.price.toLocaleString()}원</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      )}

      <ReportBlockMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onBlock={() => navigation.push('BlockUser', { userId })}
        onReport={() => navigation.push('ReportUser', { userId })}
      />
    </SafeAreaView>
  );
};

export default OtherUserProfileScreen;
