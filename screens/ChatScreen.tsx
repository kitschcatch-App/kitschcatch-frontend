/**
 * 화면: 채팅 화면 (ChatScreen)
 * 역할: 판매자와 1:1 채팅을 진행하는 화면입니다.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import PlusIcon from '../assets/plus.svg';
import SendIcon from '../assets/send.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './ChatScreen.styles';
import { colors } from '../styles/colors';
import { launchImageLibrary } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ route, navigation }: Props) => {
  const { sellerName, productName, productImageUrl } = route.params;

  // 상태 관리: 입력 텍스트와 메시지 리스트
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ id: string; text?: string; imageUrl?: string; time: string; sender: 'me' | 'them' }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 스크롤 뷰 참조 (새 메시지 전송 시 자동 스크롤을 위해 사용)
  const scrollViewRef = useRef<ScrollView>(null);
  const hasReplied = useRef(false); // 상대방이 이미 답장을 했는지 여부 추적
  const insets = useSafeAreaInsets(); // 상단 안전 영역 크기 가져오기

  // 상대방 답장 시뮬레이션
  const simulateReply = () => {
    if (!hasReplied.current) {
      hasReplied.current = true;
      setTimeout(() => {
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          text: '안녕하세요',
          time: getKSTTimeString(),
          sender: 'them' as const,
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      }, 1000); // 1초 뒤에 답장 시뮬레이션
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      time: getKSTTimeString(),
      sender: 'me' as const,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText(''); // 전송 후 입력창 초기화

    simulateReply();
  };

  // 사진 선택 핸들러
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1, // 한 번에 보낼 이미지 수
      quality: 0.8,
    });

    if (result.didCancel || result.errorCode || !result.assets || result.assets.length === 0) {
      return;
    }

    const imageUri = result.assets[0].uri;

    const newMessage = {
      id: Date.now().toString(),
      imageUrl: imageUri, // 이미지 URI를 추가
      time: getKSTTimeString(),
      sender: 'me' as const,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    simulateReply();
  };

  // KST(한국 표준시) 기준 오늘 날짜 문자열 생성 함수
  const getKSTDateString = () => {
    return new Date().toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  // KST(한국 표준시) 기준 현재 시간 문자열 생성 함수
  const getKSTTimeString = () => {
    return new Date().toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 상단 공백 컨테이너 */}
        <View style={[styles.topSpacer, { height: Math.max(insets.top, 65) }]} />

        {/* 헤더 영역 */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.nickname}>{sellerName}</Text>
            <Text style={styles.responseTime}>평균응답시간 30분</Text>
          </View>
        </View>

        {/* 상품 정보 영역 */}
        <View style={styles.productInfoContainer}>
          <Image source={{ uri: productImageUrl }} style={styles.productImage} />
          <Text style={styles.productName} numberOfLines={1}>{productName}</Text>
          {/* 상품 이름이 길면 몇줄까지 표시할건지 */}
        </View>

        {/* 채팅 내용 영역 */}
        <View style={[styles.chatBackground, { backgroundColor: colors.main03 }]}>
          <ScrollView 
            style={styles.chatScrollView}
            ref={scrollViewRef}
            contentContainerStyle={styles.chatContentContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {/* 날짜 구분선 (메시지가 1개 이상 있을 때만 표시) */}
            {messages.length > 0 && (
              <View style={styles.dateSeparatorContainer}>
                <View style={styles.dateLine} />
                <Text style={styles.dateText}>{getKSTDateString()}</Text>
                <View style={styles.dateLine} />
              </View>
            )}

            {/* 메시지 말풍선 목록 렌더링 */}
            {messages.map((msg, index, arr) => {
              // 그룹의 마지막 메시지에만 시간을 표시하기 위함
              const nextMessage = arr[index + 1];
              const showTime = !nextMessage || nextMessage.time !== msg.time || nextMessage.sender !== msg.sender;

              // 이미지 메시지일 경우 적용할 특수 스타일
              const isImage = !!msg.imageUrl;
              const bubbleStyle = isImage ? styles.imageMessageBubble : {};

              if (msg.sender === 'them') {
                return (
                  <View key={msg.id} style={styles.messageRowThem}>
                    <View style={[styles.messageBubbleThem, bubbleStyle]}>
                      {isImage ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => { setSelectedImage(msg.imageUrl!); setModalVisible(true); }}>
                          <Image source={{ uri: msg.imageUrl }} style={styles.messageImage} />
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.messageTextMe}>{msg.text}</Text>
                      )}
                      {!isImage && <View style={styles.tailIconThem} />}
                    </View>
                    <Text style={[styles.messageTime, { opacity: showTime ? 1 : 0, marginLeft: 6 }]}>
                      {msg.time}
                    </Text>
                  </View>
                );
              }
              // 내 메시지
              return (
                <View key={msg.id} style={styles.messageRowMe}>
                  <Text style={[styles.messageTime, { opacity: showTime ? 1 : 0 }]}>
                    {msg.time}
                  </Text>
                  <View style={[styles.messageBubbleMe, bubbleStyle]}>
                    {isImage ? (
                      <TouchableOpacity activeOpacity={0.8} onPress={() => { setSelectedImage(msg.imageUrl!); setModalVisible(true); }}>
                        <Image source={{ uri: msg.imageUrl }} style={styles.messageImage} />
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.messageTextMe}>{msg.text}</Text>
                    )}
                    {!isImage && <View style={styles.tailIconMe} />}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* 하단 고정 채팅 입력 바 */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.plusButton} onPress={handlePickImage}>
            <PlusIcon width={28} height={28} />
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
      </KeyboardAvoidingView>

      {/* 이미지 전체 화면 모달 */}
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
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
