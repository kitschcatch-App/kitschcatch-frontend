import { useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WS_BASE_URL = 'http://10.0.2.2:8080/ws';

export type ChatMessageResponse = {
  messageId: number;
  chatRoomId: number;
  senderId: number;
  senderNickname: string;
  messageType: 'TEXT' | 'IMAGE';
  content: string | null;
  imageUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

export type ChatReadResponse = {
  chatRoomId: number;
  readerId: number;
  readMessageIds: number[];
  readCount: number;
  readAt: string;
};

type ConnectOptions = {
  chatRoomId: number;
  onMessage: (msg: ChatMessageResponse) => void;
  onReadUpdate?: (data: ChatReadResponse) => void;
};

export const useChatSocket = () => {
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(({ chatRoomId, onMessage, onReadUpdate }: ConnectOptions) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      reconnectDelay: 5000,
      beforeConnect: async () => {
        const token = await AsyncStorage.getItem('accessToken');
        client.connectHeaders = {
          Authorization: `Bearer ${token ?? ''}`,
        };
      },
      onConnect: () => {
        client.subscribe(`/sub/chat-rooms/${chatRoomId}`, (frame) => {
          const msg: ChatMessageResponse = JSON.parse(frame.body);
          onMessage(msg);
        });

        if (onReadUpdate) {
          client.subscribe(`/sub/chat-rooms/${chatRoomId}/read`, (frame) => {
            const data: ChatReadResponse = JSON.parse(frame.body);
            onReadUpdate(data);
          });
        }

        // 화면 진입 즉시 읽음 처리
        client.publish({ destination: `/pub/chat-rooms/${chatRoomId}/read` });
      },
    });

    client.activate();
    clientRef.current = client;
  }, []);

  const sendText = useCallback((chatRoomId: number, content: string) => {
    clientRef.current?.publish({
      destination: `/pub/chat-rooms/${chatRoomId}/messages/text`,
      body: JSON.stringify({ content }),
    });
  }, []);

  const sendReadReceipt = useCallback((chatRoomId: number) => {
    clientRef.current?.publish({
      destination: `/pub/chat-rooms/${chatRoomId}/read`,
    });
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.deactivate();
    clientRef.current = null;
  }, []);

  return { connect, sendText, sendReadReceipt, disconnect };
};
