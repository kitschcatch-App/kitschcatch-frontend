# 채팅 기능 프론트엔드 API 가이드

> 백엔드 코드 기준으로 작성된 실제 스펙입니다.

---

## 1. WebSocket 연결

### WebSocket 프로토콜

**STOMP over SockJS** 를 사용합니다.

순수 WebSocket(`ws://`)이 아니라 SockJS 폴백이 활성화된 STOMP 프로토콜입니다.  
`@stomp/stompjs` + `sockjs-client` 라이브러리 조합을 권장합니다.

### WebSocket 서버 URL

```
http://{host}/ws
```

SockJS 엔드포인트이므로 `http://` (또는 `https://`)를 사용합니다. `ws://`가 아닙니다.

```js
// 연결 예시
const client = new Client({
  webSocketFactory: () => new SockJS('http://host/ws'),
});
```

### 인증 처리

**STOMP CONNECT 프레임 헤더에 `Authorization: Bearer {accessToken}` 를 포함**해야 합니다.

쿼리 파라미터나 별도 HTTP 헤더 방식은 지원하지 않습니다.  
CONNECT 단계에서 토큰이 없거나 유효하지 않으면 즉시 연결이 거부됩니다.

```js
client.connectHeaders = {
  Authorization: `Bearer ${accessToken}`,
};
```

### 메시지 구독 / 발행 경로

| 방향 | destination |
|------|-------------|
| 구독 (수신) | `/sub/chat-rooms/{chatRoomId}` |
| 발행 (송신) | `/pub/chat-rooms/{chatRoomId}/messages/text` |

```js
// 구독
client.subscribe(`/sub/chat-rooms/${chatRoomId}`, (message) => {
  const data = JSON.parse(message.body); // ChatMessageResponse
});

// 발행
client.publish({
  destination: `/pub/chat-rooms/${chatRoomId}/messages/text`,
  body: JSON.stringify({ content: '안녕하세요' }),
});
```

> **구독 시 접근 제어**: 구독 대상 채팅방의 참여자(buyer/seller)가 아니면 서버가 구독을 거부합니다.

### 재연결 / Heartbeat

- **재연결**: 서버에서 별도로 지원하지 않습니다. 클라이언트가 직접 재연결 로직을 구현해야 합니다.  
  `@stomp/stompjs`의 `reconnectDelay` 옵션 활용을 권장합니다.
- **Heartbeat**: Spring 기본값을 사용합니다. 별도 커스텀 설정 없음.

---

## 2. 채팅방 생성 및 입장

### 채팅방 생성 API

