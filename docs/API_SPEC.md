# API 명세서

> Notion에서 Export한 API 명세 CSV를 Markdown 문서로 변환한 파일입니다.

- 총 항목 수: **77개**
- 빈 설명은 원본 CSV에 설명이 기재되지 않은 항목입니다.
- `{postId}`, `{orderId}` 등의 값은 Path Parameter를 의미합니다.
- `?keyword={keyword}` 등의 값은 Query Parameter를 의미합니다.

## 목차

- [인증](#인증)
- [회원](#회원)
- [판매 게시글 / 상품](#판매-게시글--상품)
- [주문 / 거래](#주문--거래)
- [결제](#결제)
- [채팅](#채팅)
- [실시간 채팅 (WebSocket / STOMP)](#실시간-채팅-websocket--stomp)
- [알림](#알림)
- [매장](#매장)

## 인증

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 로그아웃 | `POST` | `/api/auth/logout` | refresh token을 폐기해 해당 토큰으로 재발급할 수 없게 합니다. |
| 토큰 재발급 | `POST` | `/api/auth/token/refresh` | 유효한 refresh token으로 access token과 refresh token을 재발급합니다. |
| 카카오 모바일 로그인 | `POST` | `/api/auth/kakao/mobile-login` | 카카오 SDK ID 토큰과 nonce로 로그인하고 access token과 refresh token을 발급합니다. |
| 카카오 로그인 nonce 발급 | `POST` | `/api/auth/kakao/nonce` | 카카오 모바일 로그인 ID 토큰 검증에 사용할 nonce를 발급합니다. |
| 네이버 소셜 로그인 | `POST` | `/api/auth/naver/mobile-login` | 네이버 계정으로 로그인하고 신규 사용자의 기본 프로필과 인증 토큰을 생성합니다. |
| 애플 소셜 로그인 | `POST` | `/api/auth/apple/mobile-login` | Apple 계정으로 로그인하고 신규 사용자의 기본 프로필과 인증 토큰을 생성합니다. |

### 네이버 소셜 로그인 상세 (`POST /api/auth/naver/mobile-login`)

> 앱(`@react-native-seoul/naver-login`)이 네이버 OAuth를 처리해 Access Token을 받은 뒤 서버로 전달합니다.
> 네이버는 OIDC(ID Token/nonce)를 지원하지 않으므로 카카오와 달리 nonce 발급 단계가 없습니다.

**Request Body**

```json
{
  "accessToken": "<네이버 SDK가 발급한 accessToken>"
}
```

**서버 처리**

1. `GET https://openapi.naver.com/v1/nid/me` 를 `Authorization: Bearer <accessToken>` 로 호출해 프로필 조회
   - 응답 예: `{ "response": { "id": "abc123", "email": "user@example.com", "nickname": "...", "profile_image": "..." } }`
2. 계정 식별: `provider = "NAVER"`, `providerId = response.id` (불변 고유값)
   - **`email` 은 네이버 '연락처 이메일'로 고유하지 않고 비어 있을 수 있음. 계정 식별·병합에 사용 금지, 프로필 표시용으로만 저장**
3. `(provider, providerId)` 로 조회되지 않으면 신규 유저 생성 (이후 앱 회원가입 플로우로 닉네임/프로필 입력)

**Response Body** (카카오 모바일 로그인과 동일 형태)

```json
{
  "data": {
    "accessToken": "<앱 JWT access token>",
    "refreshToken": "<앱 JWT refresh token>",
    "user": { "id": 1 }
  }
}
```

**에러**

- 유효하지 않은/만료된 네이버 accessToken → `401`
- 네이버 프로필 API 호출 실패 → `502` 등

## 회원

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 내 판매 거래 내역 조회 | `GET` | `/api/users/me/sale-orders` | 로그인한 사용자가 판매한 상품의 거래 내역을 조회합니다. |
| 내 구매 거래 내역 조회 | `GET` | `/api/users/me/purchase-orders` | 로그인한 사용자가 구매한 상품의 거래 내역을 조회합니다. |
| 푸시 알림 기기 토큰 삭제 | `DELETE` | `/api/users/me/device-tokens/{tokenId}` | 등록된 푸시 알림 기기 토큰을 삭제합니다. |
| 푸시 알림 기기 토큰 등록 | `POST` | `/api/users/me/device-tokens` | 푸시 알림 수신에 사용할 기기 토큰을 등록합니다. |
| 사용자 거래 신뢰 정보 조회 | `GET` | `/api/users/{userId}/trust-info` | 사용자의 거래 횟수와 거래 후기 평균 평점을 조회합니다. |
| 다른 회원의 판매 상태별 상품 조회 | `GET` | `/api/users/{userId}/posts?status={status}` | 다른 사용자의 상품을 판매 상태별로 조회합니다. |
| 내 판매 상품 목록 조회 | `GET` | `/api/users/me/posts` | 로그인한 사용자가 등록한 상품과 판매 상태를 조회합니다. |
| 팔로잉 목록 조회 | `GET` | `/api/users/{userId}/followings` | 지정한 사용자의 팔로잉 목록을 조회합니다. |
| 팔로워 목록 조회 | `GET` | `/api/users/{userId}/followers` | 지정한 사용자의 팔로워 목록을 조회합니다. |
| 사용자 팔로우 해제 | `DELETE` | `/api/users/{userId}/follow` | 지정한 사용자에 대한 팔로우를 해제합니다. |
| 사용자 팔로우 | `POST` | `/api/users/{userId}/follow` | 지정한 사용자를 팔로우합니다. |
| 다른 회원 판매 상품 조회 | `GET` | `/api/users/{userId}/posts` | 다른 사용자가 등록한 판매 상품을 조회합니다. |
| 다른 회원 정보 조회 | `GET` | `/api/users/{userId}` | 다른 사용자의 공개 프로필 정보를 조회합니다. |
| 내 회원 정보 수정 | `PATCH` | `/api/users/me` | 로그인한 사용자의 닉네임, 프로필 이미지와 한줄소개를 수정합니다. |
| 내 회원 정보 조회 | `GET` | `/api/users/me` | 로그인한 사용자의 프로필과 관심 및 거래 요약 정보를 조회합니다. |
| 사용자 아이디 중복 확인 | `GET` | `/api/users/username-availability?username={username}` | 입력한 사용자 아이디의 사용 가능 여부를 확인합니다. |
| 사용자 프로필 등록 | `POST` | `/api/users/me/profile` | 사용자 아이디, 프로필 이미지, 닉네임, 한줄소개를 등록합니다. |
| 회원 탈퇴 | `DELETE` | `/api/users/me` | 로그인한 사용자의 회원 탈퇴를 처리합니다. |

## 판매 게시글 / 상품

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 판매 게시글 이미지 업로드 URL 발급 | `POST` | `/api/posts/images/presigned-urls` | S3에 직접 이미지 업로드할 수 있는 Presigned URL을 발급합니다. |
| 판매 게시글 조회 | `GET` | `/api/posts/{postId}` | - |
| 판매 게시글 등록 | `POST` | `/api/posts` | - |
| 판매 게시글 수정 | `PATCH` | `/api/posts/{postId}` | - |
| 판매 게시글 삭제 | `DELETE` | `/api/posts/{postId}` | - |
| 판매 게시글 목록 조회 | `GET` | `/api/posts` | - |
| 상품 정렬 조회 | `GET` | `/api/posts?sort={sort}` | 지정한 정렬 기준으로 상품 목록을 조회합니다. |
| 상품 조건별 필터 조회 | `GET` | `/api/posts?category={category}&condition={condition}&minPrice={minPrice}&maxPrice={maxPrice}` | 카테고리, 상품 상태와 가격 범위로 상품을 필터링합니다. |
| 상품 키워드 검색 | `GET` | `/api/posts?keyword={keyword}` | 상품명과 설명을 기준으로 상품을 검색합니다. |
| 판매 중인 상품 목록 조회 | `GET` | `/api/posts?status=ON_SALE&page={page}&size={size}` | 판매 중인 상품만 페이지 단위로 조회합니다. |
| 내 관심 상품 목록 조회 | `GET` | `/api/users/me/favorite-posts` | 로그인한 사용자의 관심 상품 목록을 조회합니다. |
| 관심 상품 해제 | `DELETE` | `/api/posts/{postId}/favorites` | 상품을 로그인한 사용자의 관심 상품에서 해제합니다. |
| 관심 상품 등록 | `POST` | `/api/posts/{postId}/favorites` | 상품을 로그인한 사용자의 관심 상품으로 등록합니다. |

## 주문 / 거래

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 주문 생성 | `POST` | `/api/orders` | - |
| 배송 정보 조회 | `GET` | `/api/orders/{orderId}/shipment` | 구매자와 판매자가 주문의 배송 정보를 조회합니다. |
| 배송 정보 수정 | `PATCH` | `/api/orders/{orderId}/shipment` | 판매자가 등록한 택배사와 송장 번호를 수정합니다. |
| 배송 정보 등록 | `POST` | `/api/orders/{orderId}/shipment` | 판매자가 택배사와 송장 번호를 등록합니다. |
| 거래 상세 조회 | `GET` | `/api/orders/{orderId}` | 주문, 결제, 상품과 거래 참여자 정보를 조회합니다. |
| 정산 상태 조회 | `GET` | `/api/orders/{orderId}/settlement` | 주문의 판매 대금 정산 상태를 조회합니다. |
| 판매 대금 정산 처리 | `POST` | `/api/orders/{orderId}/settlement` | 구매 확정된 주문의 판매 대금 정산을 처리합니다. |
| 환불 상태 조회 | `GET` | `/api/orders/{orderId}/refunds` | 주문의 환불 처리 상태를 조회합니다. |
| 환불 요청 | `POST` | `/api/orders/{orderId}/refunds` | 결제된 주문에 대한 환불을 요청합니다. |
| 주문 취소 | `POST` | `/api/orders/{orderId}/cancel` | 취소 가능한 주문을 취소합니다. |
| 구매 확정 | `POST` | `/api/orders/{orderId}/confirm-purchase` | 구매자가 거래 완료를 확인하고 구매를 확정합니다. |

## 결제

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 결제 생성 | `POST` | `/api/payments` | - |
| 결제 승인 | `POST` | `/api/payments/{paymentId}/confirm` | - |
| 결제 조회 | `GET` | `/api/payments/{paymentId}` | - |
| 결제 취소 | `POST` | `/api/payments/{paymentId}/cancel` | - |
| Toss 결제 상태 웹훅 수신 | `POST` | `/api/payments/webhooks/toss` | Toss Payments의 결제 및 가상계좌 상태 변경 웹훅을 수신합니다. |
| 실패한 결제 재시도 | `POST` | `/api/payments/{paymentId}/retry` | 실패한 결제에 대한 재시도를 시작합니다. |

## 채팅

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 이미지 메시지 저장 | `POST` | `/api/chat-rooms/{chatRoomId}/messages/images` | 업로드가 완료된 S3 이미지를 메시지로 저장하고 채팅방 구독자에게 전달합니다. |
| 채팅 이미지 업로드 URL 발급 | `POST` | `/api/chat-rooms/{chatRoomId}/messages/images/upload-url` | S3에 직접 채팅 이미지를 업로드할 수 있는 Presigned URL을 발급합니다. |
| 텍스트 메시지 전송 | `POST` | `/api/chat-rooms/{chatRoomId}/messages/text` | HTTP 요청으로 텍스트 메시지를 저장하고 채팅방 구독자에게 전달합니다. |
| 채팅방 생성 | `POST` | `/api/chat-rooms` | 새로운 채팅방 생성 |
| 채팅방 목록 조회 | `GET` | `/api/chat-rooms` | 로그인한 사용자가 참여한 모든 채팅방 목록 조회 |
| 채팅방 상세 조회 | `GET` | `/api/chat-rooms/{chatRoomId}` | 채팅방 입장시 상단에 [게시글 사진, 게시글 제목]  정보 조회 |
| 메시지 목록 조회 | `GET` | `/api/chat-rooms/{chatRoomId}/messages` | 채팅방 입장시 이전 대화 내용 불러오기 |
| 판매자 문의 목록 조회 | `GET` | `/api/chat-rooms?role=SELLER&postId={postId}` | 판매자의 상품에 접수된 거래 문의 채팅방을 조회합니다. |

## 실시간 채팅 (WebSocket / STOMP)

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 웹소켓 연결 | `STOMP CONNECT` | `/ws` | WebSocket 연결 주소 |
| 텍스트 메세지 구독주소 | `STOMP SUBSCRIBE` | `/sub/chat-rooms/{chatRoomId}` | 해당 채팅방의 새 메시지를 실시간 수신 |
| 텍스트 메세지 발행 주소 | `STOMP PUBLISH` | `/pub/chat-rooms/{chatRoomId}/messages/text` | 해당 채팅방에 텍스트 메시지 전송 |
| 메세지 읽음 처리 요청 | `STOMP PUBLISH` | `/pub/chat-rooms/{chatRoomId}/read` | 채팅방 입장 시 상대방이 보낸 안 읽은 메시지 읽음 처리 요청 |
| 메세지 읽음 처리 구독 | `STOMP SUBSCRIBE` | `/sub/chat-rooms/{chatRoomId}/read` | 상대방의 읽음 처리 이벤트를 실시간 수신 |
| 메시지 전송 | `-` | `/pub/chat-rooms/{chatRoomId}/messages/text` | - |

## 알림

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 모든 알림 읽음 처리 | `PATCH` | `/api/notifications/read-all` | 로그인한 사용자의 모든 알림을 읽음 상태로 변경합니다. |
| 알림 읽음 처리 | `PATCH` | `/api/notifications/{notificationId}/read` | 지정한 알림을 읽음 상태로 변경합니다. |
| 알림 목록 조회 | `GET` | `/api/notifications` | 로그인한 사용자의 거래 및 서비스 알림 목록을 조회합니다. |

## 매장

| 이름 | Method / Type | URL | 설명 |
| --- | --- | --- | --- |
| 매장 상세 및 운영 정보 조회 | `GET` | `/api/stores/{storeId}` | 매장의 위치, 운영 시간과 연락처를 조회합니다. |
| 현재 위치 기준 주변 매장 조회 | `GET` | `/api/stores/nearby?latitude={latitude}&longitude={longitude}&radiusKm={1\|3\|5}` | 현재 위치와 선택한 반경을 기준으로 주변 매장을 조회합니다. |
| 전국 매장 목록 조회 | `GET` | `/api/stores` | 전국의 등록된 매장 정보를 목록으로 조회합니다. |
| 내 관심 매장 목록 조회 | `GET` | `/api/users/me/favorite-stores` | 로그인한 사용자의 관심 매장 목록을 조회합니다. |
| 관심 매장 해제 | `DELETE` | `/api/stores/{storeId}/favorites` | 매장을 로그인한 사용자의 관심 매장에서 해제합니다. |
| 관심 매장 등록 | `POST` | `/api/stores/{storeId}/favorites` | 매장을 로그인한 사용자의 관심 매장으로 등록합니다. |
