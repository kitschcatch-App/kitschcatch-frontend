import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { styles } from './MyPageScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import NextIcon from '../../assets/next.svg';
import SettingIcon from '../../assets/setting.svg';
import StarIcon from '../../assets/star.svg';
import SalesDetailsIcon from '../../assets/sales_details.svg';
import PurchaseDetailsIcon from '../../assets/purchase_details.svg';
import BottomNav from '../../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Mypage'>;

const RECENT_ACTIVITIES = [
    { id: '1', title: '원신 클레 피규어', type: '구매', date: '26.08.21', image: require('../../assets/product_img.png') },
    { id: '2', title: '하이큐 아크릴 스탠드', type: '판매', date: '26.08.15', image: require('../../assets/product_img.png') },
    { id: '3', title: '원신 벤티 열쇠고리', type: '판매', date: '26.08.10', image: require('../../assets/product_img.png') },
];

const MyPageScreen = ({ navigation }: Props) => {
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
                    <View style={styles.profileImage}></View>
                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <View>
                                <Text style={styles.username}>졸린코끼리</Text>
                                <Text style={styles.introduction}>원신, 하이큐 굿즈 모아요</Text>
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
                                <Text style={styles.followCount}>팔로우 1</Text>
                            </TouchableOpacity>
                            <Text style={styles.followDivider}>|</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Follow', { initialTab: 'following' })}>
                                <Text style={styles.followCount}>팔로잉 8</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 나의 거래활동 컨테이너 */}
                <View style={styles.activityContainer}>
                    <Text style={styles.activityCount}>거래활동 23회</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>별점</Text>
                        <StarIcon width={14} height={14} />
                        <Text style={styles.ratingScore}>4.1</Text>
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
                    {RECENT_ACTIVITIES.length === 0 ? (
                        <Text style={styles.recentActivityEmpty}>최근 거래활동이 없습니다.</Text>
                    ) : (
                        RECENT_ACTIVITIES.map((item) => (
                            <View key={item.id} style={styles.recentActivityItem}>
                                <Image source={item.image} style={styles.recentActivityImage} resizeMode="cover" />
                                <View style={styles.recentActivityInfo}>
                                    <Text style={styles.recentActivityTitle}>{item.title}</Text>
                                    <View style={styles.recentActivityStatusRow}>
                                        <Text style={styles.recentActivityType}>{item.type}</Text>
                                        <Text style={styles.recentActivityDivider}>|</Text>
                                        <Text style={styles.recentActivityComplete}>거래완료</Text>
                                    </View>
                                </View>
                                <Text style={styles.recentActivityDate}>{item.date}</Text>
                            </View>
                        ))
                    )}
                </View>

                {/* 공지사항/알림설정/고객센터 컨테이너 */}
                <View style={styles.menuListContainer}>
                    <TouchableOpacity style={styles.menuListItem}>
                        <Text style={styles.menuListTitle}>공지사항</Text>
                        <NextIcon width={7} height={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuListItem}>
                        <Text style={styles.menuListTitle}>알림설정</Text>
                        <NextIcon width={7} height={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuListItem}>
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