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
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect, SvgProps } from 'react-native-svg';
import KitschcatchIcon from '../../assets/kitschcatch.svg';
import AlarmIcon from '../../assets/alarm.svg';
import SearchIcon from '../../assets/search.svg';
import NextIcon from '../../assets/next.svg';
import AddIcon from '../../assets/plus.svg';
import AnimationLogo1 from '../../assets/animation_logo_1.svg';
import AnimationLogo2 from '../../assets/animation_logo_2.svg';
import AnimationLogo3 from '../../assets/animation_logo_3.svg';
import AnimationLogo4 from '../../assets/animation_logo_4.svg';
import AnimationLogo5 from '../../assets/animation_logo_5.svg';
import AnimationLogo6 from '../../assets/animation_logo_6.svg';
import BottomNav from '../../components/BottomNav';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { styles } from './HomeScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// 배너 이미지 (mock)
const BANNER_IMAGES = [
  'https://picsum.photos/id/301/800/400',
  'https://picsum.photos/id/302/800/400',
  'https://picsum.photos/id/303/800/400',
  'https://picsum.photos/id/304/800/400',
];

const INITIAL_BANNER_WIDTH = Dimensions.get('window').width;

const CATEGORY_ITEMS = [
  { key: 'ANIME_MANGA', label: '애니/만화', image: require('../../assets/animation.png') },
  { key: 'GAME', label: '게임', image: require('../../assets/game.png') },
  { key: 'GOODS', label: '굿즈', image: require('../../assets/goods.png') },
  { key: 'COSPLAY', label: '코스프레', image: require('../../assets/cosplay.png') },
  { key: 'BOOK', label: '서적', image: require('../../assets/books.png') },
  { key: 'MUSIC_VIDEO', label: '음반/영상', image: require('../../assets/record.png') },
  { key: 'ETC', label: '기타', image: require('../../assets/etc.png') },
];

// 오늘의 추천 상품 (mock)
const RECOMMENDED_PRODUCTS = [
  { id: '1', name: '초코 미니언즈 인형 키링 세트', price: 15000, imageUrl: 'https://picsum.photos/id/401/400/400' },
  { id: '2', name: '나루토 우치하 사스케 피규어', price: 32000, imageUrl: 'https://picsum.photos/id/402/400/400' },
  { id: '3', name: '원피스 루피 초베가 한정판 굿즈', price: 48000, imageUrl: 'https://picsum.photos/id/403/400/400' },
];

// 최근 본 상품과 비슷한 상품 (mock)
const SIMILAR_PRODUCTS = [
  { id: '1', name: '지브리 토토로 인형 키링', price: 12000, imageUrl: 'https://picsum.photos/id/501/300/300' },
  { id: '2', name: '드래곤볼 손오공 피규어 세트', price: 27000, imageUrl: 'https://picsum.photos/id/502/300/300' },
  { id: '3', name: '짱구는 못말려 액션 프라모델', price: 18500, imageUrl: 'https://picsum.photos/id/503/300/300' },
  { id: '4', name: '주술회전 고죠 사토루 뱃지', price: 9000, imageUrl: 'https://picsum.photos/id/504/300/300' },
  { id: '5', name: '슬램덩크 완전판 만화책 세트', price: 45000, imageUrl: 'https://picsum.photos/id/505/300/300' },
  { id: '6', name: '이누야샤 오리지널 사운드트랙 LP', price: 32000, imageUrl: 'https://picsum.photos/id/506/300/300' },
  { id: '7', name: '체인소맨 덴지 아크릴 스탠드', price: 15000, imageUrl: 'https://picsum.photos/id/507/300/300' },
];

type PopularWork = {
  id: string;
  title: string;
  count: number;
  Logo: React.FC<SvgProps>;
  twoLine?: boolean; // 제목이 2줄로 줄바꿈되는 항목인지 (next 아이콘 간격 조정용)
};

// 인기 작품 (mock)
const POPULAR_WORKS: PopularWork[] = [
  { id: '1', title: '귀멸의 칼날', count: 76, Logo: AnimationLogo1, twoLine: true },
  { id: '2', title: '원피스', count: 56, Logo: AnimationLogo2 },
  { id: '3', title: '블루 아카이브', count: 45, Logo: AnimationLogo3, twoLine: true },
  { id: '4', title: '명탐정 코난', count: 32, Logo: AnimationLogo4, twoLine: true },
  { id: '5', title: '하이큐', count: 22, Logo: AnimationLogo5 },
  { id: '6', title: '진격의 거인', count: 16, Logo: AnimationLogo6, twoLine: true },
];

