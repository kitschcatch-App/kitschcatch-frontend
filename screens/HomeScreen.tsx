/**
 * 화면: 홈 화면 (HomeScreen)
 * 역할: 바텀 네비게이션의 홈 탭 진입점으로, 상단 헤더와 자동으로 넘어가는 이미지 배너를 보여주는 화면 컴포넌트입니다.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import KitschcatchIcon from '../assets/kitschcatch.svg';
import AlarmIcon from '../assets/alarm.svg';
import SearchIcon from '../assets/search.svg';
import BottomNav from '../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

import { styles } from './HomeScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// 배너 이미지 (mock)
const BANNER_IMAGES = [
  'https://picsum.photos/id/301/800/400',
  'https://picsum.photos/id/302/800/400',
  'https://picsum.photos/id/303/800/400',
  'https://picsum.photos/id/304/800/400',
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - 32; // 컨테이너 좌우 padding(16)만큼 상쇄

const HomeScreen = (_props: Props) => {
  const insets = useSafeAreaInsets();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerListRef = useRef<FlatList<string>>(null);

  // 배너 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const nextIndex = (prev + 1) % BANNER_IMAGES.length;
        bannerListRef.current?.scrollToOffset({
          offset: nextIndex * BANNER_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setCurrentBannerIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 68) }]} />

        {/* 상단 헤더: 로고 & 알림 & 검색 */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={{ marginLeft: -8, marginRight: 2, width: 39, height: 40 }}
              resizeMode="contain"
            />
            <KitschcatchIcon width={67} height={23} style={{ marginTop: 8 }} />
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.alarmIcon}>
              <AlarmIcon width={22} height={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchIcon}>
              <SearchIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 이미지 배너 */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={bannerListRef}
            data={BANNER_IMAGES}
            keyExtractor={(item) => item}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleBannerScrollEnd}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[styles.bannerImage, { width: BANNER_WIDTH }]}
                resizeMode="cover"
              />
            )}
          />
          <View style={styles.bannerPagination}>
            <Text style={styles.bannerPaginationText}>
              {currentBannerIndex + 1}/{BANNER_IMAGES.length}
            </Text>
          </View>
        </View>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
};

export default HomeScreen;
