# KitschCatch 판매 게시글 및 이미지 연동 프론트엔드 가이드

본 문서는 KitschCatch 플랫폼의 판매 게시글(Post) CRUD API 및 S3 이미지 업로드 처리를 위해 프론트엔드에서 알아야 할 연동 규격과 비즈니스 규칙을 안내합니다.

## 1. 공통 응답 구조
모든 API의 정상 응답은 아래와 같은 기본 래퍼(Wrapper) 구조를 가집니다.
```json
{
  "success": true,
  "data": { ...실제 응답 데이터... }
}
```

---

## 2. 게시글 이미지 업로드 프로세스 (중요)

게시글에 이미지를 첨부하기 위해서는 **직접 S3에 업로드**하는 방식을 사용합니다. 프론트엔드는 다음 2단계 과정을 거쳐야 합니다.

### [Step 1] Presigned URL (업로드 권한) 발급
- **Endpoint**: `POST /api/posts/images/presigned-urls`
- **Request Body**:
  ```json
  {
    "images": [
      {
        "originalFileName": "image.png",
        "contentType": "image/png"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "images": [
        {
          "uploadUrl": "https://bucket.s3.ap-northeast-2.amazonaws.com/posts/1/image.png?signature=...",
          "imageKey": "posts/1/image.png",
          "imageUrl": "https://cdn.example.com/posts/1/image.png",
          "expiresIn": 300
        }
      ]
    }
  }
  ```
  - `expiresIn`: URL 만료 시간 (기본 300초 = 5분)
  - `imageKey`: 게시글 작성/수정 시 백엔드로 전달해야 할 고유 키 값

### [Step 2] S3로 실제 파일 업로드
- Step 1에서 발급받은 `uploadUrl`을 사용하여 프론트엔드에서 S3로 직접 파일을 `PUT` 요청으로 업로드합니다.
- **주의**: 요청 헤더의 `Content-Type`은 Step 1에서 요청한 `contentType`과 반드시 동일해야 합니다.

---

## 3. 판매 게시글 CRUD API 명세

### 3.1 판매 게시글 생성
- **Endpoint**: `POST /api/posts`
- **Request Body**:
  ```json
  {
    "title": "키링 판매",
    "description": "미개봉 굿즈입니다.",
    "price": 12000,
    "productCategory": "굿즈",
    "productCondition": "NEW",
    "imageKeys": ["posts/1/image.png"]
  }
  ```
- **비즈니스 규칙**:
  - `imageKeys`는 필수입니다. 최소 1장 이상의 사진이 필요합니다. (사진이 없으면 `POST_IMAGE_REQUIRED` 에러 발생)
  - 중복된 `imageKey`를 보낼 수 없습니다. (`POST_IMAGE_INVALID` 에러 발생)
  - 자신이 발급받은 `imageKey`만 사용할 수 있습니다.

### 3.2 판매 게시글 목록 조회
- **Endpoint**: `GET /api/posts`
- **Query Parameters**:
  - `page`: 페이지 번호 (0부터 시작)
  - `size`: 페이지당 데이터 개수 (예: 20)
- **Response Data**:
  - `content`: 게시글 목록 배열
  - `totalElements`: 전체 게시글 수
- **특징**: 삭제되지 않은(활성 상태인) 최신순 게시글 목록만 반환됩니다.

### 3.3 판매 게시글 상세 조회
- **Endpoint**: `GET /api/posts/{postId}`

### 3.4 판매 게시글 수정
- **Endpoint**: `PATCH /api/posts/{postId}`
- **Request Body** (일부 필드만 전송 가능 - Patch):
  ```json
  {
    "title": "키링 판매 수정",
    "price": 10000,
    "productStatus": "RESERVED",
    "imageKeys": ["posts/1/new_image.png"]
  }
  ```
- **특징**: 
  - 본인이 작성한 게시글만 수정 가능합니다.
  - `imageKeys`를 전달하면, 기존 이미지 목록이 전달된 이미지 목록으로 완전히 **교체(Replace)** 됩니다.

### 3.5 판매 게시글 삭제
- **Endpoint**: `DELETE /api/posts/{postId}`
- **특징**:
  - 본인이 작성한 게시글만 삭제 가능합니다.
  - 실제 DB에서 지워지지 않고 `deletedAt`이 기록되는 논리적 삭제(Soft Delete)로 처리됩니다.

---

## 4. 도메인 상수(Enum) 값 정의

API 요청 및 응답에 사용되는 열거형(Enum) 값들입니다. 프론트엔드에서는 특히 카테고리의 한글 직렬화에 주의해야 합니다.

### 4.1 상품 카테고리 (`ProductCategory`)
백엔드와 통신 시 **한글 라벨 값**으로 매핑 및 직렬화되어 응답됩니다.
- `ANIME_MANGA` ↔ "애니/만화"
- `GAME` ↔ "게임"
- `GOODS` ↔ "굿즈"
- `COSPLAY` ↔ "코스프레"
- `BOOK` ↔ "서적"
- `MUSIC_VIDEO` ↔ "음반/영상"
- `ETC` ↔ "기타"

### 4.2 판매 상태 (`ProductStatus`)
판매 흐름에 따른 상태 값입니다. (영문 상태값으로 통신)
- `ON_SALE` (판매 중 - 기본값)
- `RESERVED` (예약 중)
- `SOLD_OUT` (판매 완료)

### 4.3 상품 상태 (`ProductCondition`)
- `NEW` (새상품/미개봉 등)

---

## 5. 예외 처리 (에러 코드)

API 호출 시 4xx/5xx HTTP Status와 함께 응답될 수 있는 주요 커스텀 예외 코드(`code`)입니다.

| HTTP Status | Code | Message |
|---|---|---|
| `404 NOT_FOUND` | `POST_001` | 판매 게시글을 찾을 수 없습니다. |
| `403 FORBIDDEN` | `POST_002` | 판매 게시글에 접근할 수 없습니다. (본인 글이 아닐 때) |
| `400 BAD_REQUEST` | `POST_003` | 판매 게시글 사진은 필수입니다. |
| `400 BAD_REQUEST` | `POST_004` | 판매 게시글 사진 정보가 올바르지 않습니다. (중복키 등) |
| `400 BAD_REQUEST` | `POST_005` | 업로드된 판매 게시글 사진을 찾을 수 없습니다. |