type PopularProduct = { id: string; name: string; price: number; imageUrl: string };

// 현재 인기있는 상품 카테고리 (전체 + 상품 카테고리)
const POPULAR_PRODUCT_CATEGORIES = [
  { key: 'ALL', label: '전체' },
  ...CATEGORY_ITEMS.map((category) => ({ key: category.key, label: category.label })),
];

// 현재 인기있는 상품 (mock, 카테고리별 6개)
const POPULAR_PRODUCTS_BY_CATEGORY: Record<string, PopularProduct[]> = {
  ALL: [
    { id: '1', name: '귀멸의 칼날 렌고쿠 피규어', price: 42000, imageUrl: 'https://picsum.photos/id/601/300/300' },
    { id: '2', name: '원피스 조로 산텐이치류 굿즈', price: 35000, imageUrl: 'https://picsum.photos/id/602/300/300' },
    { id: '3', name: '스타듀밸리 콜렉터 에디션', price: 58000, imageUrl: 'https://picsum.photos/id/603/300/300' },
    { id: '4', name: '블루 아카이브 아로나 아크릴 스탠드', price: 13000, imageUrl: 'https://picsum.photos/id/604/300/300' },
    { id: '5', name: '명탐정 코난 배지 컬렉션', price: 21000, imageUrl: 'https://picsum.photos/id/605/300/300' },
    { id: '6', name: '진격의 거인 리바이 코스프레 망토', price: 67000, imageUrl: 'https://picsum.photos/id/606/300/300' },
  ],
  ANIME_MANGA: [
    { id: '1', name: '귀멸의 칼날 탄지로 피규어', price: 39000, imageUrl: 'https://picsum.photos/id/611/300/300' },
    { id: '2', name: '원피스 루피 기어5 피규어', price: 55000, imageUrl: 'https://picsum.photos/id/612/300/300' },
    { id: '3', name: '하이큐 카게야마 아크릴 키링', price: 9500, imageUrl: 'https://picsum.photos/id/613/300/300' },
    { id: '4', name: '주술회전 료멘스쿠나 피규어', price: 48000, imageUrl: 'https://picsum.photos/id/614/300/300' },
    { id: '5', name: '진격의 거인 완결 만화책 세트', price: 62000, imageUrl: 'https://picsum.photos/id/615/300/300' },
    { id: '6', name: '체인소맨 파워 포스터', price: 8000, imageUrl: 'https://picsum.photos/id/616/300/300' },
  ],
  GAME: [
    { id: '1', name: '스타듀밸리 콜렉터 에디션', price: 58000, imageUrl: 'https://picsum.photos/id/621/300/300' },
    { id: '2', name: '젤다의 전설 아뮤보 세트', price: 44000, imageUrl: 'https://picsum.photos/id/622/300/300' },
    { id: '3', name: '몬스터헌터 라이즈 한정판', price: 39000, imageUrl: 'https://picsum.photos/id/623/300/300' },
    { id: '4', name: '포켓몬스터 스칼렛 카트리지', price: 47000, imageUrl: 'https://picsum.photos/id/624/300/300' },
    { id: '5', name: '오버워치2 피규어 세트', price: 36000, imageUrl: 'https://picsum.photos/id/625/300/300' },
    { id: '6', name: '동물의 숲 다마스크 인형', price: 15000, imageUrl: 'https://picsum.photos/id/626/300/300' },
  ],
  GOODS: [
    { id: '1', name: '블루 아카이브 아로나 아크릴 스탠드', price: 13000, imageUrl: 'https://picsum.photos/id/631/300/300' },
    { id: '2', name: '산리오 시나모롤 인형 키링', price: 11000, imageUrl: 'https://picsum.photos/id/632/300/300' },
    { id: '3', name: '체인소맨 덴지 아크릴 스탠드', price: 15000, imageUrl: 'https://picsum.photos/id/633/300/300' },
    { id: '4', name: '주술회전 고죠 사토루 뱃지', price: 9000, imageUrl: 'https://picsum.photos/id/634/300/300' },
    { id: '5', name: '짱구는 못말려 미니 파우치', price: 12500, imageUrl: 'https://picsum.photos/id/635/300/300' },
    { id: '6', name: '이누야샤 은목걸이 레플리카', price: 28000, imageUrl: 'https://picsum.photos/id/636/300/300' },
  ],
  COSPLAY: [
    { id: '1', name: '진격의 거인 리바이 코스프레 망토', price: 67000, imageUrl: 'https://picsum.photos/id/641/300/300' },
    { id: '2', name: '나루토 카카시 마스크 세트', price: 24000, imageUrl: 'https://picsum.photos/id/642/300/300' },
    { id: '3', name: '원피스 에이스 코스프레 의상', price: 89000, imageUrl: 'https://picsum.photos/id/643/300/300' },
    { id: '4', name: '귀멸의 칼날 네즈코 가발', price: 32000, imageUrl: 'https://picsum.photos/id/644/300/300' },
    { id: '5', name: '블루 아카이브 교복 코스프레', price: 76000, imageUrl: 'https://picsum.photos/id/645/300/300' },
    { id: '6', name: '주술회전 교복 넥타이', price: 18000, imageUrl: 'https://picsum.photos/id/646/300/300' },
  ],
  BOOK: [
    { id: '1', name: '진격의 거인 완결 만화책 세트', price: 62000, imageUrl: 'https://picsum.photos/id/651/300/300' },
    { id: '2', name: '슬램덩크 완전판 만화책 세트', price: 45000, imageUrl: 'https://picsum.photos/id/652/300/300' },
    { id: '3', name: '나루토 일러스트 화집', price: 33000, imageUrl: 'https://picsum.photos/id/653/300/300' },
    { id: '4', name: '원피스 컬러워크스 화보집', price: 29000, imageUrl: 'https://picsum.photos/id/654/300/300' },
    { id: '5', name: '귀멸의 칼날 공식 가이드북', price: 21000, imageUrl: 'https://picsum.photos/id/655/300/300' },
    { id: '6', name: '드래곤볼 완전판 세트', price: 58000, imageUrl: 'https://picsum.photos/id/656/300/300' },
  ],
  MUSIC_VIDEO: [
    { id: '1', name: '이누야샤 오리지널 사운드트랙 LP', price: 32000, imageUrl: 'https://picsum.photos/id/661/300/300' },
    { id: '2', name: '귀멸의 칼날 OST 앨범', price: 27000, imageUrl: 'https://picsum.photos/id/662/300/300' },
    { id: '3', name: '진격의 거인 극장판 블루레이', price: 41000, imageUrl: 'https://picsum.photos/id/663/300/300' },
    { id: '4', name: '원피스 극장판 DVD 세트', price: 38000, imageUrl: 'https://picsum.photos/id/664/300/300' },
    { id: '5', name: '나루토 테마곡 앨범 LP', price: 29500, imageUrl: 'https://picsum.photos/id/665/300/300' },
    { id: '6', name: '스파이 패밀리 OST CD', price: 19000, imageUrl: 'https://picsum.photos/id/666/300/300' },
  ],
  ETC: [
    { id: '1', name: '애니메이션 굿즈 랜덤 박스', price: 25000, imageUrl: 'https://picsum.photos/id/671/300/300' },
    { id: '2', name: '캐릭터 파우치 & 문구 세트', price: 14000, imageUrl: 'https://picsum.photos/id/672/300/300' },
    { id: '3', name: '애니 콜라보 텀블러', price: 17000, imageUrl: 'https://picsum.photos/id/673/300/300' },
    { id: '4', name: '한정판 콜라보 에코백', price: 12000, imageUrl: 'https://picsum.photos/id/674/300/300' },
    { id: '5', name: '캐릭터 미니 담요', price: 22000, imageUrl: 'https://picsum.photos/id/675/300/300' },
    { id: '6', name: '애니 콜라보 스티커 팩', price: 6000, imageUrl: 'https://picsum.photos/id/676/300/300' },
  ],
};

