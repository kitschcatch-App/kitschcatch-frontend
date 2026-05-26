# KitschCatch 카카오 로그인 프론트엔드 연동 가이드

본 문서는 KitschCatch 플랫폼의 카카오 로그인 및 JWT 발급/갱신 관련 API 규격을 안내합니다.

---

## 1. 요청 규격 (🚨 프론트엔드 수정 필요)

현재 프론트엔드에서 예상하는 `POST /api/auth/kakao` (accessToken 전달 방식)가 **아닙니다.** 
백엔드는 보안을 위해 **OIDC 기반의 ID Token 및 Nonce 검증 방식**을 사용하고 있습니다. 
따라서 다음 **2단계**를 거쳐 로그인을 요청해야 합니다.

### [Step 1] 카카오 로그인용 Nonce 발급
- **Endpoint**: `POST /api/auth/kakao/nonce`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "nonce": "서버에서_발급한_난수문자열",
      "expiresIn": 300
    }
  }
  ```
  *※ 프론트엔드는 이 `nonce` 값을 카카오 로그인 요청 시 파라미터로 포함하여 카카오로부터 `id_token`을 발급받아야 합니다.*

### [Step 2] 카카오 모바일 로그인 (JWT 발급)
- **Endpoint**: `POST /api/auth/kakao/mobile-login`
- **Request Body**:
  ```json
  {
    "idToken": "카카오에서_발급한_id_token",
    "nonce": "Step1에서_발급받았던_nonce_값"
  }
  ```

---

## 2. 응답 규격 (JWT 필드명)

공통 응답 구조(`success`, `data`)를 따르며, `data` 안에 토큰 정보가 담깁니다.
필드명은 정확히 **`accessToken`**과 **`refreshToken`** 입니다.

```json
{
  "success": true,
  "data": {
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 1800,
    "refreshToken": "eyJhbGciOiJI...",
    "refreshTokenExpiresIn": 1209600,
    "user": {
      "id": 1,
      "email": "kakao@example.com",
      "nickname": "kakao"
    }
  }
}
```
*※ 프론트엔드 추출 경로: `response.data.data.accessToken`*

---

## 3. Refresh Token 사용 여부 및 갱신 API

- **Access Token 만료 시간**: 1,800초 (30분)
- **Refresh Token 발급 여부**: **발급됨 (`refreshToken` 필드)**
- **토큰 재발급 API**:
  - **Endpoint**: `POST /api/auth/token/refresh`
  - **Request Body**:
    ```json
    {
      "refreshToken": "보관중인_리프레시_토큰"
    }
    ```
  - **Response**: 로그인 응답과 동일하게 새로운 `accessToken`과 `refreshToken`을 반환합니다. 프론트엔드에서는 401 에러 발생 시(또는 만료 직전) 이 API를 호출하는 자동 갱신(Interceptor) 로직을 추가해야 합니다.

---

## 4. 에러 응답 규격

로그인 실패 및 토큰 관련 주요 예외 응답입니다.

| 상황 | HTTP Status | 에러 코드 (`code`) |
|---|---|---|
| 카카오 이메일 제공 동의를 안 했을 때 | `400 Bad Request` | `AUTH_002` |
| 카카오 로그인(ID Token 검증) 실패 | `401 Unauthorized` | `AUTH_001` |
| 유효하지 않은 Access Token | `401 Unauthorized` | `AUTH_004` |
| 유효하지 않거나 만료된 Refresh Token | `401 Unauthorized` | `AUTH_003` |
| 서버 내부 오류 | `500 Internal Server Error` | `COMMON_999` |

---

## 5. 신규 가입 / 기존 로그인 구분 여부

현재 백엔드 응답 규격에는 `isNewUser`와 같은 **신규/기존 유저를 구분하는 플래그가 없습니다.** 
카카오 로그인을 시도할 때 백엔드에 정보가 없으면 자동 가입 처리 후 JWT를 반환하는 구조로 되어 있습니다. 
*(신규 가입 유저를 위한 별도 온보딩 화면이 꼭 필요하다면 백엔드 개발자와 API 응답 규격 추가 논의가 필요합니다.)*

---

## 요약 (메신저 복붙용)

1. **요청 규격 변경 필요:** 기존에 논의된 `POST /api/auth/kakao` (`accessToken` 방식)이 아니라, `POST /api/auth/kakao/mobile-login`에 `{ "idToken": "...", "nonce": "..." }`를 보내는 방식으로 구현되어 있습니다. 사전에 `POST /api/auth/kakao/nonce`를 호출해서 Nonce를 발급받아야 합니다.
2. **응답 토큰 필드명:** `token`이 아니라 **`accessToken`** 입니다. (`response.data.data.accessToken`)
3. **토큰 갱신:** Access Token(30분), Refresh Token 모두 발급됩니다. 만료 시 `POST /api/auth/token/refresh`로 갱신해주세요.
4. **신규 유저 여부:** 현재 응답에는 `isNewUser` 같은 구분값이 포함되어 있지 않습니다! 온보딩 처리를 위해 이 값이 필요하다면 백엔드 쪽에 추가 요청을 해주셔야 할 것 같아요.