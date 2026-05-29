# 결제 기능 백엔드 연동 답변서

> 분석 기준일: 2026-05-30  
> 백엔드 코드 직접 분석 결과

---

## 요약: 프론트엔드 구현 전 반드시 확인할 사항

> **배송지(Address) API가 백엔드에 구현되어 있지 않습니다.**  
> **배송비, 배송 메모, 주문 번호 필드도 없습니다.**  
> 프론트엔드 구현 전에 백엔드 구현 일정을 먼저 조율해야 합니다.

---

## 1. 배송지 관련 API

### 1-1. GET /users/me/addresses — 내 배송지 목록 조회

**현재 구현 상태: 미구현**

- `Address` 엔티티, 레포지토리, DTO, 컨트롤러 모두 없음
- `User` 엔티티 필드: `id`, `nickname`, `email`, `authProvider`, `providerUserId`, `createdAt`만 존재
- 배송지 관련 필드 전무

**질문 답변:**

| 질문 | 답변 |
|---|---|
| 배송지 없는 경우 빈 배열 vs 에러? | **구현 안 됨 — 백엔드 개발 후 확인 필요** |
| address / detailAddress 분리 여부? | **구현 안 됨 — 백엔드 개발 후 확인 필요** |
| 배송지 최대 저장 개수 제한? | **구현 안 됨 — 백엔드 개발 후 확인 필요** |

---

### 1-2. DELETE /users/me/addresses/{addressId} — 배송지 삭제

**현재 구현 상태: 미구현**

---

## 2. 주문/결제 생성 API

### 현재 백엔드의 실제 플로우 (2단계 분리)

프론트에서 요청한 단일 `POST /orders` 방식이 **아닙니다.**  
백엔드는 **주문 생성 → 결제 생성 → 결제 승인** 3단계로 분리되어 있습니다.

```
[1단계] POST /api/orders          → 주문 생성 (15분 홀드)
[2단계] POST /api/payments        → 결제 생성 (토스페이먼츠 초기화)
[3단계] POST /api/payments/{id}/confirm  → 결제 승인 (PG 최종 확인)
```

---

### [1단계] POST /api/orders — 주문 생성

**Request Body:**
```json
{
  "postId": 1
}
```

> `addressId`, `paymentMethod`, `deliveryMemo` 필드는 **현재 없습니다.**  
> 배송지 기능이 구현되면 `addressId`가 추가될 예정이나 현재는 미구현.

**Response (HTTP 201):**
```json
{
  "success": true,
  "data": {
    "id": 100,
    "postId": 1,
    "userId": 5,
    "amount": 125000,
    "orderStatus": "PENDING",
    "expiresAt": "2026-05-30T12:15:00",
    "createdAt": "2026-05-30T12:00:00",
    "updatedAt": "2026-05-30T12:00:00"
  }
}
```

**OrderStatus enum 값:**
- `PENDING` — 결제 대기 중 (주문 생성 직후)
- `PAID` — 결제 완료
- `CANCELED` — 취소됨
- `REFUNDED` — 환불됨
- `EXPIRED` — 15분 초과 만료

---

### [2단계] POST /api/payments — 결제 생성

**Request Body:**
```json
{
  "orderId": 100,
  "method": "CARD"
}
```

**PaymentMethod enum 값 (백엔드 기준):**

| 프론트 표시 | 백엔드 enum | 비고 |
|---|---|---|
| 신용카드 | `CARD` | 사용 가능 |
| 가상계좌 | `VIRTUAL_ACCOUNT` | **사용 불가** — 백엔드에서 명시적으로 거부 처리됨 |
| 핸드폰결제 | `MOBILE_PHONE` | 사용 가능 |
| 무통장입금 | `TRANSFER` | 사용 가능 |
| 간편결제 | **없음** | `EASY_PAY`에 해당하는 enum 없음 |

> `VIRTUAL_ACCOUNT`는 `INVALID_INPUT_VALUE` 에러로 거부됩니다.  
> 간편결제(`EASY_PAY`)는 현재 enum에 없으니 프론트 선택지에서 제거 필요.