```
POST /api/chat-rooms
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request body:**

```json
{
  "postId": 123
}
```

`sellerId`는 보내지 않아도 됩니다. 서버가 `postId`로 게시글을 조회해 판매자를 자동으로 확인합니다.

**이미 존재하는 채팅방이면 기존 방을 반환합니다 (에러 없음).**  
`(postId, buyerId, sellerId)` 조합이 유니크 키이므로 중복 생성이 방지됩니다.

**Response:**

```json
{
  "chatRoomId": 1,
  "postId": 10,
  "postTitle": "아이폰 15 팝니다",
  "buyerId": 42,
  "buyerNickname": "구매자닉네임",
  "sellerId": 7,
  "sellerNickname": "판매자닉네임",
  "lastMessageContent": null,
  "lastMessageAt": null,
  "createdAt": "2025-05-30T14:32:00"
}
```

### 채팅방 생성 시점

상품 상세 화면에서 **채팅하기 버튼을 누를 때** API를 호출하면 됩니다.  
이미 존재하면 기존 방을 반환하므로 진입 전에 호출해도 안전합니다.

---

## 3. 채팅방 목록 조회

### 채팅방 목록 API

```
GET /api/chat-rooms
Authorization: Bearer {accessToken}
```

구매자/판매자 구분 없이 내가 참여한 모든 채팅방을 반환합니다.  
소프트 삭제된 방(내가 나간 방)은 제외됩니다.  
정렬 기준: 마지막 메시지 시각 내림차순(최신 대화 먼저). 메시지가 없는 방은 `createdAt` 기준.

**Response:**

```json
[
  {
    "chatRoomId": 1,
    "opponentId": 7,
    "opponentNickname": "판매자닉네임",
    "lastMessageContent": "안녕하세요",
    "lastMessageAt": "2025-05-30T14:32:00"
  },
  {
    "chatRoomId": 2,
    "opponentId": 42,
    "opponentNickname": "구매자닉네임",
    "lastMessageContent": "[이미지]",
    "lastMessageAt": "2025-05-30T13:00:00"
  }
]
```

> 페이지네이션 없음. 전체 목록을 한 번에 반환합니다.  
> 상품 정보(제목, 썸네일)는 포함되지 않습니다. 채팅 화면 진입 시 채팅방 상세 조회 API를 따로 호출하세요.

---

## 3-1. 채팅방 상세 조회

채팅 화면 상단에 표시할 상품 정보를 조회합니다.

```
GET /api/chat-rooms/{chatRoomId}
Authorization: Bearer {accessToken}
```

**Response:**

```json
{
  "chatRoomId": 1,
  "postId": 10,
  "postTitle": "아이폰 15 팝니다",
  "postThumbnailImageUrl": "https://..."
}
```

> `postThumbnailImageUrl`은 상품 대표 이미지가 없으면 `null`입니다.

---

## 4. 메시지 이력 조회

### 메시지 이력 API

```
GET /api/chat-rooms/{chatRoomId}/messages
Authorization: Bearer {accessToken}
```

**Response:**

```json
[
  {
    "messageId": 1,
    "chatRoomId": 5,
    "senderId": 42,
    "senderNickname": "구매자닉네임",
    "messageType": "TEXT",
    "content": "안녕하세요",
    "imageUrl": null,
    "isRead": false,
    "createdAt": "2025-05-30T14:32:00"
  },
  {
    "messageId": 2,
    "chatRoomId": 5,
    "senderId": 7,
    "senderNickname": "판매자닉네임",
    "messageType": "IMAGE",
    "content": null,
    "imageUrl": "https://...",
    "isRead": false,
    "createdAt": "2025-05-30T14:33:00"
  }
]
```

### 페이지네이션

**현재 페이지네이션 없음.** 해당 채팅방의 전체 메시지를 한 번에 반환합니다.  
정렬 순서는 `createdAt` 오름차순(가장 오래된 메시지부터)입니다.

### 내가 보낸 메시지 구분

`senderId`를 로컬에 저장된 내 `userId`와 비교하면 됩니다.

```js
const isMine = message.senderId === myUserId;
```

---

## 5. 실시간 메시지 송수신

### 메시지 전송 payload (STOMP)

```json
{
  "content": "안녕하세요"
}
```

`chatRoomId`는 destination 경로에 포함되므로 body에는 `content`만 보냅니다.

### 수신 payload 구조

전송 payload와 다릅니다. 서버가 저장 후 추가 필드를 붙여서 브로드캐스트합니다.

```json
{
  "messageId": 10,
  "chatRoomId": 5,
  "senderId": 42,
  "senderNickname": "구매자닉네임",
  "messageType": "TEXT",
  "content": "안녕하세요",
  "imageUrl": null,
  "isRead": false,
  "createdAt": "2025-05-30T14:32:00"
}
```

### 에코 방식 여부

**에코 방식(서버 브로드캐스트)**입니다.  
서버가 `/sub/chat-rooms/{chatRoomId}`로 브로드캐스트하므로, **발신자 본인도 구독 중이면 메시지를 다시 수신**합니다.  
클라이언트에서 로컬로 즉시 추가하면 중복 표시될 수 있으니, 서버에서 수신한 메시지로만 UI를 업데이트하는 방식을 권장합니다.

---

## 6. 이미지 메시지

### 이미지 전송 방식

**HTTP multipart 직접 업로드** 방식입니다.  
Presigned URL 방식이 아닙니다.

```
POST /api/chat-rooms/{chatRoomId}/messages/images
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

Form data key: `image`

```js
const formData = new FormData();
formData.append('image', imageFile);

fetch(`/api/chat-rooms/${chatRoomId}/messages/images`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  body: formData,
});
```

전송 후 서버가 저장하고 `/sub/chat-rooms/{chatRoomId}`로 브로드캐스트합니다.

> **참고**: 현재 이미지 업로드는 임시 구현 상태입니다(S3 연동 예정).  
> 실제 프로덕션 서비스 전에 imageUrl 도메인이 변경될 수 있습니다.

### 이미지 메시지 type 값

```
"messageType": "IMAGE"
```

(`TEXT` / `IMAGE` 두 가지 값만 존재합니다.)

---

## 7. 읽음 처리

읽음 처리는 **STOMP** 를 통해 처리합니다. 별도 HTTP API는 없습니다.

### 읽음 처리 요청 (발행)

