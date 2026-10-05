/**
 * 컴포넌트: 사진 상세보기 모달 (PhotoViewerModal)
 * 역할: 사진을 어두운 배경(dim) 위에 가로 꽉 차게 보여주며, 여러 장이면 좌우 스와이프로 넘겨 봅니다.
 *       사진 바로 위 닫기(exit) 버튼으로 닫습니다.
 */
import React from 'react';
import {
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import ExitWhiteIcon from '../assets/exit-w.svg';
import { styles } from './PhotoViewerModal.styles';

export interface PhotoViewerState {
  images: ImageSourcePropType[];
  index: number;
}

interface PhotoViewerModalProps {
  viewer: PhotoViewerState | null;
  onClose: () => void;
}

const PhotoViewerModal = ({ viewer, onClose }: PhotoViewerModalProps) => {
  const { width } = useWindowDimensions();

  return (
    <Modal
      transparent
      visible={!!viewer}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="닫기"
        >
          <ExitWhiteIcon width={20} height={20} />
        </TouchableOpacity>
        {viewer && (
          <ScrollView
            style={styles.pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: viewer.index * width, y: 0 }}
          >
            {viewer.images.map((image, i) => {
              // 가로를 화면 폭에 맞추고 세로는 원본 비율을 따름 (크기 정보가 없으면 정사각형)
              const meta = Image.resolveAssetSource(image);
              const ratio = meta?.width && meta?.height ? meta.width / meta.height : 1;
              return (
                <Image
                  key={i}
                  source={image}
                  style={{ width, height: width / ratio }}
                  resizeMode="stretch"
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default PhotoViewerModal;
