/**
 * 컴포넌트: 사진 첨부 (PhotoAttach)
 * 역할: 사진을 최대 3장까지 고르고 삭제하는 '사진 첨부' 섹션입니다. (반품요청·1:1 문의 공용)
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import CameraIcon from '../assets/camera.svg';
import { styles } from './PhotoAttach.styles';

const MAX_PHOTOS = 3;

interface PhotoAttachProps {
  images: Asset[];
  onChange: (images: Asset[]) => void;
  /** 사진 칸 아래에 dot 스타일로 보여줄 안내 문구 */
  notice: string;
}

const PhotoAttach = ({ images, onChange, notice }: PhotoAttachProps) => {
  const handlePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_PHOTOS - images.length,
      quality: 0.8,
    });
    if (result.didCancel || result.errorCode || !result.assets) return;
    onChange([...images, ...result.assets].slice(0, MAX_PHOTOS));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>사진 첨부</Text>
      <View style={styles.photoRow}>
        {/* 3장이 다 차면 카메라 칸도 사진으로 대체 */}
        {images.length < MAX_PHOTOS && (
          <TouchableOpacity style={styles.photoBox} onPress={handlePick}>
            <CameraIcon width={20} height={18} />
            <Text style={styles.photoCountText}>
              {images.length}/{MAX_PHOTOS}
            </Text>
          </TouchableOpacity>
        )}

        {images.map((image, index) => (
          <View key={index}>
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onChange(images.filter((_, i) => i !== index))}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {Array.from({ length: Math.max(0, 2 - images.length) }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.photoBox} />
        ))}
      </View>
      <View style={styles.noticeRow}>
        <Text style={styles.noticeDot}>•</Text>
        <Text style={styles.noticeText}>{notice}</Text>
      </View>
    </View>
  );
};

export default PhotoAttach;
