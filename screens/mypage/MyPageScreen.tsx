import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { styles } from './MyPageScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import NextIcon from '../../assets/next.svg';
import StarIcon from '../../assets/star.svg';
import SettingIcon from '../../assets/setting.svg';
import SalesDetailsIcon from '../../assets/sales_details.svg';
import PurchaseDetailsIcon from '../../assets/purchase_details.svg';
import BottomNav from '../../components/BottomNav';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { userAPI } from '../../api/apiClient';
import { mergeRecentActivities, RecentActivity } from '../../utils/mypage';

type Props = NativeStackScreenProps<RootStackParamList, 'Mypage'>;

const DEFAULT_PRODUCT_IMAGE = require('../../assets/product_img.png');
const MOCK_RATING = '3.8';

interface Profile {
    username: string;
    nickname: string;
    bio: string;
    profileImageUrl: string | null;
}

const MyPageScreen = ({ navigation }: Props) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [activityCount, setActivityCount] = useState(0);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    const me = (await userAPI.getMe()).data.data;
                    setProfile({ username: me.username, nickname: me.nickname, bio: me.bio ?? '', profileImageUrl: me.profileImageUrl ?? null });
                    // 개수는 totalElements만 쓰므로 size=1로 조회
                    const [followers, followings, sales, purchases] = await Promise.all([
                        userAPI.getFollowers(me.id, 0, 1),
                        userAPI.getFollowings(me.id, 0, 1),
                        userAPI.getSaleOrders({ page: 0, size: 3 }),
                        userAPI.getPurchaseOrders({ page: 0, size: 3 }),
                    ]);
                    setFollowerCount(followers.data.data.totalElements);
                    setFollowingCount(followings.data.data.totalElements);
                    setActivityCount(sales.data.data.totalElements + purchases.data.data.totalElements);
                    setRecentActivities(mergeRecentActivities(sales.data.data.content, purchases.data.data.content));
                } catch (e) {
                    console.error('마이페이지 조회 실패:', e);
                }
            };
            load();
        }, []),
    );

    return (
        // 헤더 컨테이너
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>회원정보</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <SettingIcon width={23} height={22} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.contentContainerInner}
                showsVerticalScrollIndicator={false}
            >
                {/* 사용자 프로필 컨테이너 */}
                <View style={styles.profileContainer}>
                    {profile?.profileImageUrl ? (
                        <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profileImage}></View>
                    )}
                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <View>
                                <View style={styles.nicknameRow}>
                                    <Text style={styles.username}>{profile?.nickname ?? ''}</Text>
                                    {!!profile?.username && <Text style={styles.userId}>@{profile.username}</Text>}
                                </View>
                                <Text style={styles.introduction}>{profile?.bio ?? ''}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.NextIcon}
                                onPress={() => navigation.navigate('EditProfile')}
                                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            >
                                <NextIcon
                                width={7}
                                height={20}
                                />
                            </TouchableOpacity>

                        </View>

                        <View style={styles.followCountContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('Follow', { initialTab: 'follower' })}>
                                <Text style={styles.followCount}>팔로우 {followerCount}</Text>
                            </TouchableOpacity>
                            <Text style={styles.followDivider}>|</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Follow', { initialTab: 'following' })}>
                                <Text style={styles.followCount}>팔로잉 {followingCount}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 나의 거래활동 컨테이너 */}
                <View style={styles.activityContainer}>
                    <Text style={styles.activityCount}>거래활동 {activityCount}회</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>별점</Text>
                        <StarIcon width={14} height={14} />
                        {/* ponytail: 별점 API 연동 전 mock 값 */}
                        <Text style={styles.ratingScore}>{MOCK_RATING}</Text>
                    </View>
                </View>

                {/* 관심목록/판매내역/구매내역 컨테이너 */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('Wishlist')}>
                        <Image source={require('../../assets/Interested_list.png')} style={styles.menuIcon} resizeMode="contain" />
                        <Text style={styles.menuLabel}>관심목록</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('SalesHistory')}>
                        <SalesDetailsIcon width={28} height={28} />
                        <Text style={styles.menuLabel}>판매내역</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('PurchaseHistory')}>
                        <PurchaseDetailsIcon width={28} height={28} />
                        <Text style={styles.menuLabel}>구매내역</Text>
                    </TouchableOpacity>
                </View>

                {/* 최근거래활동 컨테이너 */}
                <View style={styles.recentActivityContainer}>
                    {recentActivities.length === 0 ? (
                        <Text style={styles.recentActivityEmpty}>최근 거래활동이 없습니다.</Text>
                    ) : (
                        recentActivities.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.recentActivityItem}
                                activeOpacity={0.7}
                                onPress={() =>
                                    navigation.navigate(item.type === '판매' ? 'OrderDetail' : 'PurchaseOrderDetail', {
                                        orderId: item.orderId,
                                        orderNumber: item.orderId,
                                        productTitle: item.title,
                                        productPrice: item.price,
                                        productImage: DEFAULT_PRODUCT_IMAGE,
                                    })
                                }
                            >
                                <Image source={DEFAULT_PRODUCT_IMAGE} style={styles.recentActivityImage} resizeMode="cover" />
                                <View style={styles.recentActivityInfo}>
                                    <Text style={styles.recentActivityTitle}>{item.title}</Text>
                                    <View style={styles.recentActivityStatusRow}>
                                        <Text style={styles.recentActivityType}>{item.type}</Text>
                                        <Text style={styles.recentActivityDivider}>|</Text>
                                        <Text style={styles.recentActivityComplete}>{item.statusLabel}</Text>
                                    </View>
                                </View>
                                <Text style={styles.recentActivityDate}>{item.date}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* 공지사항/알림설정/고객센터 컨테이너 */}
                <View style={styles.menuListContainer}>
                    <TouchableOpacity style={styles.menuListItem} onPress={() => navigation.navigate('Notice')}>
                        <Text style={styles.menuListTitle}>공지사항</Text>
                        <NextIcon width={7} height={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuListItem} onPress={() => navigation.navigate('NotificationSettings')}>
                        <Text style={styles.menuListTitle}>알림설정</Text>
                        <NextIcon width={7} height={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuListItem} onPress={() => navigation.navigate('CustomerCenter')}>
                        <Text style={styles.menuListTitle}>고객센터</Text>
                        <NextIcon width={7} height={20} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNav />
        </SafeAreaView>
    )
}

export default MyPageScreen;