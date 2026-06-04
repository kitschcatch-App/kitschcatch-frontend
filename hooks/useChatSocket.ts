/**
 * 훅: 웹소켓 채팅 커스텀 훅 (useChatSocket)
 * 역할: 채팅방 접속, 메시지 수신/발신, 읽음 처리 등 WebSocket(STOMP) 통신 상태와 로직을 관리합니다.
 */


import { useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { secureStorage } from '../utils/secureStorage';

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
  const tokenRef = useRef<string | null>(null);

  const connect = useCallback(({ chatRoomId, onMessage, onReadUpdate }: ConnectOptions) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      reconnectDelay: 5000,
      beforeConnect: async () => {
        const token = await secureStorage.getItem('accessToken');
        tokenRef.current = token;
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

        if (client.connected) {
          client.publish({ destination: `/pub/chat-rooms/${chatRoomId}/read` });
        }
      },
    });

    client.activate();
    clientRef.current = client;
  }, []);

  const sendText = useCallback((chatRoomId: number, content: string) => {
    const client = clientRef.current;
    if (client?.connected) {
      client.publish({
        destination: `/pub/chat-rooms/${chatRoomId}/messages/text`,
        headers: { Authorization: `Bearer ${tokenRef.current ?? ''}` },
        body: JSON.stringify({ content }),
      });
    }
  }, []);

  const sendReadReceipt = useCallback((chatRoomId: number) => {
    const client = clientRef.current;
    if (client?.connected) {
      client.publish({
        destination: `/pub/chat-rooms/${chatRoomId}/read`,
        headers: { Authorization: `Bearer ${tokenRef.current ?? ''}` },
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.deactivate();
    clientRef.current = null;
  }, []);

  return { connect, sendText, sendReadReceipt, disconnect };
};
