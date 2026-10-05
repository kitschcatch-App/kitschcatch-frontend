/**
 * 스타일: 리뷰 작성 화면 스타일 (ReviewWriteScreen.styles)
 * 역할: ReviewWriteScreen 컴포넌트의 UI 스타일을 정의합니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  exitButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 사진 첨부 (ProductRegistrationScreen과 동일한 구성)
  photoLayout: {
    paddingTop: 16,
    paddingLeft: 16,
  },
  photoScrollContent: {
    gap: 20,
    paddingRight: 16,
  },
  ratingSection: {
    paddingTop: 24,
    padding: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  ratingCountText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.gray06,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  reviewSection: {
    padding: 16,
  },
  // ponytail: 높이 지정이 없어 minHeight 120으로 임시 설정. 디자인 확정되면 교체.
  reviewInput: {
    minHeight: 120,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.gray01,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
  },
  reviewLengthText: {
    alignSelf: 'flex-end',
    marginTop: 4,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray06,
  },
  photoBox: {
    width: 130,
    height: 130,
    backgroundColor: colors.gray01,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCountText: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub05,
  },
  imageWrapper: {
    width: 130,
    height: 130,
  },
  selectedImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: typography.M,
  },
  submitButton: {
    height: 50,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray02,
  },
  submitButtonActive: {
    backgroundColor: colors.main05,
  },
  submitText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.gray06,
  },
  submitTextActive: {
    color: colors.black,
  },
  toastOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.gray01,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  toastText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.SB,
  },
});
