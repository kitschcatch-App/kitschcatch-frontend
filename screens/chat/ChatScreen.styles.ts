/**
 * 스타일: 채팅 화면 스타일 (ChatScreen.styles)
 * 역할: ChatScreen 화면의 레이아웃 및 UI 요소(메시지 버블, 입력창 등)의 스타일을 정의합니다.
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  topSpacer: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 닉네임과 응답시간을 가운데 정렬
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    marginRight: 1,
    marginLeft: 1,
    marginBottom: 7,
    marginTop: 7,
  },
  headerCenter: {
    alignItems: 'center',
  },
  nickname: {
    fontSize: 16,
    fontFamily: typography.SB,
    color: colors.black,
  },
  responseTime: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray05,
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray02,
  },
  productImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.gray02,
  },
  productName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontFamily: typography.SB,
    color: colors.black,
  },
  chatBackground: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.sub01,
  },
  chatScrollView: {
    flex: 1,
  },
  chatContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray07,
  },
  dateText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontFamily: typography.R,
    color: colors.gray07,
  },
  messageRowMe: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  messageRowThem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  messageBubbleThem: {
    backgroundColor: colors.white, // 상대방 말풍선 배경색
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    maxWidth: '75%',
    position: 'relative',
  },
  messageBubbleMe: {
    backgroundColor: colors.main05, // 내 말풍선 배경색
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    maxWidth: '75%',
    marginLeft: 6,
    position: 'relative', // 꼬리 아이콘의 절대 위치 기준점
  },
  messageTextMe: {
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: typography.M,
    color: colors.gray07,
    marginBottom: 4,
  },
  imageMessageBubble: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  messageImage: {
    borderRadius: 15,
  },
  tailIconMe: {
    position: 'absolute',
    bottom: -2,
    right: -3, 
    width: 0,
    height: 0,
    borderTopWidth: 5, // 꼬리의 위쪽 절반 높이
    borderTopColor: 'transparent', 
    borderBottomWidth: 5, // 꼬리의 아래쪽 절반 높이
    borderBottomColor: 'transparent',
    borderLeftWidth: 13, // 꼬리의 너비
    borderLeftColor: colors.main05, 
    transform: [{ rotate: '40deg' }], // 꼬리 각도 조절 (원하는 각도로 숫자 변경)
  },
  tailIconThem: {
    position: 'absolute',
    bottom: -2,
    left: -3,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderRightWidth: 13, // 꼬리 방향을 위해 borderLeft 대신 borderRight 사용
    borderRightColor: colors.white,
    transform: [{ rotate: '-40deg' }], // 반대 방향으로 회전
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  plusButton: {
    marginLeft: 8,
  },
  sendButton: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.gray01,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    fontSize: 14,
    fontFamily: typography.M,
    color: colors.black,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(40, 40, 40, 0.85)', // 어두운 회색 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
    padding: 15,
  },
  modalCloseText: {
    color: colors.white,
    fontSize: 28,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});