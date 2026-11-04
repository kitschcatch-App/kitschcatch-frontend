/**
 * 스타일: 사진 첨부 스타일 (PhotoAttach.styles)
 * 역할: PhotoAttach 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  photoBox: {
    width: 96,
    height: 96,
    borderRadius: 10,
    backgroundColor: colors.gray01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCountText: {
    marginTop: 5,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.sub05,
  },
  selectedImage: {
    width: 96,
    height: 96,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: typography.M,
  },
  noticeRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  noticeDot: {
    marginRight: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
  noticeText: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray06,
  },
});
