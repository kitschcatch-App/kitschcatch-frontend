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
import { colors } from '../../styles/colors';
import HeartIcon from '../../assets/storeheart.svg';
import HeartFilledIcon from '../../assets/storeheart-m.svg';
import StarIcon from '../../assets/star.svg';
import TimeIcon from '../../assets/time.svg';
import DropdownIcon from '../../assets/dropdown.svg';
import DropdownReIcon from '../../assets/dropdown-re.svg';
import CallIcon from '../../assets/call.svg';
import MapGrayIcon from '../../assets/map-g.svg';
import NextIcon from '../../assets/next-b.svg';
import MapStoreIcon from '../../assets/map_store.svg';
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
          <View style={styles.content}>
            <Text style={styles.contentText}>사진</Text>
          </View>
        )}
        {activeTab === 'info' && (
          <View style={styles.content}>
            <Text style={styles.contentText}>정보</Text>
          </View>
        )}
        {activeTab === 'review' && (
          <View style={styles.content}>
            <Text style={styles.contentText}>리뷰</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreDetailScreen;
