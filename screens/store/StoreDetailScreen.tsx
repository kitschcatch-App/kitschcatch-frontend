/**
 * 화면: 매장상세 화면 (StoreDetailScreen)
 * 역할: 매장지도 화면의 매장 팝업에서 '상세정보'를 눌렀을 때 진입하며,
 *       매장의 홈/사진/정보/리뷰 탭을 전환하며 보여줍니다.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
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
import CardIcon from '../../assets/store-card.svg';
import ParkingIcon from '../../assets/store-parking.svg';
import ToiletIcon from '../../assets/store-toilet.svg';
import ElevatorIcon from '../../assets/store-elevator.svg';
import PhotoIcon from '../../assets/store-photo.svg';
import WheelchairIcon from '../../assets/store-wheelchair.svg';
import ReservationIcon from '../../assets/store-reservation.svg';
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

const STORE_PHOTOS = [
  require('../../assets/product_img.png'),
  require('../../assets/product_img.png'),
  require('../../assets/product_img.png'),
];

type PhotoCategory = 'all' | 'outside' | 'inside' | 'product';

const PHOTO_CATEGORIES: { key: PhotoCategory; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'outside', label: '외부' },
  { key: 'inside', label: '내부' },
  { key: 'product', label: '상품' },
];

// ponytail: 카테고리별 사진이 실제로는 없어 동일 이미지를 채워둠. API 붙으면 카테고리별 목록으로 교체.
const PHOTOS_BY_CATEGORY: Record<PhotoCategory, ReturnType<typeof require>[]> =
  {
    all: Array.from({ length: 9 }, () => require('../../assets/store.png')),
    outside: Array.from({ length: 4 }, () => require('../../assets/store.png')),
    inside: Array.from({ length: 4 }, () => require('../../assets/store.png')),
    product: [],
  };

// ponytail: 매장 소개 API 미연동으로 mock 텍스트 사용. 빈 문자열이면 빈 상태 노출.
const STORE_DESCRIPTION =
  '홍대입구역 4번 출구 도보 1분 거리에 위치한 서브컬처 굿즈 전문 매장입니다. 다양한 애니메이션, 게임 관련 굿즈를 만나보실 수 있습니다.';

const REVIEW_PHOTOS = Array.from({ length: 5 }, () =>
  require('../../assets/store.png'),
);

const PRODUCT_CATEGORIES = ['피규어', '아크릴', '키링', '한정판'];

const AMENITIES = [
  { Icon: CardIcon, label: '카드결제' },
  { Icon: ParkingIcon, label: '주차가능' },
  { Icon: ToiletIcon, label: '화장실' },
  { Icon: ElevatorIcon, label: '엘리베이터' },
];

const GUIDE_INFO = [
  { Icon: PhotoIcon, label: '사진촬영 가능' },
  { Icon: WheelchairIcon, label: '휠체어 가능' },
  { Icon: ReservationIcon, label: '예약 불가' },
  { Icon: PetIcon, label: '반려동물 불가' },
];

// ponytail: 리뷰 API 미연동으로 mock 집계 사용. 인덱스 0~4 = 별 5개~1개 리뷰 수.
const RATING_COUNTS = [52, 43, 16, 5, 2];
const REVIEW_TOTAL = RATING_COUNTS.reduce((a, b) => a + b, 0);

// ponytail: 리뷰 API 미연동으로 mock 목록 사용. image가 있으면 본문 옆에 썸네일 노출.
const REVIEWS: {
  id: string;
  nickname: string;
  rating: number;
  date: string;
  content: string;
  images?: ReturnType<typeof require>[];
}[] = [
  {
    id: '1',
    nickname: '집에가고싶다',
    rating: 5,
    date: '2026.08.21',
    content: '상품종류가 다양하고 볼것도 많아요.',
  },
  {
    id: '2',
    nickname: '집에가고싶다',
    rating: 4,
    date: '2026.08.20',
    content: '상품종류가 다양하고 볼것도 많아요.',
    images: [
      require('../../assets/store.png'),
      require('../../assets/store.png'),
      require('../../assets/store.png'),
    ],
  },
];

// 리뷰 사진(최대 3장): 가로 페이징, 2장 이상이면 우하단에 현재 페이지 표시
const ReviewImages = ({
  images,
  onPressImage,
}: {
  images: ReturnType<typeof require>[];
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
            <Image source={image} style={styles.reviewImage} />
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

const OTHER_STORES = Array.from({ length: 6 }, (_, index) => ({
  id: String(index),
  name: '매장명',
  image: require('../../assets/product_img.png'),
}));

const StoreDetailScreen = ({ navigation, route }: Props) => {
  const { storeName, latitude, longitude } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewer, setViewer] = useState<PhotoViewerState | null>(null);
  const [reviewSort, setReviewSort] = useState<SortOption>('최신순');
  const { width: windowWidth } = useWindowDimensions();
  // 날짜가 'YYYY.MM.DD' 형식이라 문자열 비교로 정렬 가능
  const sortedReviews = [...REVIEWS].sort((a, b) =>
    reviewSort === '최신순'
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date),
  );
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
            onPress={() => setIsFavorite(prev => !prev)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {isFavorite ? (
              <HeartFilledIcon width={20} height={18} />
            ) : (
              <HeartIcon width={20} height={18} />
            )}
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
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoScroll}
              contentContainerStyle={styles.photoScrollContent}
            >
              {STORE_PHOTOS.slice(0, 3).map((photo, index) => (
                <Image key={index} source={photo} style={styles.photoImage} />
              ))}
            </ScrollView>

            <View style={styles.hoursRow}>
              <TimeIcon width={16} height={16} />
              <Text style={styles.hoursText}>
                영업 중 <Text style={styles.hoursDivider}>ㅣ</Text> 21:00에
                영업종료
              </Text>
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
            </View>
            {isHoursOpen && (
              <Text style={styles.hoursDetailText}>매일 11:00 ~ 21:00</Text>
            )}

            <View style={styles.infoRow}>
              <CallIcon width={16} height={16} />
              <Text style={styles.infoText}>02-322-2176</Text>
            </View>

            <View style={styles.infoRow}>
              <MapGrayIcon width={16} height={21} />
              <Text style={styles.infoText}>
                서울 마포구 양화로 188 AK&홍대 5층
              </Text>
            </View>

            <View style={styles.subwayRow}>
              <View style={styles.subwayCapsule}>
                <Text style={styles.subwayCapsuleText}>홍대입구역</Text>
              </View>
              <Text style={styles.subwayText}>4번 출구 도보 1분</Text>
            </View>

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

            <Text style={styles.otherStoresTitle}>다른가게 추천</Text>
            <View style={styles.otherStoresGrid}>
              {[0, 1].map(rowIndex => (
                <View key={rowIndex} style={styles.otherStoresRow}>
                  {OTHER_STORES.slice(rowIndex * 3, rowIndex * 3 + 3).map(
                    store => (
                      <View key={store.id} style={styles.otherStoreItem}>
                        <Image
                          source={store.image}
                          style={styles.otherStoreImage}
                        />
                        <Text style={styles.otherStoreName} numberOfLines={1}>
                          {store.name}
                        </Text>
                        <Text style={styles.otherStoreStatus}>영업중</Text>
                      </View>
                    ),
                  )}
                </View>
              ))}
            </View>
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

            {PHOTOS_BY_CATEGORY[photoCategory].length === 0 ? (
              <Text style={styles.photoEmptyText}>
                등록된 사진이 없습니다
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.photoGrid}>
                  {PHOTOS_BY_CATEGORY[photoCategory].map((photo, index) => (
                    <Image
                      key={index}
                      source={photo}
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
                {STORE_DESCRIPTION ? (
                  <Text style={styles.infoDescriptionText}>
                    {STORE_DESCRIPTION}
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
                {AMENITIES.map(({ Icon, label }) => (
                  <View key={label} style={styles.amenityItem}>
                    <Icon width={36} height={36} />
                    <Text style={styles.amenityText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.guideSection}>
              <Text style={styles.infoTitle}>이용안내</Text>
              <View style={styles.amenityRow}>
                {GUIDE_INFO.map(({ Icon, label }) => (
                  <View key={label} style={styles.amenityItem}>
                    <Icon width={36} height={36} />
                    <Text style={styles.amenityText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        {activeTab === 'review' && (
          <View>
            <View style={styles.reviewSummary}>
              <StarIcon width={40} height={40} />
              <Text style={styles.reviewAverage}>4.3</Text>
              <Text style={styles.reviewTotal}>({REVIEW_TOTAL})</Text>
            </View>
            <View style={styles.ratingList}>
              {RATING_COUNTS.map((count, index) => (
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
                        { width: `${(count / REVIEW_TOTAL) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingCount}>({count})</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.reviewWriteButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ReviewWrite')}
              >
                <Text style={styles.reviewWriteText}>리뷰 작성하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewDivider} />

            <View style={styles.reviewPhotoSection}>
              <View style={styles.reviewPhotoHeader}>
                <Text style={styles.reviewPhotoTitle}>사진 모아보기</Text>
                <TouchableOpacity
                  style={styles.reviewPhotoMore}
                  onPress={() => navigation.navigate('ReviewPhotos')}
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
                {[0, 1, 2, 3, 4].map(i => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() =>
                      setViewer({ images: REVIEW_PHOTOS, index: i })
                    }
                  >
                    <Image source={REVIEW_PHOTOS[i]} style={styles.reviewPhotoImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.infoDivider} />

            <View style={styles.reviewHeader}>
              <View style={styles.reviewHeaderLeft}>
                <Text style={styles.reviewHeaderTitle}>리뷰</Text>
                <Text style={styles.reviewHeaderCount}>({REVIEW_TOTAL})</Text>
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
                    <View style={styles.reviewAvatar} />
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
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.reviewBody}>
                    <Text style={styles.reviewContent}>{review.content}</Text>
                    {review.images && review.images.length > 0 && (
                      <ReviewImages
                        images={review.images}
                        onPressImage={index =>
                          setViewer({ images: review.images!, index })
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
