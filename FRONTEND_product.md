# KitschCatch 프론트엔드 연동 가이드: 상품 및 로그인 상세 (Fix 1 ~ 4)

본 문서는 프론트엔드에서 제기된 4가지 주요 이슈(로그인 판별, 상품 목록/상세 응답 구조, 게시글 수정 로직)에 대한 상세 가이드입니다.

---

## 🔴 Fix 1 — SplashScreen 토큰 체크 및 로그인 상태 판별

**Q. 저장된 accessToken이 유효한지 확인하는 API(예: `/me`)가 있나요? 없다면 토큰 존재 여부만 확인해도 괜찮을까요?**

*   **현재 상태:** MVP 초기 단계인 현재, 명시적인 내 정보 조회(`GET /api/users/me`) 엔드포인트는 연동 가이드상에 노출되어 있지 않습니다.
*   **해결 방법:** 프론트엔드에 **토큰 만료 시 `refreshToken`으로 자동 갱신하는 인터셉터가 구현되어 있다면, SplashScreen에서는 단순히 로컬 스토리지(또는 Secure Storage) 내 토큰 존재 여부만 확인하고 메인 화면으로 진입**해도 무방합니다.
*   **동작 흐름:** 
    1. 토큰이 존재하면 -> `ProductListScreen` 진입
    2. 진입 후 최초 API(`GET /api/posts`) 호출 시 토큰이 만료되었다면 -> 인터셉터가 `POST /api/auth/token/refresh` 호출하여 갱신
    3. 갱신 실패 시(리프레시 토큰도 만료) -> 로그인 화면으로 튕겨내는 로직 처리

---

## 🔴 Fix 2 — ProductListScreen 응답 구조

**Q. `GET /api/posts` 응답 JSON 전체 구조 및 필드 매핑**

*   **데이터 경로:** 게시글 배열이 담긴 정확한 경로는 **`response.data.data.content`** 입니다. (공통 응답 래퍼 `data` 하위에 Spring Data JPA의 페이지 객체 필드인 `content`가 위치함)
*   **페이징 방식:** 커서 기반이 아닌 **`page`, `size` 기반**입니다. (예: `GET /api/posts?page=0&size=20`)

**[게시글 객체 필드 매핑]**

| 프론트엔드에서 읽는 필드 | 실제 백엔드 응답 필드명 | 비고 / 타입 |
| :--- | :--- | :--- |
| `post.postId` | **`id`** | 숫자 (Number) |
| `post.title` | **`title`** | 문자열 (String) |
| `post.price` | **`price`** | 숫자 (Number) |
| `post.thumbnailUrl` | **`images[0].imageUrl`** | 백엔드에서는 `images` 배열로 내려주므로, 첫 번째 객체의 `imageUrl`을 썸네일로 사용 |
| `post.heartCount` | **(없음)** | MVP 단계 도메인 설계상 아직 존재하지 않으므로 프론트엔드에서 `0`으로 하드코딩 처리 요망 |
| `post.chatCount` | **(없음)** | 위와 동일 |
| `post.status` | **`productStatus`** | 영문 Enum 값 (예: `"ON_SALE"`, `"RESERVED"`, `"SOLD_OUT"`) |
| `post.category` | **`productCategory`** | **한글 라벨 값** (예: `"굿즈"`, `"애니/만화"`) |
| `post.condition` | **`productCondition`** | 영문 Enum 값 (예: `"NEW"`) |
| `post.createdAt` | **`createdAt`** | 날짜 문자열 (ISO 8601 형식) |

---

## 🔴 Fix 3 — ProductDetailScreen 응답 구조 + 유저 식별

**Q1. `GET /api/posts/{postId}` 응답 구조 및 필드명**

*   **데이터 경로:** 배열이 아닌 단일 객체이므로 **`response.data.data`** 입니다.

| 프론트엔드에서 읽는 필드 | 실제 백엔드 응답 필드명 | 비고 / 타입 |
| :--- | :--- | :--- |
| `post.postId` | **`id`** | 숫자 (Number) |
| `post.title` | **`title`** | 문자열 (String) |
| `post.price` | **`price`** | 숫자 (Number) |
| `post.imageURL` | **`images`** | 객체 배열. `[{ "imageKey": "...", "imageUrl": "..." }]` 형태 |
| `post.description` | **`description`** | 문자열 (String) |
| `post.sellerId` | **`seller.id` 또는 `user.id`** | 게시글 작성자 정보 객체 내 숫자 ID (명세 확정 전이므로 콘솔 로그로 트리 뎁스 확인 요망, 보통 `seller: { id: 1, nickname: "..." }` 형태) |
| `post.productCategory`| **`productCategory`** | 한글 라벨 (예: `"굿즈"`) |
| `post.productCondition`| **`productCondition`**| 영문 Enum (예: `"NEW"`) |
| `post.productStatus` | **`productStatus`** | 영문 Enum (예: `"ON_SALE"`) |
| `post.createdAt` | **`createdAt`** | 날짜 문자열 |

**Q2. 현재 로그인 유저 식별 방법 ("수정하기" vs "채팅하기" 구분)**

*   상세 응답의 판매자 식별자(예: `seller.id`)는 **숫자(Number)** 타입입니다.
*   프론트엔드는 로그인 완료 시 반환된 데이터(`POST /api/auth/kakao/mobile-login`) 중 **`response.data.data.user.id`** (숫자)를 전역 상태(Context/Redux 등)나 로컬 스토리지에 저장해야 합니다.
*   상세 페이지 진입 시, **`로그인한 user.id === 상세 응답의 seller.id`** 인지 비교하여 일치하면 [수정/삭제] 버튼을, 다르면 [채팅하기] 버튼을 노출하면 됩니다.

---

## 🔴 Fix 4 — ProductEditScreen 수정 API 구조

**Q1. `PATCH /api/posts/{postId}` 요청 구조 (전송 가능한 필드 및 타입)**

*   수정은 `PATCH` 메서드를 사용하며, 수정할 필드만(혹은 전체를) 보낼 수 있습니다.
*   **주의점:** 카테고리(`productCategory`)는 생성(`POST`)할 때와 동일하게 **한글(예: `"굿즈"`)로 전송**합니다.

```json
{
  "title": "키링 판매 수정",
  "description": "설명 수정 내용...",
  "price": 10000, 
  "productCategory": "굿즈",
  "productCondition": "NEW",
  "productStatus": "RESERVED",
  "imageKeys": ["posts/1/new_image.png"]
}
```
*   **타입 안내**:
    *   `price`: **숫자 (Number)**
    *   `productCategory`: **한글 문자열 (String)**
    *   `productCondition`, `productStatus`: **영문 문자열 (String)**

**Q2. 이미지 수정 플로우**

질문하신 플로우가 **정확히 맞습니다.** 백엔드는 `PATCH` 시 전달된 `imageKeys` 배열로 기존 이미지를 완전히 교체(Replace)합니다.

1. **URL 발급:** `POST /api/posts/images/presigned-urls` 로 새 업로드 권한 요청
2. **S3 업로드:** 발급받은 `uploadUrl`을 사용하여 S3로 이미지 `PUT` 요청 (Content-Type 일치 필수)
3. **게시글 수정:** 성공적으로 업로드한 후, 받은 `imageKey`들을 모아 `PATCH /api/posts/{postId}` 의 `imageKeys` 배열에 담아 전송

*(참고: 기존 이미지를 유지하고 하나만 추가하더라도, 기존 유지할 `imageKey`와 새로 추가할 `imageKey`를 모두 합친 배열을 보내야 합니다.)*