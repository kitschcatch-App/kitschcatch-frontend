/**
 * 스타일: 사진 모아보기 화면 스타일 (ReviewPhotosScreen.styles)
 * 역할: ReviewPhotosScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

export const PHOTO_GAP = 3;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    gap: PHOTO_GAP,
    marginBottom: PHOTO_GAP,
  },
});
