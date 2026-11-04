/**
 * 컴포넌트: 별점등록 팝업 (RatingPopup)
 * 역할: 구매확정 시 상품의 별점(1~5)을 선택받는 팝업입니다. 선택한 별까지 채워집니다.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styles } from './RatingPopup.styles';
import StarIcon from '../assets/star.svg';
import StarEmptyIcon from '../assets/star-g.svg';

interface RatingPopupProps {
  visible: boolean;
  onConfirm: (rating: number) => void;
}

const STARS = [1, 2, 3, 4, 5];

const RatingPopup = ({ visible, onConfirm }: RatingPopupProps) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (visible) setRating(0);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>별점등록</Text>
              <Text style={styles.count}>({rating}/5)</Text>
            </View>
            <View style={styles.stars}>
              {STARS.map(n => {
                const Icon = n <= rating ? StarIcon : StarEmptyIcon;
                return (
                  <TouchableOpacity key={n} activeOpacity={0.7} onPress={() => setRating(n)}>
                    <Icon width={40} height={40} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <TouchableOpacity style={styles.confirmButton} activeOpacity={0.7} onPress={() => onConfirm(rating)}>
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RatingPopup;
