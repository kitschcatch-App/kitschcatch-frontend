/**
 * 스타일: 상품 등록 화면 스타일 (ProductRegistrationScreen.styles)
 * 역할: ProductRegistrationScreen에서 사용하는 헤더, 입력 폼 등의 UI 스타일을 정의하는 파일입니다.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

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
    backgroundColor: colors.gray03,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCountText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.sub01,
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
    paddingBottom: 20, // 하단 여백 추가
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policyText: {
    fontSize: 12,
    fontFamily: typography.R,
    color: colors.gray01,
    textDecorationLine: 'underline',
  },
  policyTextActive: {
    color: colors.main02,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: colors.main02,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.main02,
  },
  // 상품 등록 버튼
  submitButton: {
    backgroundColor: colors.main01,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30, // 스크롤 맨 마지막 여유 공간
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
