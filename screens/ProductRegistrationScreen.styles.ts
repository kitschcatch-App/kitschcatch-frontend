/**
 * 스타일: 상품 등록 화면 스타일 (ProductRegistrationScreen.styles)
 * 역할: ProductRegistrationScreen에서 사용하는 헤더, 입력 폼 등의 UI 스타일을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export const placeholderColor = colors.gray07;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topSpacer: {
    width: '100%',
  },
  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: 48, // 헤더 높이 고정
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  // 왼쪽 아이콘이 없으므로, 오른쪽 아이콘과 균형을 맞추기 위한 플레이스홀더
  headerIconPlaceholder: {
    width: 40, // exitButton의 너비와 동일하게 설정
  },
  exitButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempSaveButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tempSaveButtonText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub07,
    textDecorationLine: 'underline',
  },
  // 사진 등록 레이아웃
  photoLayout: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  photoScrollView: {
    width: '100%',
  },
  photoScrollContent: {
    gap: 20,
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

  // 상품명 입력
  productNameLayout: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  priceLayout: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  descriptionLayout: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  conditionLayout: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  categoryLayout: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  statusLayout: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  policyLayout: {
    paddingBottom: 30,
    paddingTop: 20,
  },
  policyContainer: {
    alignItems: 'flex-start',
  },
  policyRadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requiredText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub07,
    marginRight: -3,
  },
  policyErrorText: {
    fontSize: 12,
    fontFamily: typography.M,
    color: colors.error,
  },
  policyText: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  policyTextActive: {
    color: colors.sub07,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: colors.main05,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.main05,
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
  // 상품 등록 버튼
  submitButton: {
    backgroundColor: colors.gray03,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  submitButtonActive: {
    backgroundColor: colors.main05,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
