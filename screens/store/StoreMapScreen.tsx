/**
 * 화면: 매장지도 화면 (StoreMapScreen)
 * 역할: 하단 네비게이션의 '매장정보' 탭으로 진입하며, 내 위치 주변의 매장을 지도에 보여주는 화면입니다.
 *       위치 권한 요청 → 현재 위치로 카메라 이동 → 주변 매장 조회 → 마커 표시 순으로 동작합니다.
 *       위치/조회 로직은 utils/storeMap.ts로 분리돼 있습니다.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNav from '../../components/BottomNav';
import SearchGrayIcon from '../../assets/search-g.svg';
import MapStoreIcon from '../../assets/map_store.svg';
import MapHeartIcon from '../../assets/map_heart.svg';
import StarIcon from '../../assets/star.svg';
import NextIcon from '../../assets/next-b.svg';
import { useMockMode } from '../../contexts/MockModeContext';
import { storeAPI } from '../../api/apiClient';
import { getOpenStatus, type BusinessHour } from '../../utils/storeHours';
import {
  DEFAULT_COORD,
  DEFAULT_RADIUS_KM,
  RADIUS_OPTIONS,
  calculateZoomForRadius,
  fetchStores,
  getCurrentCoord,
  requestLocationPermission,
  type Coord,
  type RadiusKm,
  type Store,
} from '../../utils/storeMap';
import { styles } from './StoreMapScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'StoreMap'>;

const MARKER_FOCUS_ZOOM = 16;
const MARKER_SIZE = 40;
const MARKER_SIZE_SELECTED = 56;

const StoreMapScreen = ({ navigation }: Props) => {
  const { isMockMode } = useMockMode();
  const mapRef = useRef<NaverMapViewRef>(null);
  const { width: screenWidth } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [coord, setCoord] = useState<Coord>(DEFAULT_COORD);
  // onInitialized 콜백에서 최신 좌표를 참조하기 위한 미러
  const coordRef = useRef(coord);
  useEffect(() => {
    coordRef.current = coord;
  }, [coord]);
  // 처음에는 반경을 선택하지 않고 전국 매장을 보여준다. 선택한 버튼을 다시 누르면 해제(null).
  const [radiusKm, setRadiusKm] = useState<RadiusKm | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLocating, setIsLocating] = useState(true);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  // 다시 클릭하면 56x56으로 커지는 선택된 매장 핀
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  // 팝업이 등장/퇴장 애니메이션 중에도 마지막 매장 정보를 유지하기 위한 상태
  const [popupStore, setPopupStore] = useState<Store | null>(null);
  // 매장 상세 팝업이 아래→위로 올라오고 위→아래로 내려가는 애니메이션 값
  const popupAnim = useRef(new Animated.Value(0)).current;
  // 선택한 매장의 영업시간 (nearby 응답에는 없어 상세 API로 조회)
  const [popupHours, setPopupHours] = useState<BusinessHour[] | null>(null);
  // 선택한 매장의 대표 사진 (목록 응답에는 없어 상세 API로 조회). 없으면 회색 배경
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [popupRating, setPopupRating] = useState<number | null>(null);
  // 매장 상세에서 관심 등록을 바꾸고 돌아오면 마커(하트)를 갱신하기 위한 재조회 트리거
  const [reloadKey, setReloadKey] = useState(0);
  const isInitialFocus = useRef(false);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (!isInitialFocus.current) {
        isInitialFocus.current = true;
        return;
      }
      setReloadKey(k => k + 1);
    });
  }, [navigation]);

  // [1] 위치 권한 요청 → [2] 현재 위치로 카메라 이동
  useEffect(() => {
    let cancelled = false;

    const locate = async () => {
      try {
        const granted = await requestLocationPermission();
        if (cancelled) return;

        if (!granted) {
          setPermissionDenied(true);
          return;
        }

        const current = await getCurrentCoord();
        if (cancelled) return;

        setCoord(current);
      } catch (e) {
        if (!cancelled) {
          console.warn('현재 위치 조회 실패, 기본 위치로 표시합니다.', e);
        }
      } finally {
        if (!cancelled) setIsLocating(false);
      }
    };

    locate();
    return () => {
      cancelled = true;
    };
  }, []);

  // [3] 좌표/반경이 정해지면 주변 매장 조회 → [4] 마커 렌더링
  useEffect(() => {
    if (isLocating) return;
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoadingStores(true);
        const result = await fetchStores(coord, radiusKm, isMockMode);
        if (!cancelled) setStores(result);
      } catch (e) {
        if (!cancelled) {
          console.error('주변 매장 조회 실패:', e);
          setStores([]);
        }
      } finally {
        if (!cancelled) setIsLoadingStores(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [coord, radiusKm, isMockMode, isLocating, reloadKey]);

  // 좌표/반경이 갱신되면 그 반경이 다 보이도록 카메라를 이동 (반경 선택 해제 시에는 지도 위치 유지)
  const prevRadiusKm = useRef(radiusKm);
  useEffect(() => {
    const deselected = radiusKm === null && prevRadiusKm.current !== null;
    prevRadiusKm.current = radiusKm;
    if (deselected) return;

    const zoom = calculateZoomForRadius(
      radiusKm ?? DEFAULT_RADIUS_KM,
      coord.latitude,
      screenWidth,
    );
    mapRef.current?.animateCameraTo({ ...coord, zoom });
  }, [coord, radiusKm, screenWidth]);

  const moveCameraToCurrentCoord = useCallback(() => {
    const zoom = calculateZoomForRadius(
      radiusKm ?? DEFAULT_RADIUS_KM,
      coordRef.current.latitude,
      screenWidth,
    );
    mapRef.current?.animateCameraTo({ ...coordRef.current, zoom });
  }, [radiusKm, screenWidth]);

  const handleMarkerTap = useCallback((store: Store) => {
    mapRef.current?.animateCameraTo({
      latitude: store.latitude,
      longitude: store.longitude,
      zoom: MARKER_FOCUS_ZOOM,
    });
    setSelectedStoreId(prev => (prev === store.storeId ? null : store.storeId));
  }, []);

  const closePopup = useCallback(() => setSelectedStoreId(null), []);

  const selectedStore = stores.find(s => s.storeId === selectedStoreId) ?? null;

  useEffect(() => {
    setPopupHours(null);
    setPopupImage(null);
    setPopupRating(null);
    if (!selectedStoreId || isMockMode) return;
    let cancelled = false;
    storeAPI
      .getStore(selectedStoreId)
      .then(res => {
        if (cancelled) return;
        setPopupHours(res.data?.data?.businessHours ?? []);
        setPopupRating(res.data?.data?.reviewSummary?.averageRating ?? null);
        setPopupImage(res.data?.data?.thumbnailUrl ?? res.data?.data?.images?.[0]?.imageUrl ?? null);
      })
      .catch(e => console.warn('매장 영업시간 조회 실패:', e));
    return () => {
      cancelled = true;
    };
  }, [selectedStoreId, isMockMode]);
  const popupStatus = popupHours ? getOpenStatus(popupHours) : null;

  // 매장 선택 시 아래→위로 올라오고, 선택 해제 시 위→아래로 내려가며 사라짐
  useEffect(() => {
    if (selectedStore) {
      setPopupStore(selectedStore);
      popupAnim.setValue(0);
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (!popupStore) return; // 표시 중인 팝업이 없으면 애니메이션 불필요

    let isActive = true;
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && isActive) setPopupStore(null);
    });
    return () => {
      isActive = false;
    };
  }, [selectedStore, popupStore, popupAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="매장지도" />

      <View style={styles.searchContainer}>
        <SearchGrayIcon width={16} height={18} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          underlineColorAndroid="transparent"
          placeholder="매장을 검색해보세요"
        />
      </View>

      <View style={styles.mapWrapper}>
        <NaverMapView
          ref={mapRef}
          style={styles.map}
          initialCamera={{
            ...DEFAULT_COORD,
            zoom: calculateZoomForRadius(
              DEFAULT_RADIUS_KM,
              DEFAULT_COORD.latitude,
              screenWidth,
            ),
          }}
          isShowLocationButton={!permissionDenied}
          onInitialized={moveCameraToCurrentCoord}
          onTapMap={closePopup}
        >
          {stores.map(store => {
            const size =
              store.storeId === selectedStoreId
                ? MARKER_SIZE_SELECTED
                : MARKER_SIZE;
            const MarkerIcon = store.isFavorite ? MapHeartIcon : MapStoreIcon;
            return (
              <NaverMapMarkerOverlay
                key={store.storeId}
                latitude={store.latitude}
                longitude={store.longitude}
                width={size}
                height={size}
                onTap={() => handleMarkerTap(store)}
              >
                <View key={size} collapsable={false}>
                  <MarkerIcon width={size} height={size} />
                </View>
              </NaverMapMarkerOverlay>
            );
          })}
        </NaverMapView>

        <View style={styles.radiusCapsuleWrapper} pointerEvents="box-none">
          <View style={styles.radiusCapsule}>
            {RADIUS_OPTIONS.map((option, index) => {
              const active = option === radiusKm;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.radiusSegment,
                    index === 0 && styles.radiusSegmentFirst,
                    index === RADIUS_OPTIONS.length - 1 &&
                      styles.radiusSegmentLast,
                    active && styles.radiusSegmentActive,
                  ]}
                  onPress={() => setRadiusKm(prev => (prev === option ? null : option))}
                  activeOpacity={0.8}
                >
                  <Text style={styles.radiusSegmentText}>{option}km</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isLoadingStores && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator />
          </View>
        )}

        {permissionDenied && (
          <View style={styles.permissionBanner}>
            <Text style={styles.permissionBannerText}>
              위치 권한을 허용하면 내 주변 매장을 볼 수 있어요.
            </Text>
          </View>
        )}

        {popupStore && (
          <Animated.View
            style={[
              styles.storePopup,
              {
                opacity: popupAnim,
                transform: [
                  {
                    translateY: popupAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {popupImage ? (
              <Image
                source={{ uri: popupImage }}
                style={styles.storePopupImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.storePopupImage} />
            )}
            <View style={styles.storePopupInfo}>
              <View style={styles.storePopupNameRow}>
                <Text style={styles.storePopupName} numberOfLines={1}>
                  {popupStore.name}
                </Text>
                <View style={styles.storePopupRatingContainer}>
                  <StarIcon width={14} height={14} />
                  <Text style={styles.storePopupRating}>{popupRating?.toFixed(1) ?? '-'}</Text>
                </View>
              </View>
              {popupStatus?.status === 'OPEN' && (
                <View style={styles.storePopupStatusRow}>
                  <Text style={styles.storePopupStatusOpen}>영업 중</Text>
                  <Text style={styles.storePopupStatusDivider}>|</Text>
                  <Text style={styles.storePopupStatusClose}>
                    {popupStatus.closeTime}에 영업종료
                  </Text>
                </View>
              )}
              {popupStatus?.status === 'CLOSED' && (
                <View style={styles.storePopupStatusRow}>
                  <Text style={styles.storePopupStatusClose}>영업 종료</Text>
                </View>
              )}
              <Text style={styles.storePopupAddress} numberOfLines={1}>
                {popupStore.address}
              </Text>
              <View style={styles.storePopupDetailRow}>
                <TouchableOpacity
                  style={styles.storePopupDetailButton}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('StoreDetail', {
                      storeId: popupStore.storeId,
                      storeName: popupStore.name,
                      latitude: popupStore.latitude,
                      longitude: popupStore.longitude,
                    })
                  }
                >
                  <Text style={styles.storePopupDetailButtonText}>
                    상세정보
                  </Text>
                  <NextIcon
                    width={5}
                    height={10}
                    style={styles.storePopupDetailButtonIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      <BottomNav />
    </SafeAreaView>
  );
};

export default StoreMapScreen;