채팅 화면 진입 또는 메시지 수신 시 아래 destination으로 발행하면 됩니다.

```
/pub/chat-rooms/{chatRoomId}/read
```

body 없이 발행합니다.

```js
client.publish({
  destination: `/pub/chat-rooms/${chatRoomId}/read`,
});
```

### 읽음 처리 결과 수신 (구독)

```
/sub/chat-rooms/{chatRoomId}/read
```

```js
client.subscribe(`/sub/chat-rooms/${chatRoomId}/read`, (message) => {
  const data = JSON.parse(message.body); // ChatReadResponse
});
```

**ChatReadResponse:**

```json
{
  "chatRoomId": 1,
  "readerId": 42,
  "readMessageIds": [10, 11, 12],
  "readCount": 3,
  "readAt": "2025-05-30T14:35:00"
}
```

| 필드 | 설명 |
|------|------|
| `readerId` | 읽음 처리를 요청한 사용자 ID |
| `readMessageIds` | 읽음 처리된 메시지 ID 목록 |
| `readCount` | 읽음 처리된 메시지 수 |
| `readAt` | 읽음 처리 시각 |

> 읽음 처리는 **상대방이 보낸 메시지** 중 아직 읽지 않은 것만 처리합니다. 내가 보낸 메시지는 대상에서 제외됩니다.  
> 상대방의 채팅 화면에서도 이 이벤트를 구독하면 실시간 읽음 표시를 구현할 수 있습니다.

---

## 8. 에러 처리

### 토큰 만료 시 동작

STOMP CONNECT 단계에서 토큰이 만료되거나 유효하지 않으면 서버가 연결을 거부합니다.  
이미 연결된 상태에서 토큰이 만료되면 다음 메시지 전송/구독 시도 시 실패합니다.

### 에러 코드 목록

| 코드 | 메시지 | HTTP 상태 |
|------|--------|-----------|
| `CHAT_001` | 채팅방을 찾을 수 없습니다. | 404 |
| `CHAT_002` | 자신의 판매 게시글에는 문의할 수 없습니다. | 400 |
| `CHAT_003` | 채팅방에 접근할 권한이 없습니다. | 403 |
| `CHAT_004` | 메시지 내용은 비어 있을 수 없습니다. | 400 |
| `CHAT_005` | 이미지 파일은 비어 있을 수 없습니다. | 400 |
| `AUTH_004` | 인증 토큰이 올바르지 않습니다. | 401 |

### 토큰 갱신 후 재연결

REST API처럼 자동 갱신은 지원하지 않습니다.  
클라이언트에서 토큰 갱신 후 WebSocket 연결을 새로 맺어야 합니다.

```js
// 권장 흐름
// 1. REST API로 토큰 갱신
// 2. 기존 STOMP 연결 해제
// 3. 새 토큰으로 STOMP 재연결
client.deactivate().then(() => {
  client.connectHeaders = { Authorization: `Bearer ${newAccessToken}` };
  client.activate();
});
```

---

## 요약 — 전체 API 목록

| 방법 | 경로 | 설명 |
|------|------|------|
| `POST` | `/api/chat-rooms` | 채팅방 생성 (기존 방이면 반환) |
| `GET` | `/api/chat-rooms` | 내 채팅방 목록 조회 |
| `GET` | `/api/chat-rooms/{chatRoomId}` | 채팅방 상세 조회 (상품 정보) |
| `GET` | `/api/chat-rooms/{chatRoomId}/messages` | 메시지 이력 조회 |
| `POST` | `/api/chat-rooms/{chatRoomId}/messages/text` | 텍스트 메시지 전송 (HTTP) |
| `POST` | `/api/chat-rooms/{chatRoomId}/messages/images` | 이미지 메시지 전송 (HTTP multipart) |
| STOMP pub | `/pub/chat-rooms/{chatRoomId}/messages/text` | 텍스트 메시지 전송 (실시간) |
| STOMP pub | `/pub/chat-rooms/{chatRoomId}/read` | 읽음 처리 요청 |
| STOMP sub | `/sub/chat-rooms/{chatRoomId}` | 실시간 메시지 수신 |
| STOMP sub | `/sub/chat-rooms/{chatRoomId}/read` | 읽음 처리 결과 수신 |

## 미구현 항목

| 항목 | 상태 |
|------|------|
| 메시지 이력 페이지네이션 | 미구현 |
| 이미지 S3 업로드 연동 | 임시 구현 (TODO) |