**Response (HTTP 201):**
```json
{
  "success": true,
  "data": {
    "paymentId": 1,
    "orderId": 100,
    "pgOrderId": "KC-PAY-{UUID}",
    "amount": 125000,
    "method": "CARD",
    "status": "READY",
    "orderName": "...",
    "clientKey": "토스페이먼츠 클라이언트 키",
    "successUrl": "...",
    "failUrl": "...",
    "expiresAt": "2026-05-30T12:15:00",
    "createdAt": "2026-05-30T12:00:00",
    "updatedAt": "2026-05-30T12:00:00"
  }
}
```

---

### [3단계] POST /api/payments/{paymentId}/confirm — 결제 승인

토스페이먼츠 SDK에서 결제 완료 후 받은 `paymentKey`를 백엔드로 전달합니다.

**Request Body:**
```json
{
  "paymentKey": "토스페이먼츠에서_발급한_결제키"
}
```

**Response (HTTP 200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### PG 연동 방식: **B안 (프론트 SDK 연동)**

**토스페이먼츠 SDK를 프론트엔드에서 직접 연동해야 합니다.**

플로우:
1. 프론트: `POST /api/orders` → 주문 생성
2. 프론트: `POST /api/payments` → 결제 초기화 → 응답에서 `clientKey`, `pgOrderId` 수령
3. 프론트: **토스페이먼츠 JS SDK**로 결제창 열기 (`clientKey` 사용)
4. 사용자: 결제창에서 결제 완료
5. 토스페이먼츠: `successUrl`로 리다이렉트 + `paymentKey` 전달
6. 프론트: `POST /api/payments/{paymentId}/confirm` with `paymentKey` → 최종 승인

> **SDK 설치 필요**: `@tosspayments/tosspayments-sdk` 또는 script 태그로 로드

---

### 질문 답변:

| 질문 | 답변 |
|---|---|
| paymentMethod enum 목록 | `CARD`, `VIRTUAL_ACCOUNT`(사용불가), `MOBILE_PHONE`, `TRANSFER` |
| PG 연동 방식 | **B안 — 토스페이먼츠 SDK 프론트 직접 연동** |
| deliveryMemo 자유입력 vs enum | **현재 필드 자체가 없음 — 미구현** |
| orderNumber 형식 | **없음** — `orderNumber` 필드 없음. `pgOrderId`가 `"KC-PAY-{UUID}"` 형식 |
| orderId / orderNumber 둘 다 내려주는지 | `id`만 있음. `orderNumber`는 없음 |
| 주문+결제 단일 API vs 2단계 | **3단계로 분리됨** (주문 생성 → 결제 생성 → 결제 승인) |

---

## 3. 배송비 정책

**현재 구현 상태: 없음**

- 배송비(shippingFee) 관련 로직, 필드, 상수 전혀 없음
- 주문 응답에 `amount` 필드만 존재 (상품 금액)
- 조건부 무료배송 로직 없음

| 질문 | 답변 |
|---|---|
| 배송비 고정 5,000원? | **미구현 — 백엔드에 배송비 개념 자체 없음** |
| 조건부 무료배송? | **미구현** |
| API에서 동적으로 내려주는지? | **미구현** |

---

## 4. 에러 코드 및 처리

### 에러 응답 형식

기존 API와 동일한 구조:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ORDER_002",
    "message": "주문할 수 없는 판매 게시글입니다.",
    "fieldErrors": null
  }
}
```

> **주의**: 요청서의 예시 형식(`{ success, message, code }`)과 다릅니다.  
> 실제 형식은 `error` 객체 안에 `code`와 `message`가 있습니다.

---

### 결제 관련 에러 코드 전체 목록

| 상황 | HTTP | code | message |
|---|---|---|---|
| 주문을 찾을 수 없음 | 404 | `ORDER_001` | 주문을 찾을 수 없습니다. |
| 판매 불가 게시글 주문 시도 (이미 판매됨/예약중 등) | 409 | `ORDER_002` | 주문할 수 없는 판매 게시글입니다. |
| 주문 결제 가능 시간 만료 (15분 초과) | 400 | `ORDER_003` | 주문 결제 가능 시간이 만료되었습니다. |
| 주문 상태 전이 불가 | 400 | `ORDER_004` | 주문 상태가 올바르지 않습니다. |
| 결제를 찾을 수 없음 | 404 | `PAYMENT_001` | 결제를 찾을 수 없습니다. |
| 결제 상태 전이 불가 | 400 | `PAYMENT_002` | 결제 상태가 올바르지 않습니다. |
| PG API 요청 실패 | 502 | `PAYMENT_003` | 결제 대행사 요청에 실패했습니다. |
| 결제 금액 불일치 | 400 | `PAYMENT_004` | 결제 금액이 주문 금액과 일치하지 않습니다. |
| PG 응답 파싱 실패 | 502 | `PAYMENT_005` | 결제 대행사 응답이 올바르지 않습니다. |
| 게시글 없음 | 404 | `POST_001` | 판매 게시글을 찾을 수 없습니다. |
| 게시글 상태 오류 | 409 | `POST_006` | 판매 게시글 상태가 올바르지 않습니다. |
| 인증 토큰 오류 | 401 | `AUTH_004` | 인증 토큰이 올바르지 않습니다. |
| 리프레시 토큰 오류 | 401 | `AUTH_003` | 리프레시 토큰이 올바르지 않습니다. |
| 입력값 오류 | 400 | `COMMON_001` | 입력값이 올바르지 않습니다. |

**본인 상품 결제 시도:**
- 별도 에러 코드 없음 — `ORDER_002` (`주문할 수 없는 판매 게시글입니다.`)로 처리될 가능성 있음
- 정확한 동작은 백엔드 확인 필요

---

### PaymentStatus enum (내부 상태)

| 값 | 설명 |
|---|---|
| `READY` | 결제 초기화됨 |
| `REQUESTED` | 결제창 열림 |
| `CONFIRMING` | 승인 확인 중 |
| `APPROVED` | 결제 완료 |
| `CANCELING` | 취소 중 |
| `CANCELED` | 취소 완료 |
| `FAILED` | 실패 |

---

## 5. 공통 응답 래퍼 구조

**기존 API와 동일한 구조 사용.**

**성공 시:**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

**실패 시:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "에러코드",
    "message": "에러 메시지",
    "fieldErrors": null
  }
}
```

