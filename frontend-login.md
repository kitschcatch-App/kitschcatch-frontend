# 로그인 / 인증 프론트엔드 가이드

> 백엔드 코드 기준으로 작성된 실제 스펙입니다.

---

## 1. 인증 방식 개요

이 서비스는 **카카오 OIDC(OpenID Connect) 기반 로그인**만 지원합니다. 일반 이메일/비밀번호 로그인은 없습니다.

토큰 방식은 **JWT** 이며, **Access Token + Refresh Token** 두 가지를 사용합니다.

| 토큰 | 유효 시간 | 용도 |
|------|-----------|------|
| Access Token | 30분 | API 요청마다 헤더에 첨부 |
| Refresh Token | 14일 | Access Token 만료 시 갱신 요청 |

서버는 **완전한 Stateless** 구조입니다. 세션이나 쿠키 기반 인증은 없습니다.

---

## 2. 전체 로그인 플로우

```
[앱 실행]
     │
     ▼
[POST /api/auth/kakao/nonce]  ─── nonce 발급 (유효 5분)
     │
     ▼
[카카오 SDK로 OIDC 로그인]  ───  nonce를 카카오 SDK에 전달 → ID 토큰 수령
     │
     ▼
[POST /api/auth/kakao/mobile-login]  ─── idToken + nonce 전송
     │
     ├── 신규 유저: 자동 회원가입 후 로그인 (닉네임 자동 생성)
     └── 기존 유저: 바로 로그인
     │
     ▼
[응답: accessToken, refreshToken, user 정보]
     │
     ▼
[이후 API 요청: Authorization: Bearer {accessToken}]
     │
     ▼ (Access Token 만료 시)
[POST /api/token/refresh]  ─── 새 accessToken + refreshToken 발급
```

---

## 3. API 엔드포인트

### 3-1. Nonce 발급

**`POST /api/auth/kakao/nonce`**

카카오 SDK 호출 전에 반드시 먼저 호출해야 합니다. nonce는 OIDC 재생 공격 방지를 위한 일회용 값입니다.

**Request**: Body 없음

**Response**:
```json
{
  "success": true,
  "data": {
    "nonce": "abc123xyz...",
    "expiresIn": 300
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `nonce` | string | 카카오 SDK에 전달할 nonce 값 |
| `expiresIn` | number | 유효 시간 (초). 항상 `300` (5분) |

> nonce는 **반드시 카카오 SDK 호출 시 파라미터로 전달**해야 합니다. 전달하지 않으면 서버에서 로그인이 거부됩니다.

---

### 3-2. 카카오 로그인

**`POST /api/auth/kakao/mobile-login`**

카카오 SDK에서 받은 ID 토큰과 앞서 발급받은 nonce를 함께 전송합니다.

신규 유저는 자동으로 회원가입이 진행됩니다 (별도 회원가입 API 없음).

**Request**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "nonce": "abc123xyz..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `idToken` | string | Y | 카카오 SDK에서 수령한 OIDC ID 토큰 |
| `nonce` | string | Y | 직전에 `/api/auth/kakao/nonce`로 발급받은 값 |

**Response (성공)**:
```json
{
  "success": true,
  "data": {
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 1800,
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshTokenExpiresIn": 1209600,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "nickname": "고양이1234"
    }
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `tokenType` | string | 항상 `"Bearer"` |
| `accessToken` | string | API 요청에 사용할 토큰 |
| `expiresIn` | number | Access Token 유효 시간 (초). 항상 `1800` (30분) |
| `refreshToken` | string | Access Token 갱신에 사용 |
| `refreshTokenExpiresIn` | number | Refresh Token 유효 시간 (초). 항상 `1209600` (14일) |
| `user.id` | number | 서비스 내부 유저 ID |
| `user.email` | string | 카카오 계정 이메일 |
| `user.nickname` | string | 자동 생성된 닉네임 |

**Response (실패)**:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "카카오 로그인에 실패했습니다."
  }
}
```

| 에러 코드 | HTTP 상태 | 상황 |
|-----------|-----------|------|
| `AUTH_001` | 401 | 카카오 로그인 실패 (토큰 위조, nonce 불일치 등) |
| `AUTH_004` | 400 | 카카오 이메일 동의를 받지 않은 경우 |

> 카카오 이메일 동의(`AUTH_004`)가 발생하면 유저에게 카카오 계정에서 이메일 제공에 동의하도록 안내해야 합니다.

---

### 3-3. Access Token 갱신

**`POST /api/token/refresh`**

Access Token이 만료되면 이 API를 호출해 새로운 토큰 쌍을 발급받습니다.

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response (성공)**: 3-2와 동일한 `AuthTokenResponse` 구조

> Refresh Token도 갱신됩니다 (Refresh Token Rotation). 응답에 담긴 새 `refreshToken`으로 교체해 저장하세요.

**Response (실패)**:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_003",
    "message": "리프레시 토큰이 유효하지 않습니다."
  }
}
```

