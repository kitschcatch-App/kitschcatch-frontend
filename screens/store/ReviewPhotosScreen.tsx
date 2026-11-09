/**
 * 화면: 사진 모아보기 화면 (ReviewPhotosScreen)
 * 역할: 매장상세 리뷰 탭의 '더보기'를 눌렀을 때 진입하며, 리뷰 사진을 한 줄 3장 그리드로 보여줍니다.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../styles/colors';
import { storeAPI } from '../../api/apiClient';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import PhotoViewerModal, {
  PhotoViewerState,
} from '../../components/PhotoViewerModal';
import { styles, PHOTO_GAP } from './ReviewPhotosScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewPhotos'>;

const COLUMNS = 3;

const PAGE_SIZE = 30;

const ReviewPhotosScreen = ({ navigation, route }: Props) => {
  const { storeId } = route.params;
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState<{ id: string; uri: string }[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadPage = useCallback(
    async (next: number) => {
      setIsLoading(true);
      try {
        const res = await storeAPI.getReviewImages(storeId, next, PAGE_SIZE);
        const g = res.data.data;
        setPhotos(prev => [...prev, ...g.content.map((p: any) => ({ id: String(p.id), uri: p.imageUrl }))]);
        setPage(next);
        setHasMore(next + 1 < g.totalPages);
      } catch (e) {
        console.error('리뷰 사진 조회 실패:', e);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [storeId],
  );

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const [viewer, setViewer] = useState<PhotoViewerState | null>(null);
  // 393px 기준 129px, 화면 폭이 달라도 3열이 꽉 차도록 계산
  const size = (width - PHOTO_GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="사진 모아보기" onBack={() => navigation.goBack()} />
      <FlatList
        data={photos}
        onEndReachedThreshold={0.5}
        onEndReached={() => hasMore && !isLoading && loadPage(page + 1)}
        keyExtractor={item => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setViewer({ images: photos.map(p => ({ uri: p.uri })), index })}
          >
            <Image source={{ uri: item.uri }} style={{ width: size, height: size, backgroundColor: colors.gray02 }} />
          </TouchableOpacity>
        )}
      />
      <PhotoViewerModal viewer={viewer} onClose={() => setViewer(null)} />
    </SafeAreaView>
  );
};

export default ReviewPhotosScreen;
