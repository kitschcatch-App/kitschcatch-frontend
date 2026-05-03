/**
 * 화면: 채팅 화면 (ChatScreen)
 * 역할: 판매자와 1:1 채팅을 진행하는 화면입니다.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../assets/back.svg';
import PlusIcon from '../assets/plus.svg';
import SendIcon from '../assets/send.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './ChatScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ route, navigation }: Props) => {
  const { sellerName, productName, productImageUrl } = route.params;

  // 상태 관리: 입력 텍스트와 메시지 리스트
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; time: string; sender: 'me' | 'them' }[]>([]);

  // 스크롤 뷰 참조 (새 메시지 전송 시 자동 스크롤을 위해 사용)
  const scrollViewRef = useRef<ScrollView>(null);
  const hasReplied = useRef(false); // 상대방이 이미 답장을 했는지 여부 추적

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

    // 상대방 메시지 임시 데이터
    if (!hasReplied.current) {
      hasReplied.current = true;
      setTimeout(() => {
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          text: '네, 안녕하세요! 구매 가능합니다.',
          time: getKSTTimeString(),
          sender: 'them' as const,
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      }, 1000); // 1초 뒤에 답장 시뮬레이션
    }
  };

  // KST(한국 표준시) 기준 오늘 날짜 문자열 생성 함수
  const getKSTDateString = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const kstTime = new Date(utc + 9 * 60 * 60 * 1000); // UTC 시간에 9시간(밀리초 변환) 더하기
    return `${kstTime.getFullYear()}년 ${kstTime.getMonth() + 1}월 ${kstTime.getDate()}일`;
  };

  // KST(한국 표준시) 기준 현재 시간 문자열 생성 함수 (예: 오후 2:30)
  const getKSTTimeString = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const kstTime = new Date(utc + 9 * 60 * 60 * 1000);
    return kstTime.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
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
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
          {/* 만약 상품 이름이 길면 몇줄까지 표시할건지...? */}
        </View>

        {/* 채팅 내용 영역 */}
        <ImageBackground source={require('../assets/chat.png')} style={styles.chatBackground}>
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

              if (msg.sender === 'them') {
                return (
                  <View key={msg.id} style={styles.messageRowThem}>
                    <View style={styles.messageBubbleThem}>
                      <Text style={styles.messageTextMe}>{msg.text}</Text>
                      <View style={styles.tailIconThem} />
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
                  <View style={styles.messageBubbleMe}>
                    <Text style={styles.messageTextMe}>{msg.text}</Text>
                    <View style={styles.tailIconMe} />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </ImageBackground>

        {/* 하단 고정 채팅 입력 바 */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <PlusIcon width={24} height={24} />
          </TouchableOpacity>
          <TextInput 
            style={styles.textInput}
            placeholder="메시지 입력"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.iconButton} onPress={handleSendMessage}>
            <SendIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
