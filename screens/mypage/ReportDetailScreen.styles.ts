import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    padding: 16,
  },
  title: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
  },
  input: {
    height: 160,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.gray01,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.black,
    textAlignVertical: 'top', // 안드로이드에서 멀티라인 입력을 위에서부터 시작
  },
  buttonContainer: {
    padding: 16,
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.main05,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray02,
  },
  submitButtonText: {
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
  },
  submitButtonTextDisabled: {
    color: colors.gray06,
  },
  // 접수 완료 화면
  doneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  doneImage: {
    width: 140,
    height: 140,
  },
  doneTitle: {
    marginTop: 16,
    fontFamily: typography.SB,
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  doneDescription: {
    marginTop: 6,
    fontFamily: typography.M,
    fontSize: 14,
    color: colors.gray07,
    textAlign: 'center',
  },
  homeButton: {
    alignSelf: 'stretch',
    marginTop: 33,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.main05,
  },
  // 점(•) 목록: 줄바꿈 시 텍스트가 점 아래로 들어가지 않도록 점과 본문을 분리
  noticeContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  noticeDot: {
    marginRight: 6,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
  noticeText: {
    flex: 1,
    fontFamily: typography.M,
    fontSize: 12,
    color: colors.gray07,
  },
});