type NearbyStore = {
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  detail?: string; // 영업시간 상세 (status와 '|'로 구분되어 표시됨)
};

// 내 주변 매장 (mock)
const NEARBY_STORES: NearbyStore[] = [
  { id: '1', name: '새틀라이트 플러스', imageUrl: 'https://picsum.photos/id/701/400/400', status: '영업 중', detail: '21:40에 영업종료' },
  { id: '2', name: '캑티 가챠샵 연남점', imageUrl: 'https://picsum.photos/id/702/400/400', status: '24시간 영업' },
  { id: '3', name: '우주가챠', imageUrl: 'https://picsum.photos/id/703/400/400', status: '영업 종료', detail: '13:00에 영업시작' },
  { id: '4', name: '123456789', imageUrl: 'https://picsum.photos/id/704/400/400', status: '영업 중', detail: '21:00에 영업종료' },
];

const HomeScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerWidth, setBannerWidth] = useState(INITIAL_BANNER_WIDTH);
  const bannerListRef = useRef<FlatList<string>>(null);
  const bannerWidthRef = useRef(INITIAL_BANNER_WIDTH);
  const [selectedProductCategory, setSelectedProductCategory] = useState('ALL');
  const productSlideAnim = useRef(new Animated.Value(0)).current;

  // 배너 컨테이너의 실제 렌더 너비를 측정해 화면 폭과 정확히 일치시킴
  const handleBannerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    bannerWidthRef.current = width;
    setBannerWidth(width);
  };

  // 배너 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const nextIndex = (prev + 1) % BANNER_IMAGES.length;
        bannerListRef.current?.scrollToOffset({
          offset: nextIndex * bannerWidthRef.current,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidthRef.current);
    setCurrentBannerIndex(index);
  };

  // 인기있는 상품 카테고리 변경 시, 책장을 넘기듯 현재 상품이 빠져나가고 다음 상품이 이어서 들어오는 애니메이션
  const handleSelectProductCategory = (categoryKey: string) => {
    if (categoryKey === selectedProductCategory) return;
    Animated.timing(productSlideAnim, {
      toValue: -INITIAL_BANNER_WIDTH,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSelectedProductCategory(categoryKey);
      productSlideAnim.setValue(INITIAL_BANNER_WIDTH);
      Animated.timing(productSlideAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    });
  };

  const popularProducts = POPULAR_PRODUCTS_BY_CATEGORY[selectedProductCategory] ?? [];

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 68) }]} />

        {/* 상단 헤더: 로고 & 알림 & 검색 */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={{ marginLeft: -8, marginRight: 2, width: 39, height: 40 }}
              resizeMode="contain"
            />
            <KitschcatchIcon width={67} height={23} style={{ marginTop: 8 }} />
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.alarmIcon}>
              <AlarmIcon width={22} height={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchIcon} onPress={() => navigation.navigate('Search')}>
              <SearchIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* 이미지 배너 */}
          <View style={styles.bannerContainer} onLayout={handleBannerLayout}>
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
                  style={[styles.bannerImage, { width: bannerWidth }]}
                  resizeMode="cover"
                />
              )}
            />
            <View style={styles.bannerPagination}>
              <Text style={styles.bannerPaginationText}>
                {currentBannerIndex + 1}
                <Text style={styles.bannerPaginationTextMuted}>/{BANNER_IMAGES.length}</Text>
              </Text>
            </View>
          </View>

          {/* 카테고리별 보기 */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>카테고리별 보기</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {CATEGORY_ITEMS.map((category) => (
                <TouchableOpacity key={category.key} style={styles.categoryItem} activeOpacity={0.7}>
                  <View style={styles.categoryCircle}>
                    <Image source={category.image} style={styles.categoryIcon} resizeMode="contain" />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 오늘의 추천 */}
          <View style={styles.recommendContainer}>
            <Text style={styles.recommendTitle}>✨ 오늘의 추천</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendScrollContent}
            >
              {RECOMMENDED_PRODUCTS.map((product) => (
                <TouchableOpacity key={product.id} style={styles.recommendCard} activeOpacity={0.85}>
                  <Image source={{ uri: product.imageUrl }} style={styles.recommendImage} resizeMode="cover" />
                  {/* 하단 그라데이션 (텍스트 가독성 확보용) */}
                  <View pointerEvents="none" style={styles.recommendGradient}>
                    <Svg width="100%" height="100%">
                      <Defs>
                        <LinearGradient id={`recommendFade-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                          <Stop offset="0" stopColor="#000000" stopOpacity={0} />
                          <Stop offset="1" stopColor="#000000" stopOpacity={0.85} />
                        </LinearGradient>
                      </Defs>
                      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#recommendFade-${product.id})`} />
                    </Svg>
                  </View>
                  <View style={styles.recommendTextOverlay}>
                    <Text style={styles.recommendName} numberOfLines={1} ellipsizeMode="tail">
                      {product.name}
                    </Text>
                    <Text style={styles.recommendPrice} numberOfLines={1} ellipsizeMode="tail">
                      {product.price.toLocaleString()}원
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 최근 본 상품과 비슷한 상품 */}
          <View style={styles.similarContainer}>
            <Text style={styles.similarTitle}>👀 최근 본 상품과 비슷한 상품</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScrollContent}
            >
              {SIMILAR_PRODUCTS.map((product) => (
                <TouchableOpacity key={product.id} style={styles.similarCard} activeOpacity={0.85}>
                  <Image source={{ uri: product.imageUrl }} style={styles.similarImage} resizeMode="cover" />
                  <Text style={styles.similarName} numberOfLines={1} ellipsizeMode="tail">
                    {product.name}
                  </Text>
                  <Text style={styles.similarPrice} numberOfLines={1} ellipsizeMode="tail">
                    {product.price.toLocaleString()}원
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 인기 작품 */}
          <View style={styles.popularContainer}>
            <Text style={styles.popularHeading}>⭐️ 인기 작품</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularScrollContent}
            >
              {POPULAR_WORKS.map((work) => (
                <TouchableOpacity key={work.id} style={styles.popularCard} activeOpacity={0.85}>
                  <work.Logo width={76} height={76} />
                  <View style={styles.popularTitleRow}>
                    <Text style={styles.popularTitle} numberOfLines={2} ellipsizeMode="tail">
                      {work.title}
                    </Text>
                    <NextIcon
                      width={5}
                      height={8}
                      style={[styles.popularNextIcon, work.twoLine && styles.popularNextIconTight]}
                    />
                  </View>
                  <Text style={styles.popularCount}>상품 {work.count}개</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 현재 인기있는 상품 */}
          <View style={styles.popularProductsContainer}>
            <Text style={styles.popularProductsHeading}>🔥 현재 인기있는 상품</Text>
            <View style={styles.popularProductsCategoryContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.popularProductsCategoryScrollContent}
              >
                {POPULAR_PRODUCT_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.popularProductsCategoryButton,
                      selectedProductCategory === category.key && styles.popularProductsCategoryButtonActive,
                    ]}
                    onPress={() => handleSelectProductCategory(category.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.popularProductsCategoryText}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Animated.View
              style={[
                styles.popularProductsGrid,
                { transform: [{ translateX: productSlideAnim }] },
              ]}
            >
              {[popularProducts.slice(0, 3), popularProducts.slice(3, 6)].map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  style={[styles.popularProductsRow, rowIndex === 0 && styles.popularProductsRowSpacing]}
                >
                  {row.map((product) => (
                    <TouchableOpacity key={product.id} style={styles.popularProductsCard} activeOpacity={0.85}>
                      <Image source={{ uri: product.imageUrl }} style={styles.popularProductsImage} resizeMode="cover" />
                      <Text style={styles.popularProductsName} numberOfLines={1} ellipsizeMode="tail">
                        {product.name}
                      </Text>
                      <Text style={styles.popularProductsPrice} numberOfLines={1} ellipsizeMode="tail">
                        {product.price.toLocaleString()}원
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </Animated.View>
          </View>

          {/* 내 주변 매장 */}
          <View style={styles.nearbyStoresContainer}>
            <View style={styles.nearbyStoresHeaderRow}>
              <Text style={styles.nearbyStoresHeading}>📍 내 주변 매장</Text>
              <TouchableOpacity style={styles.nearbyStoresMoreButton} activeOpacity={0.7}>
                <Text style={styles.nearbyStoresMoreText}>더보기</Text>
                <NextIcon width={5} height={8} style={styles.nearbyStoresMoreIcon} />
              </TouchableOpacity>
            </View>
            {[NEARBY_STORES.slice(0, 2), NEARBY_STORES.slice(2, 4)].map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[styles.nearbyStoresRow, rowIndex === 0 && styles.nearbyStoresRowSpacing]}
              >
                {row.map((store) => (
                  <TouchableOpacity key={store.id} style={styles.nearbyStoreCard} activeOpacity={0.85}>
                    <Image source={{ uri: store.imageUrl }} style={styles.nearbyStoreImage} resizeMode="cover" />
                    <Text style={styles.nearbyStoreName} numberOfLines={1} ellipsizeMode="tail">
                      {store.name}
                    </Text>
                    <Text style={styles.nearbyStoreInfo} numberOfLines={1} ellipsizeMode="tail">
                      {store.status}
                      {store.detail && (
                        <>
                          <Text style={styles.nearbyStoreInfoDivider}> | </Text>
                          {store.detail}
                        </>
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 플로팅 상품등록 버튼 */}
      <TouchableOpacity
        style={[styles.floatingButton, { bottom: Math.max(insets.bottom, 14) + 85 }]}
        onPress={() => navigation.navigate('ProductRegistration')}
      >
        <AddIcon width={20} height={20} />
        <Text style={styles.floatingButtonText}>상품 등록하기</Text>
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
};

export default HomeScreen;
