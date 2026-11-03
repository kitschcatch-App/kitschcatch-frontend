# 개발용 네이버 인증 코드 로그인

앱은 `POST /api/auth/naver/state`의 state와 인증 URL을 받는다. `utils/naverOAuth.ts`가 제공자·state·콜백 주소를 검증하고 로그인 시도를 Keychain에 5분보다 짧게 저장한 뒤 외부 브라우저를 연다. HTTPS 콜백의 code/state를 검사해 `{authorizationCode,state}`를 서버에 제출한다. SDK access token 및 앱 번들 내 Client Secret을 사용하지 않는다.

현재 개발 콜백은 `https://dev-kitschcatch.p-e.kr/api/auth/naver/callback`이다. 서버는 실패·취소 후 같은 state를 재사용할 수 없으므로 다시 시작해야 한다. 콜백 이벤트 중복은 한 번만 처리하고, 앱 종료 후에는 Keychain의 보관 값과 getInitialURL로 재개한다. 보관 값이 없거나 만료되면 새 로그인부터 시작한다. 진행 중 네이버 버튼을 누르면 시도를 취소한다. 신규 회원은 TermsAgreement, 프로필 등록 회원은 ProductList로 이동한다.

Android MainActivity의 HTTPS intent filter와 개발 서버 `/.well-known/assetlinks.json`을 연결했다. 서버 연결 내용은 `naver-development-nginx.conf`다. package `com.kitschcatch`, 인증서는 저장소의 Android debug.keystore를 keytool로 확인한 값이다. **공개 개발 키에 대한 개발 서버 설정이며 출시용 연결을 의미하지 않는다.** 출시에는 별도 도메인·배포 서명 인증서 및 네이버 검수가 필요하다. debug 키가 다른 로컬 빌드는 일치하는 인증서 지문을 별도로 등록해야 한다.

이번 작업 대상은 Android 개발 앱이다. iOS 네이티브 콜백 및 Associated Domains 설정은 포함하지 않는다.

개발 환경 파일에는 `API_BASE_URL=https://dev-kitschcatch.p-e.kr/api`와 카카오·지도 등 필요한 기존 설정을 넣는다. 네이버 client ID/secret은 서버 설정만 사용한다. .env는 커밋하지 않는다.

검증: 전체 Jest, TypeScript, ESLint를 실행한다. 기기에서는 앱 재빌드 후 Android App Links가 verified인지 확인하고 네이버 로그인→앱 복귀→서비스 토큰→내 정보 200을 검증한다. 취소·두 번 탭·종료 후 재개·만료도 확인한다. 현재 작업 환경에는 adb/Android SDK가 없어 실제 기기 검증을 수행하지 못했다.

참고: https://reactnative.dev/docs/0.85/linking 및 https://developer.android.com/training/app-links/verify-applinks.

2026-11-04 검증 결과: Jest 19개 스위트·145개 테스트 통과, `npx tsc --noEmit` 통과, ESLint 오류 0개다. 초기 검증에서 발견된 기존 TypeScript 설정·중복 속성·nullable ref 및 린트 오류는 별도 커밋으로 수정했다. 백엔드 PR #74는 develop 34d466b로 병합·시드니 배포됐으며 공개 콜백은 200, 캐시/Referer 차단과 인증값 비반사를 확인했다. Android 연결 JSON은 HTTPS 200 및 실제 개발 인증서 일치를 확인했으나 기기의 verified 상태와 실기기 로그인 완료를 의미하지 않는다.
