/**
 * 화면: 매장상세 화면 (StoreDetailScreen)
 * 역할: 매장지도 화면의 매장 팝업에서 '상세정보'를 눌렀을 때 진입하며,
 *       매장의 홈/사진/정보/리뷰 탭을 전환하며 보여줍니다.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { useHeartPop } from '../../hooks/useHeartPop';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import TabBar from '../../components/TabBar';
import PhotoViewerModal, {
  PhotoViewerState,
} from '../../components/PhotoViewerModal';
import SortBottomSheet, { SortOption } from '../../components/SortBottomSheet';
import { colors } from '../../styles/colors';
import { storeAPI } from '../../api/apiClient';
import { useMockMode } from '../../contexts/MockModeContext';
import { formatWeeklyHours, getOpenStatus, type BusinessHour } from '../../utils/storeHours';
import HeartIcon from '../../assets/storeheart.svg';
import HeartFilledIcon from '../../assets/storeheart-m.svg';
import StarIcon from '../../assets/star.svg';
import StarGrayIcon from '../../assets/star-g.svg';
import TimeIcon from '../../assets/time.svg';
import DropdownIcon from '../../assets/dropdown.svg';
import DropdownReIcon from '../../assets/dropdown-re.svg';
import CallIcon from '../../assets/call.svg';
import MapGrayIcon from '../../assets/map-g.svg';
import NextIcon from '../../assets/next-b.svg';
import NextGrayIcon from '../../assets/next.svg';
import MapStoreIcon from '../../assets/map_store.svg';
import ParkingIcon from '../../assets/store-parking.svg';
import ToiletIcon from '../../assets/store-toilet.svg';
import ElevatorIcon from '../../assets/store-elevator.svg';
import WheelchairIcon from '../../assets/store-wheelchair.svg';
import PetIcon from '../../assets/store-pet.svg';
import { styles } from './StoreDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'StoreDetail'>;

type TabType = 'home' | 'photo' | 'info' | 'review';

const TAB_LABELS: { key: TabType; label: string }[] = [
  { key: 'home', label: '홈' },
  { key: 'photo', label: '사진' },
  { key: 'info', label: '정보' },
  { key: 'review', label: '리뷰' },
];

type PhotoCategory = 'all' | 'outside' | 'inside' | 'product';

const PHOTO_CATEGORIES: { key: PhotoCategory; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'outside', label: '외부' },
  { key: 'inside', label: '내부' },
  { key: 'product', label: '상품' },
];

const PRODUCT_CATEGORIES = ['피규어', '아크릴', '키링', '한정판'];

// 서버 편의시설 코드 → 아이콘 (WIFI는 아이콘이 없어 제외)
const AMENITY_ICONS: Record<string, ReturnType<typeof require>> = {
  PARKING: ParkingIcon,
  RESTROOM: ToiletIcon,
  ELEVATOR: ElevatorIcon,
  WHEELCHAIR_ACCESS: WheelchairIcon,
  PET_FRIENDLY: PetIcon,
};
const AMENITY_CODES = ['PARKING', 'RESTROOM', 'ELEVATOR'];
const GUIDE_CODES = ['WHEELCHAIR_ACCESS', 'PET_FRIENDLY'];

type Review = {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  rating: number;
  createdAt: string;
  content: string;
  images: string[];
};

type ReviewSummary = { count: number; average: number | null; counts: number[] };

// 리뷰 사진(최대 3장): 가로 페이징, 2장 이상이면 우하단에 현재 페이지 표시
const ReviewImages = ({
  images,
  onPressImage,
}: {
  images: string[];
  onPressImage: (index: number) => void;
}) => {
  const [page, setPage] = useState(0);
  return (
    <View style={styles.reviewImageBox}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e =>
          setPage(Math.round(e.nativeEvent.contentOffset.x / 104))
        }
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => onPressImage(index)}
          >
            <Image source={{ uri: image }} style={styles.reviewImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.reviewImagePagination}>
          <Text style={styles.reviewImagePaginationText}>
            {page + 1}
            <Text style={styles.reviewImagePaginationTextMuted}>
              /{images.length}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

type OtherStore = { id: string; name: string; latitude: number; longitude: number; distanceMeters: number };

const formatDistance = (m: number) => (m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`);

type Amenity = { code: string; label: string; status: string };

type StoreDetail = {
  address: string;
  phone: string | null;
  businessHours: BusinessHour[];
  description: string | null;
  images: string[];
  amenities: Amenity[];
};

const toReview = (r: any): Review => ({
  id: String(r.reviewId),
  nickname: r.author?.nickname ?? '',
  avatarUrl: r.author?.profileImageUrl ?? null,
  rating: r.rating,
  createdAt: r.createdAt,
  content: r.content,
  images: (r.images ?? []).map((i: any) => i.imageUrl),
});

const formatReviewDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');

const StoreDetailScreen = ({ navigation, route }: Props) => {
  const { storeId, storeName, latitude, longitude } = route.params;
  const { isMockMode } = useMockMode();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [detail, setDetail] = useState<StoreDetail | null>(null);
  const [summary, setSummary] = useState<ReviewSummary>({ count: 0, average: null, counts: [0, 0, 0, 0, 0] });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<any>(null); // 내가 쓴 리뷰 (없으면 null)
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);

  // 매장 상세(주소·전화·영업시간·관심 여부) 조회. Mock 모드에는 해당 데이터가 없어 건너뜀.
  const loadDetail = useCallback(async () => {
    if (isMockMode) return;
    try {
      const res = await storeAPI.getStore(storeId);
      const d = res.data.data;
      setDetail({
        address: d.address,
        phone: d.phone ?? null,
        businessHours: d.businessHours ?? [],
        description: d.description ?? null,
        images: (d.images ?? []).map((i: any) => i.imageUrl),
        amenities: d.amenities ?? [],
      });
      setIsFavorite(!!d.favorited);
    } catch (e) {
      console.error('매장 상세 조회 실패:', e);
    }
  }, [storeId, isMockMode]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // 다른 가게 추천 (반경 5km, 최대 6개). 실패하면 섹션을 숨긴다.
  const [otherStores, setOtherStores] = useState<OtherStore[]>([]);
  useEffect(() => {
    if (isMockMode) return;
    storeAPI
      .getRecommendations(storeId, 5, 6)
      .then(res =>
        setOtherStores(
          res.data.data.stores.map((s: any) => ({
            id: String(s.id),
            name: s.name,
            latitude: s.latitude,
            longitude: s.longitude,
            distanceMeters: s.distanceMeters,
          })),
        ),
      )
      .catch(e => console.error('다른 가게 추천 조회 실패:', e));
  }, [storeId, isMockMode]);

  // 리뷰 집계·목록·사진: 리뷰 작성 후 돌아올 때도 다시 조회한다.
  // ponytail: 리뷰는 첫 페이지(20개)·사진은 5장만 조회. 더 필요하면 페이지네이션 추가.
  const loadReviews = useCallback(async () => {
    if (isMockMode) return;
    try {
      const [sum, list, photos, mine] = await Promise.all([
        storeAPI.getReviewSummary(storeId),
        storeAPI.getReviews(storeId, 0, 20),
        storeAPI.getReviewImages(storeId, 0, 5),
        storeAPI.getMyReview(storeId).catch(() => null), // 실패해도 리뷰 목록은 보이게
      ]);
      setMyReview(mine?.data.data?.review ?? null);
      const s = sum.data.data;
      setSummary({
        count: s.reviewCount ?? 0,
        average: s.averageRating ?? null,
        counts: [5, 4, 3, 2, 1].map(n => s.ratingCounts?.[n] ?? 0),
      });
      setReviews(list.data.data.content.filter((r: any) => !r.hidden).map(toReview));
      setReviewPhotos(photos.data.data.content.map((p: any) => p.imageUrl));
    } catch (e) {
      console.error('매장 리뷰 조회 실패:', e);
    }
  }, [storeId, isMockMode]);

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [loadReviews]),
  );
  const refreshControl = useRefreshControl(() => Promise.all([loadDetail(), loadReviews()]));

  const confirmDeleteReview = () =>
    Alert.alert('리뷰 삭제', '내 리뷰를 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await storeAPI.deleteReview(myReview.reviewId);
            await loadReviews();
          } catch (e) {
            console.error('리뷰 삭제 실패:', e);
            Alert.alert('리뷰 삭제', '리뷰를 삭제하지 못했어요. 다시 시도해주세요.');
          }
        },
      },
    ]);

  const { scale: heartScale, play: playHeartPop } = useHeartPop();

  // 관심 매장 등록/해제: 먼저 화면에 반영하고 실패하면 되돌린다.
  const toggleFavorite = async () => {
    const next = !isFavorite;
    if (next) playHeartPop();
    setIsFavorite(next);
    if (isMockMode) return;
    try {
      await (next ? storeAPI.addFavoriteStore(storeId) : storeAPI.removeFavoriteStore(storeId));
    } catch (e) {
      console.error('관심 매장 변경 실패:', e);
      setIsFavorite(!next);
    }
  };

  const openStatus = detail ? getOpenStatus(detail.businessHours) : null;
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewer, setViewer] = useState<PhotoViewerState | null>(null);
  const [reviewSort, setReviewSort] = useState<SortOption>('최신순');
  const { width: windowWidth } = useWindowDimensions();
  // 날짜가 'YYYY.MM.DD' 형식이라 문자열 비교로 정렬 가능
  const sortedReviews = [...reviews].sort((a, b) =>
    reviewSort === '최신순'
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt),
  );
  const storePhotos = detail?.images ?? [];
  const amenitiesOf = (codes: string[]) =>
    (detail?.amenities ?? []).filter(a => codes.includes(a.code) && AMENITY_ICONS[a.code]);
  const photoGridImageSize = (windowWidth - 16 * 2 - 12) / 2;

  const handleOpenDirections = () => {
    const dname = encodeURIComponent(storeName);
    const nmapUrl = `nmap://route/public?dlat=${latitude}&dlng=${longitude}&dname=${dname}`;
    // ponytail: 앱 미설치 시 정확한 길찾기 대신 매장명 검색으로만 폴백. 웹 길찾기 URL 필요해지면 교체.
    const webFallbackUrl = `https://map.naver.com/v5/search/${dname}`;
    Linking.openURL(nmapUrl).catch(() => Linking.openURL(webFallbackUrl));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title="매장상세"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              {isFavorite ? (
                <HeartFilledIcon width={20} height={18} />
              ) : (
                <HeartIcon width={20} height={18} />
              )}
            </Animated.View>
          </TouchableOpacity>
        }
      />

      <TabBar
        tabs={TAB_LABELS}
        activeTab={activeTab}
        onChange={setActiveTab}
        activeTextColor={colors.sub07}
      />

      <ScrollView
        refreshControl={refreshControl}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'home' && (
          <View style={styles.homeContent}>
            <View style={styles.titleRow}>
              <Text style={styles.storeNameText} numberOfLines={1}>
                {storeName}
              </Text>
              <View style={styles.ratingGroup}>
                <StarIcon width={18} height={17} />
                <Text style={styles.ratingText}>{summary.average?.toFixed(1) ?? '-'}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoScroll}
              contentContainerStyle={styles.photoScrollContent}
            >
              {storePhotos.length === 0 && <View style={styles.photoImage} />}
              {storePhotos.slice(0, 3).map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.photoImage} />
              ))}
            </ScrollView>

            {openStatus && (
              <View style={styles.hoursRow}>
                <TimeIcon width={16} height={16} />
                <Text style={styles.hoursText}>
                  {openStatus.status === 'OPEN' ? (
                    <>
                      영업 중 <Text style={styles.hoursDivider}>ㅣ</Text>{' '}
                      {openStatus.closeTime}에 영업종료
                    </>
                  ) : openStatus.status === 'CLOSED' ? (
                    '영업 종료'
                  ) : (
                    '영업시간 정보 없음'
                  )}
                </Text>
                {openStatus.status !== 'UNKNOWN' && (
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setIsHoursOpen(prev => !prev)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    {isHoursOpen ? (
                      <DropdownReIcon width={14} height={8} />
                    ) : (
                      <DropdownIcon width={12} height={7} />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
            {isHoursOpen && detail && (
              <Text style={styles.hoursDetailText}>
                {formatWeeklyHours(detail.businessHours).join('\n')}
              </Text>
            )}

            {!!detail?.phone && (
              <View style={styles.infoRow}>
                <CallIcon width={16} height={16} />
                <Text style={styles.infoText}>{detail.phone}</Text>
              </View>
            )}

            {!!detail?.address && (
              <View style={styles.infoRow}>
                <MapGrayIcon width={16} height={21} />
                <Text style={styles.infoText}>{detail.address}</Text>
              </View>
            )}

            <View style={styles.mapCard}>
              <View style={styles.mapCardInner}>
                <NaverMapView
                  style={styles.mapPreviewMap}
                  initialCamera={{ latitude, longitude, zoom: 16 }}
                  isScrollGesturesEnabled={false}
                  isZoomGesturesEnabled={false}
                  isRotateGesturesEnabled={false}
                  isTiltGesturesEnabled={false}
                  isStopGesturesEnabled={false}
                  isShowLocationButton={false}
                  isShowZoomControls={false}
                  isShowCompass={false}
                  isShowScaleBar={false}
                >
                  <NaverMapMarkerOverlay
                    latitude={latitude}
                    longitude={longitude}
                    width={32}
                    height={32}
                  >
                    <MapStoreIcon width={32} height={32} />
                  </NaverMapMarkerOverlay>
                </NaverMapView>
                <TouchableOpacity
                  style={styles.mapDirectionsRow}
                  activeOpacity={0.8}
                  onPress={handleOpenDirections}
                >
                  <Text style={styles.mapPreviewButtonText}>
                    네이버지도로 길찾기
                  </Text>
                  <NextIcon width={6} height={10} />
                </TouchableOpacity>
              </View>
            </View>

            {otherStores.length > 0 && (
              <>
                <Text style={styles.otherStoresTitle}>다른가게 추천</Text>
                <View style={styles.otherStoresGrid}>
                  {[0, 1]
                    .filter(rowIndex => otherStores.length > rowIndex * 3)
                    .map(rowIndex => (
                      <View key={rowIndex} style={styles.otherStoresRow}>
                        {otherStores.slice(rowIndex * 3, rowIndex * 3 + 3).map(store => (
                          <TouchableOpacity
                            key={store.id}
                            style={styles.otherStoreItem}
                            activeOpacity={0.7}
                            onPress={() =>
                              navigation.push('StoreDetail', {
                                storeId: store.id,
                                storeName: store.name,
                                latitude: store.latitude,
                                longitude: store.longitude,
                              })
                            }
                          >
                            <View style={styles.otherStoreImage} />
                            <Text style={styles.otherStoreName} numberOfLines={1}>
                              {store.name}
                            </Text>
                            {/* 추천 응답에는 영업 상태가 없어 거리를 표시 */}
                            <Text style={styles.otherStoreStatus}>
                              {formatDistance(store.distanceMeters)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))}
                </View>
              </>
            )}
          </View>
        )}
        {activeTab === 'photo' && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryPhotoScroll}
              contentContainerStyle={styles.categoryPhotoScrollContent}
            >
              {PHOTO_CATEGORIES.map(item => {
                const isActive = photoCategory === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.categoryPhotoItem}
                    activeOpacity={0.8}
                    onPress={() => setPhotoCategory(item.key)}
                  >
                    <Image
                      source={
                        isActive
                          ? require('../../assets/store-active.png')
                          : require('../../assets/store.png')
                      }
                      style={styles.categoryPhotoImage}
                    />
                    {!isActive && (
                      <>
                        <View style={styles.categoryPhotoDim} />
                        <Text style={styles.categoryPhotoLabel}>
                          {item.label}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {photoCategory !== 'all' || storePhotos.length === 0 ? (
              <Text style={styles.photoEmptyText}>
                등록된 사진이 없습니다
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.photoGrid}>
                  {storePhotos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo }}
                      style={[
                        styles.photoGridImage,
                        {
                          width: photoGridImageSize,
                          height: photoGridImageSize,
                        },
                      ]}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        )}
        {activeTab === 'info' && (
          <View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>매장 소개</Text>
              <View style={styles.infoDescriptionBox}>
                {detail?.description ? (
                  <Text style={styles.infoDescriptionText}>
                    {detail.description}
                  </Text>
                ) : (
                  <Text style={styles.infoDescriptionEmptyText}>
                    매장 소개가 없습니다.
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.infoDivider} />

            <View style={styles.productSection}>
              <Text style={styles.infoTitle}>취급 상품</Text>
              <View style={styles.productBadgeRow}>
                {PRODUCT_CATEGORIES.map(category => (
                  <View key={category} style={styles.productBadge}>
                    <Text style={styles.productBadgeText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.amenitySection}>
              <Text style={styles.infoTitle}>편의시설</Text>
              <View style={styles.amenityRow}>
                {amenitiesOf(AMENITY_CODES).map(({ code, label, status }) => {
                  const Icon = AMENITY_ICONS[code];
                  return (
                    <View key={code} style={[styles.amenityItem, status !== 'AVAILABLE' && { opacity: 0.4 }]}>
                      <Icon width={36} height={36} />
                      <Text style={styles.amenityText}>{label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.guideSection}>
              <Text style={styles.infoTitle}>이용안내</Text>
              <View style={styles.amenityRow}>
                {amenitiesOf(GUIDE_CODES).map(({ code, label, status }) => {
                  const Icon = AMENITY_ICONS[code];
                  return (
                    <View key={code} style={[styles.amenityItem, status !== 'AVAILABLE' && { opacity: 0.4 }]}>
                      <Icon width={36} height={36} />
                      <Text style={styles.amenityText}>{label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
        {activeTab === 'review' && (
          <View>
            <View style={styles.reviewSummary}>
              <StarIcon width={40} height={40} />
              <Text style={styles.reviewAverage}>{summary.average?.toFixed(1) ?? '-'}</Text>
              <Text style={styles.reviewTotal}>({summary.count})</Text>
            </View>
            <View style={styles.ratingList}>
              {summary.counts.map((count, index) => (
                <View key={index} style={styles.ratingRow}>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map(n =>
                      n <= 5 - index ? (
                        <StarIcon key={n} width={14} height={14} />
                      ) : (
                        <StarGrayIcon key={n} width={14} height={14} />
                      ),
                    )}
                  </View>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingBarFill,
                        { width: `${summary.count ? (count / summary.count) * 100 : 0}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingCount}>({count})</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.reviewWriteButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ReviewWrite', {
                    storeId,
                    review: myReview && {
                      id: myReview.reviewId,
                      version: myReview.version,
                      rating: myReview.rating,
                      content: myReview.content,
                      images: myReview.images ?? [],
                    },
                  })
                }
              >
                <Text style={styles.reviewWriteText}>{myReview ? '리뷰 수정하기' : '리뷰 작성하기'}</Text>
              </TouchableOpacity>
              {myReview && (
                <TouchableOpacity style={styles.reviewWriteButton} activeOpacity={0.8} onPress={confirmDeleteReview}>
                  <Text style={styles.reviewWriteText}>리뷰 삭제하기</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.reviewDivider} />

            <View style={styles.reviewPhotoSection}>
              <View style={styles.reviewPhotoHeader}>
                <Text style={styles.reviewPhotoTitle}>사진 모아보기</Text>
                <TouchableOpacity
                  style={styles.reviewPhotoMore}
                  onPress={() => navigation.navigate('ReviewPhotos', { storeId })}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.reviewPhotoMoreText}>더보기</Text>
                  <NextGrayIcon width={6} height={10} />
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.reviewPhotoScroll}
                contentContainerStyle={styles.reviewPhotoList}
              >
                {reviewPhotos.map((uri, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() =>
                      setViewer({ images: reviewPhotos.map(u => ({ uri: u })), index: i })
                    }
                  >
                    <Image source={{ uri }} style={styles.reviewPhotoImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.infoDivider} />

            <View style={styles.reviewHeader}>
              <View style={styles.reviewHeaderLeft}>
                <Text style={styles.reviewHeaderTitle}>리뷰</Text>
                <Text style={styles.reviewHeaderCount}>({summary.count})</Text>
              </View>
              <TouchableOpacity
                style={styles.reviewSort}
                onPress={() => setIsSortOpen(true)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.reviewSortText}>{reviewSort}</Text>
                <DropdownIcon width={12} height={7} />
              </TouchableOpacity>
            </View>
            <View style={styles.reviewList}>
              {sortedReviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewCardTop}>
                    {review.avatarUrl ? (
                      <Image source={{ uri: review.avatarUrl }} style={styles.reviewAvatar} />
                    ) : (
                      <View style={styles.reviewAvatar} />
                    )}
                    <View style={styles.reviewUser}>
                      <Text style={styles.reviewNickname}>
                        {review.nickname}
                      </Text>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map(n =>
                          n <= review.rating ? (
                            <StarIcon key={n} width={14} height={14} />
                          ) : (
                            <StarGrayIcon key={n} width={14} height={14} />
                          ),
                        )}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{formatReviewDate(review.createdAt)}</Text>
                  </View>
                  <View style={styles.reviewBody}>
                    <Text style={styles.reviewContent}>{review.content}</Text>
                    {review.images.length > 0 && (
                      <ReviewImages
                        images={review.images}
                        onPressImage={index =>
                          setViewer({ images: review.images.map(u => ({ uri: u })), index })
                        }
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <PhotoViewerModal viewer={viewer} onClose={() => setViewer(null)} />

      <SortBottomSheet
        visible={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selectedSort={reviewSort}
        onSelect={setReviewSort}
        compact
      />
    </SafeAreaView>
  );
};

export default StoreDetailScreen;