**검증 오류 시 (fieldErrors 포함):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "COMMON_001",
    "message": "입력값이 올바르지 않습니다.",
    "fieldErrors": [
      { "field": "postId", "message": "must not be null" }
    ]
  }
}
```

> `ApiResponse` record: `httpStatus`(직렬화 제외), `success`, `data`, `error`

---

## 요약 체크리스트 (백엔드 미구현 항목 포함)

| 항목 | 상태 | 비고 |
|---|---|---|
| GET /users/me/addresses | **미구현** | 백엔드 개발 필요 |
| DELETE /users/me/addresses/{id} | **미구현** | 백엔드 개발 필요 |
| POST /orders Request Body | 확인 완료 | `{ "postId": 1 }` — addressId 등 없음 |
| paymentMethod enum 목록 | 확인 완료 | `CARD`, `MOBILE_PHONE`, `TRANSFER` 사용 가능 / `VIRTUAL_ACCOUNT` 사용 불가 / `EASY_PAY` 없음 |
| PG 연동 방식 | 확인 완료 | **B안** — 토스페이먼츠 SDK 프론트 직접 연동 |
| orderNumber 필드명/형식 | 확인 완료 | **없음** — `pgOrderId`가 `KC-PAY-{UUID}` 형식 |
| 배송비 고정 여부 | **미구현** | 배송비 개념 자체 없음 |
| 결제 실패 에러코드 목록 | 확인 완료 | 위 표 참조 |
| 응답 래퍼 구조 | 확인 완료 | `{ success, data, error }` — 기존과 동일 |
| deliveryMemo | **미구현** | 필드 자체 없음 |

---

## 프론트엔드 구현 시 주요 변경 필요 사항

1. **결제 플로우를 3단계로 변경**: 단일 POST /orders가 아니라 주문 생성 → 결제 생성 → 토스 SDK → 결제 승인
2. **토스페이먼츠 SDK 설치** 필요
3. **결제 수단 선택지 수정**: 가상계좌 제거, 간편결제 제거 (백엔드 enum 없음)
4. **PaymentCompleteScreen의 orderNumber**: `pgOrderId` (`KC-PAY-{UUID}`) 사용하거나 백엔드에 `orderNumber` 추가 요청
5. **배송지 기능**: 백엔드 구현 완료 후 연동 (현재 미구현)
6. **배송비 표시**: 백엔드 구현 전까지 프론트에서 임시 상수 처리 or 숨김 처리
7. **에러 응답 파싱**: `response.error.code` / `response.error.message` 형태로 접근