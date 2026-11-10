# Android 네이버 로그인과 고정 배송비

현재 서비스 대상은 Android다. 이번 변경에는 iOS 설정 변경이 없다.

## 네이버 로그인

`POST /api/auth/naver/state`의 URL을 열기 전에 HTTPS 콜백 리스너를 등록한다. 콜백은 `https://dev-kitschcatch.p-e.kr/api/auth/naver/callback`만 받고, 성공·실패 모두 현재 시도의 state와 대조한다. 완료·취소·서버 유효시간 만료·브라우저 열기 실패·화면 종료 시 리스너와 타이머를 해제한다. 로그인 중 재클릭을 차단하며 취소 버튼으로 대기를 끝낼 수 있다.

프로세스 종료로 state를 잃으면 이전 콜백으로 로그인하지 않고 새 로그인을 시작한다. `authorizationCode`와 `state`는 서버에 한 번만 제출하며 인증 실패 후 같은 요청을 재전송하지 않는다.

Android Manifest에 개발 HTTPS 콜백의 App Links 필터를 추가했다. 도메인이 바뀌면 Manifest, `utils/naverAuth.ts`, 서버 `NAVER_REDIRECT_URI`, 네이버 등록 콜백을 함께 맞춘다. 설치 빌드의 `com.kitschcatch` 패키지 및 SHA-256 서명 지문이 서버 `/.well-known/assetlinks.json`과 같아야 한다.

설치 기기에서는 `adb shell pm verify-app-links --re-verify com.kitschcatch` 후 `adb shell pm get-app-links com.kitschcatch`의 verified 상태를 확인한다. 네이버 인증 → 앱 복귀 → 토큰 발급 → 내 정보 조회, 취소·만료 후 재시도, 기존 회원 ID 유지까지 확인한다. 개발 앱의 미등록 계정 제한은 코드 수정과 별개이며 테스터 등록 또는 정식 검수가 필요하다.

## 금액 계약

서버는 배송비 3,000원, 구매자 수수료 0원, 판매자 수수료 상품금액의 5%(원 미만 버림)를 적용한다. 배송비는 판매자 수수료 계산에서 제외한다.

앱은 배송지 선택 시 `POST /api/orders/quotes`를 호출한다. 표시·결제 버튼은 견적 금액을 사용하고 주문 요청은 `quoteId`, `shippingAddressId`, `amount=pricing.totalAmount`를 전달한다. 주문 응답 금액이 화면의 견적과 같을 때만 그 금액으로 토스 SDK를 호출한다. 일치하지 않으면 생성 주문을 취소하고 결제창을 열지 않는다. 취소 요청 실패 시 서버의 예약 만료 절차가 적용된다.

견적이 만료되거나 상품·배송지가 바뀌면 새 견적을 표시한 뒤 사용자가 다시 결제한다. 주문 상세는 저장된 `pricing`을 사용한다. pricing이 없는 과거 주문은 `order.amount`가 최종 청구액이며 현재 배송비나 이용료를 추가하지 않는다.

서버와 앱을 함께 적용해야 한다. 서버 `APP_ORDERS_QUOTE_REQUIRED=true`에서는 구버전 앱의 견적 없는 주문을 409로 차단한다. 기존 주문의 저장된 금액은 변경하지 않는다.

## 검증 범위

`PaymentScreen.test.tsx`는 실제 화면 컴포넌트에서 30,000원 상품의 33,000원 표시, 주문 요청, 생성된 WebView 스크립트의 토스 SDK 호출 인자, 결제 완료 화면 전달값을 검증한다. 토스 SDK와 승인 API는 대역을 사용한다. 실제 기기 App Links·네이버 계정 로그인·토스 테스트 결제는 빌드 설치와 서버 반영 후 별도로 확인한다.