| 에러 코드 | HTTP 상태 | 상황 |
|-----------|-----------|------|
| `AUTH_003` | 401 | Refresh Token 만료, 위조, 또는 이미 로그아웃된 경우 |

> `AUTH_003`이 반환되면 저장된 토큰을 삭제하고 유저를 로그인 화면으로 이동시켜야 합니다.

---

### 3-4. 로그아웃

**`POST /api/logout`**

서버에서 Refresh Token을 무효화합니다.

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response (성공)**:
```json
{
  "success": true,
  "data": null
}
```

> 로그아웃 API 호출 후, 클라이언트에서도 저장된 `accessToken`과 `refreshToken`을 삭제해야 합니다.

---

## 4. API 인증 헤더

로그인 후 모든 API 요청에는 Access Token을 헤더에 첨부해야 합니다.

```
Authorization: Bearer {accessToken}
```

```js
// 예시
fetch('/api/some-endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
})
```

**인증이 필요 없는 경로** (헤더 없이 요청 가능):
- `POST /api/auth/**` (nonce 발급, 로그인)
- WebSocket 연결 (`/ws`, `/ws/**`) — 단, STOMP CONNECT 헤더에는 토큰 필요

그 외 모든 엔드포인트는 인증 토큰이 없으면 **401** 응답이 반환됩니다.

---

## 5. 토큰 저장 및 관리 전략

### 저장 위치
- React Native / 모바일: `SecureStore` (Expo) 또는 `Keychain` 권장
- 웹: `httpOnly` 쿠키 또는 메모리 저장 권장 (`localStorage`는 XSS에 취약)

### Access Token 갱신 처리

Access Token은 30분마다 만료됩니다. 만료 전에 선제적으로 갱신하거나, API 응답이 `401`일 때 갱신 후 재시도하는 방식 모두 가능합니다.

**401 발생 시 재시도 패턴 예시**:

```js
async function fetchWithAuth(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });

  if (response.status === 401) {
    // Access Token 갱신 시도
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // 갱신 실패 → 로그아웃 처리
      logout();
      return;
    }
    // 갱신 성공 → 원래 요청 재시도
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });
  }

  return response;
}
```

---

## 6. 공통 응답 형식

모든 API는 아래 두 가지 형식 중 하나로 응답합니다.

**성공**:
```json
{
  "success": true,
  "data": { ... }
}
```

**실패**:
```json
{
  "success": false,
  "error": {
    "code": "에러코드",
    "message": "에러 메시지"
  }
}
```

---

## 7. 신규 유저 처리 (회원가입)

별도의 회원가입 API는 없습니다. **카카오 로그인 시 최초 접속이면 자동으로 가입됩니다.**

- 닉네임: 서버에서 자동 생성 (예: `고양이1234`)
- 이메일: 카카오 계정에서 수집 (이메일 동의 필수)

신규 유저와 기존 유저 모두 `/api/auth/kakao/mobile-login` 응답 구조가 동일합니다. 신규/기존 여부를 클라이언트에서 구분해야 한다면 별도로 논의가 필요합니다.

---

## 8. 에러 코드 목록

| 코드 | HTTP 상태 | 설명 | 클라이언트 처리 |
|------|-----------|------|----------------|
| `AUTH_001` | 401 | 카카오 로그인 실패 | 다시 로그인 유도 |
| `AUTH_002` | 401 | 인증 토큰이 유효하지 않음 | 토큰 갱신 후 재시도, 실패 시 로그아웃 |
| `AUTH_003` | 401 | 리프레시 토큰이 유효하지 않음 | 토큰 삭제 후 로그인 화면 이동 |
| `AUTH_004` | 400 | 카카오 이메일 동의 없음 | 이메일 동의 안내 |

---

## 9. 카카오 SDK 연동 포인트

카카오 SDK 설정 시 **OIDC 로그인** 방식으로 호출해야 합니다. 일반 OAuth 로그인(인가 코드 방식)이 아닙니다.

1. 서버에서 nonce를 발급받습니다 (`POST /api/auth/kakao/nonce`)
2. 카카오 SDK의 OIDC 로그인 메서드에 nonce를 전달합니다
3. SDK에서 **ID 토큰**을 수령합니다 (Access Token이 아님)
4. ID 토큰과 nonce를 서버에 전달합니다 (`POST /api/auth/kakao/mobile-login`)

```js
// 카카오 SDK 호출 예시 (React Native Kakao Login 기준)
const { idToken } = await KakaoLogins.login({
  nonce: nonceFromServer,
});
```

> 사용 중인 카카오 SDK의 OIDC / ID 토큰 발급 메서드명은 SDK 버전마다 다를 수 있습니다.
