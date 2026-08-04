/**
 * 화면: 채팅 화면 (ChatScreen)
 * 역할: 구매자와 판매자가 상품에 대해 1:1로 채팅을 주고받는 화면입니다.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView,
  TextInput, Keyboard, Modal, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { secureStorage } from '../utils/secureStorage';
import BackIcon from '../assets/back.svg';
import PlusIcon from '../assets/plus.svg';
import SendIcon from '../assets/send.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './ChatScreen.styles';
import { colors } from '../styles/colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { chatAPI } from '../api/apiClient';
import { useChatSocket, ChatMessageResponse } from '../hooks/useChatSocket';
import { getMockChatRoomDetail, getMockMessages, MOCK_MY_USER_ID, mockDelay } from '../api/mockData';
import { useMockMode } from '../contexts/MockModeContext';
import ErrorView from '../components/ErrorView';
import { ERROR_MESSAGES, ErrorMessage } from '../constants/errorMessages';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type Message = {
  messageId: number;
  senderId: number;
  messageType: 'TEXT' | 'IMAGE';
  content: string | null;
  imageUrl: string | null;
  time: string;
  sender: 'me' | 'them';
};

type ProductInfo = {
  postTitle: string;
  postThumbnailImageUrl: string | null;
};

// timezone 없는 서버 LocalDateTime을 UTC로 파싱 (서버가 UTC 기준 LocalDateTime 반환)
const parseKSTDate = (isoString: string): Date => {
  const withTz = isoString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(isoString)
    ? isoString
    : `${isoString}Z`;
  return new Date(withTz);
};

const getKSTTimeString = (isoString?: string): string => {
  const date = isoString ? parseKSTDate(isoString) : new Date();
  return date.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getKSTDateString = (isoString?: string): string => {
  const date = isoString ? parseKSTDate(isoString) : new Date();
  return date.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ChatScreen = ({ route, navigation }: Props) => {
  const { chatRoomId, opponentNickname } = route.params;
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { isMockMode } = useMockMode();

  const [messages, setMessages] = useState<Message[]>([]);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>(null);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const myUserIdRef = useRef<number | null>(null);

  const { connect, sendReadReceipt, disconnect } = useChatSocket();

  const toMessage = useCallback((raw: ChatMessageResponse, userId: number): Message => ({
    messageId: raw.messageId,
    senderId: raw.senderId,
    messageType: raw.messageType,
    content: raw.content,
    imageUrl: raw.imageUrl,
    time: getKSTTimeString(raw.createdAt),
    sender: raw.senderId === userId ? 'me' : 'them',
  }), []);

  // 초기 데이터 로딩: userId, 상품 정보, 메시지 이력
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);

        if (isMockMode) {
          await mockDelay(300);
          myUserIdRef.current = MOCK_MY_USER_ID;
          const detail = getMockChatRoomDetail(chatRoomId).data;
          const msgs = getMockMessages(chatRoomId).data as ChatMessageResponse[];
          setProductInfo({ postTitle: detail.postTitle, postThumbnailImageUrl: detail.postThumbnailImageUrl });
          setMessages(msgs.map((raw) => toMessage(raw, MOCK_MY_USER_ID)));
        } else {
          const stored = await secureStorage.getItem('userId');
          const userId = stored ? Number(stored) : null;
          myUserIdRef.current = userId;

          const [detailRes, messagesRes] = await Promise.all([
            chatAPI.getChatRoomDetail(chatRoomId),
            chatAPI.getMessages(chatRoomId),
          ]);

          console.log('[Chat] userId:', userId);
          console.log('[Chat] messagesRes.data:', JSON.stringify(messagesRes.data)?.slice(0, 500));

          const detailBody = detailRes.data?.data ?? detailRes.data;

          // 서버 응답 형태에 따른 메시지 배열 추출
          // 지원 형태: 직접 배열 / { data: [...] } / { data: { content: [...] } } / { content: [...] }
          const rawData = messagesRes.data;
          const messagesBody: ChatMessageResponse[] =
            Array.isArray(rawData)                  ? rawData :
            Array.isArray(rawData?.data)            ? rawData.data :
            Array.isArray(rawData?.data?.content)   ? rawData.data.content :
            Array.isArray(rawData?.content)         ? rawData.content :
            [];

          console.log('[Chat] messagesBody length:', messagesBody.length);

          setProductInfo({
            postTitle: detailBody.postTitle,
            postThumbnailImageUrl: detailBody.postThumbnailImageUrl,
          });

          if (userId !== null) {
            setMessages(messagesBody.map((m) => toMessage(m, userId)));
          } else {
            console.warn('[Chat] userId is null — messages not rendered');
          }
        }
      } catch (e: any) {
        console.error('채팅 초기화 실패:', e);
        if (e?.response) {
          console.error('상태 코드:', e.response.status, '응답:', JSON.stringify(e.response.data));
        }
        setErrorMsg(ERROR_MESSAGES.CHAT.LOAD_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [chatRoomId, isMockMode, toMessage]);

  // WebSocket 연결 (초기 데이터 로딩 완료 후, mock 모드 제외)
  useEffect(() => {
    if (isLoading || isMockMode) return;

    connect({
      chatRoomId,
      onMessage: (msg) => {
        const userId = myUserIdRef.current;
        if (userId === null) return;
        // 본인 메시지는 낙관적 업데이트로 이미 추가했으므로 서버 에코 무시
        if (msg.senderId === userId) return;
        setMessages((prev) => [...prev, toMessage(msg, userId)]);
        sendReadReceipt(chatRoomId);
      },
    });

    return () => disconnect();
  }, [isLoading, isMockMode, chatRoomId, connect, disconnect, sendReadReceipt, toMessage]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardPadding(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardPadding(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim().length === 0) return;
    const text = inputText.trim();
    setInputText('');

    const senderId = isMockMode ? MOCK_MY_USER_ID : (myUserIdRef.current ?? 0);
    const tempId = Date.now();

    setMessages((prev) => [...prev, {
      messageId: tempId,
      senderId,
      messageType: 'TEXT',
      content: text,
      imageUrl: null,
      time: getKSTTimeString(),
      sender: 'me',
    }]);

    if (!isMockMode) {
      try {
        await chatAPI.sendTextMessage(chatRoomId, text);
      } catch (e) {
        console.error('메시지 전송 실패:', e);
        setMessages((prev) => prev.filter((m) => m.messageId !== tempId));
        setErrorMsg(ERROR_MESSAGES.CHAT.SEND_FAILED);
      }
    }
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
    if (result.didCancel || result.errorCode || !result.assets?.length) return;

    const asset = result.assets[0];
    if (!asset.uri) return;

    if (isMockMode) {
      setMessages((prev) => [...prev, {
        messageId: Date.now(),
        senderId: MOCK_MY_USER_ID,
        messageType: 'IMAGE',
        content: null,
        imageUrl: asset.uri!,
        time: getKSTTimeString(),
        sender: 'me',
      }]);
      return;
    }

    const contentType = asset.type ?? 'image/jpeg';
    const originalFileName = asset.fileName ?? `chat_image_${Date.now()}.jpg`;

    try {
      setIsSendingImage(true);

      // Step 1: Presigned URL 발급
      const urlRes = await chatAPI.getImageUploadUrl(chatRoomId, originalFileName, contentType);
      const { uploadUrl, objectKey } = urlRes.data?.data ?? urlRes.data;

      // Step 2: S3 직접 업로드 — fetch 사용으로 apiClient 인터셉터(Authorization 헤더) 우회
      const imageResponse = await fetch(asset.uri);
      const blob = await imageResponse.blob();
      const s3Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: blob,
      });
      if (!s3Res.ok) throw new Error(`S3 upload failed: ${s3Res.status}`);

      // Step 3: objectKey로 이미지 메시지 저장
      const saveRes = await chatAPI.saveImageMessage(chatRoomId, objectKey);
      const savedMsg: ChatMessageResponse = saveRes.data?.data ?? saveRes.data;
      console.log('[Chat] savedMsg:', JSON.stringify(savedMsg));

      // Step 3 응답으로 UI 반영 (WebSocket 에코는 senderId 필터로 무시되므로 중복 없음)
      const userId = myUserIdRef.current;
      if (userId !== null) {
        setMessages((prev) => [...prev, toMessage(savedMsg, userId)]);
      }
    } catch (e) {
      console.error('이미지 전송 실패:', e);
      setErrorMsg(ERROR_MESSAGES.CHAT.SEND_FAILED);
    } finally {
      setIsSendingImage(false);
    }
  };

  const firstMessageDate = messages.length > 0 ? getKSTDateString(undefined) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[styles.container, { paddingBottom: keyboardPadding }]}>
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.nickname}>{opponentNickname}</Text>
            <Text style={styles.responseTime}>평균응답시간 30분</Text>
          </View>
        </View>

        {/* 상품 정보 */}
        <View style={styles.productInfoContainer}>
          {productInfo?.postThumbnailImageUrl ? (
            <Image source={{ uri: productInfo.postThumbnailImageUrl }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, { backgroundColor: colors.main03 }]} />
          )}
          <Text style={styles.productName} numberOfLines={1}>
            {productInfo?.postTitle ?? ''}
          </Text>
        </View>

        {/* 채팅 내용 */}
        <View style={styles.chatBackground}>
          {isLoading ? (
            <ActivityIndicator style={{ flex: 1 }} />
          ) : (
            <ScrollView
              style={styles.chatScrollView}
              ref={scrollViewRef}
              contentContainerStyle={styles.chatContentContainer}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {firstMessageDate && (
                <View style={styles.dateSeparatorContainer}>
                  <View style={styles.dateLine} />
                  <Text style={styles.dateText}>{firstMessageDate}</Text>
                  <View style={styles.dateLine} />
                </View>
              )}

              {messages.map((msg, index, arr) => {
                const nextMsg = arr[index + 1];
                const showTime = !nextMsg || nextMsg.time !== msg.time || nextMsg.sender !== msg.sender;
                const isImage = msg.messageType === 'IMAGE';
                const bubbleStyle = isImage ? styles.imageMessageBubble : {};

                if (msg.sender === 'them') {
                  return (
                    <View key={msg.messageId} style={styles.messageRowThem}>
                      <View style={[styles.messageBubbleThem, bubbleStyle]}>
                        {isImage ? (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { setSelectedImage(msg.imageUrl!); setModalVisible(true); }}
                          >
                            <Image
                              source={{ uri: msg.imageUrl! }}
                              style={[styles.messageImage, { width: screenWidth * 0.6, height: screenWidth * 0.6 }]}
                              onError={(e) => console.error('[Chat] Image load error (them):', msg.imageUrl, e.nativeEvent.error)}
                            />
                          </TouchableOpacity>
                        ) : (
                          <Text style={styles.messageTextMe}>{msg.content}</Text>
                        )}
                        {!isImage && <View style={styles.tailIconThem} />}
                      </View>
                      <Text style={[styles.messageTime, { opacity: showTime ? 1 : 0, marginLeft: 6 }]}>
                        {msg.time}
                      </Text>
                    </View>
                  );
                }

                return (
                  <View key={msg.messageId} style={styles.messageRowMe}>
                    <Text style={[styles.messageTime, { opacity: showTime ? 1 : 0 }]}>
                      {msg.time}
                    </Text>
                    <View style={[styles.messageBubbleMe, bubbleStyle]}>
                      {isImage ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => { setSelectedImage(msg.imageUrl!); setModalVisible(true); }}
                        >
                          <Image
                            source={{ uri: msg.imageUrl! }}
                            style={[styles.messageImage, { width: screenWidth * 0.6, height: screenWidth * 0.6 }]}
                            onError={(e) => console.error('[Chat] Image load error (me):', msg.imageUrl, e.nativeEvent.error)}
                          />
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.messageTextMe}>{msg.content}</Text>
                      )}
                      {!isImage && <View style={styles.tailIconMe} />}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* 입력 바 */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handlePickImage}
            disabled={isSendingImage}
          >
            {isSendingImage
              ? <ActivityIndicator size="small" />
              : <PlusIcon width={28} height={28} />
            }
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="메시지 입력"
            value={inputText}
            onChangeText={setInputText}
            multiline
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <SendIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ErrorView
        visible={!!errorMsg}
        title={errorMsg?.title ?? ''}
        subtitle={errorMsg?.subtitle ?? ''}
        onPress={() => setErrorMsg(null)}
      />

      {/* 이미지 전체 화면 모달 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={[styles.modalCloseButton, { top: insets.top + 10 }]} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;
