/**
 * 화면: 사진 모아보기 화면 (ReviewPhotosScreen)
 * 역할: 매장상세 리뷰 탭의 '더보기'를 눌렀을 때 진입하며, 리뷰 사진을 한 줄 3장 그리드로 보여줍니다.
 */
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import PhotoViewerModal, {
  PhotoViewerState,
} from '../../components/PhotoViewerModal';
import { styles, PHOTO_GAP } from './ReviewPhotosScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewPhotos'>;

const COLUMNS = 3;

// ponytail: 리뷰 사진 API 미연동으로 동일 이미지를 채워둠. API 붙으면 실제 목록으로 교체.
const PHOTOS = Array.from({ length: 21 }, (_, index) => ({
  id: String(index),
  source: require('../../assets/store.png'),
}));

const PHOTO_SOURCES = PHOTOS.map(photo => photo.source);

const ReviewPhotosScreen =({ navigation }: Props) => {
  const { width } = useWindowDimensions();
  const [viewer, setViewer] = useState<PhotoViewerState | null>(null);
  // 393px 기준 129px, 화면 폭이 달라도 3열이 꽉 차도록 계산
  const size = (width - PHOTO_GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="사진 모아보기" onBack={() => navigation.goBack()} />
      <FlatList
        data={PHOTOS}
        keyExtractor={item => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setViewer({ images: PHOTO_SOURCES, index })}
          >
            <Image source={item.source} style={{ width: size, height: size }} />
          </TouchableOpacity>
        )}
      />
      <PhotoViewerModal viewer={viewer} onClose={() => setViewer(null)} />
    </SafeAreaView>
  );
};

export default ReviewPhotosScreen;
