# AGENTS.md

AI 에이전트(그리고 새로 합류한 사람)가 이 저장소에서 일관되게 작업하기 위한 지침서입니다.
**작업 시작 전에 이 문서를 먼저 읽고, 여기 적힌 규칙을 따릅니다.**

---

## 1. 프로젝트 개요

- **kitschcatch** — 서브컬처 굿즈 중고거래 모바일 앱 (프론트엔드)
- **스택**: React Native 0.85 CLI · React 19 · TypeScript(strict) · React Navigation v7(native-stack)
- **주요 연동**: 카카오/네이버 소셜 로그인, Toss 결제, STOMP/SockJS 실시간 채팅, S3 presigned URL 이미지 업로드
- 백엔드는 별도 저장소. API/기능 명세는 [`docs/`](docs/) 참고:
  - [`docs/API_SPEC.md`](docs/API_SPEC.md) — 엔드포인트 명세
  - [`docs/FEATURE_SPEC.md`](docs/FEATURE_SPEC.md) — 기능 명세
  - [`docs/PURCHASE_FLOW.md`](docs/PURCHASE_FLOW.md) — 구매/결제 플로우

## 2. 셋업 & 명령어

```bash
npm install                 # 의존성 (postinstall에서 patch-package 실행)
cp .env.example .env         # 환경변수 채우기 (react-native-config로 주입)

npm test                    # Jest 전체
npm test -- LoginScreen     # 특정 스위트만
npm run lint                # ESLint (@react-native 규칙)
npx tsc --noEmit            # 타입 체크
npm run android             # 안드로이드 실행 (JDK 17)
```

**PR 올리기 전 반드시**: `npm test` · `npm run lint` · `npx tsc --noEmit` 모두 통과.

## 3. 디렉터리 구조

| 경로 | 역할 |
| --- | --- |
| `screens/<도메인>/` | 화면 컴포넌트. 도메인별 폴더: `auth`, `home`, `product`, `chat`, `payment`, `mypage`, `settings`, `dev`. 한 화면이 여러 스텝으로 나뉘면 도메인 폴더 아래 하위 폴더로 묶는다 (예: `screens/auth/signup-steps/`) |
| `components/` | 화면 간 공용 컴포넌트 (`Common*`, 바텀시트, `Toast` 등) |
| `navigation/RootNavigator.tsx` | 단일 native-stack. **모든 라우트와 파라미터 타입은 `RootStackParamList`에 정의** |
| `api/apiClient.ts` | axios 인스턴스 + 도메인별 API 객체(`authAPI`, `productAPI`, ...). 인터셉터에서 토큰 자동 첨부·401 시 refresh |
| `api/mockData.ts` | Mock 모드용 가상 데이터 |
| `contexts/` | 전역 상태 (예: `MockModeContext`) |
| `hooks/` | 커스텀 훅 (예: `useChatSocket`) |
| `utils/` | 순수 함수 로직. 폼 검증·이미지 업로드·상품 등록 등. **테스트하기 쉽게 화면에서 분리** |
| `constants/` `styles/` | 문자열/에러 메시지 매핑, 색상·타이포 토큰 |
| `assets/` | SVG(컴포넌트로 import), 폰트(Pretendard), 이미지 |
| `__tests__/` | Jest 스펙 (`*.test.ts(x)`) |
| `__mocks__/` `jest.setup.js` | 네이티브 모듈 목 |

## 4. 코드 컨벤션

- **Prettier**: single quote, `trailingComma: all`, `arrowParens: avoid`. 커밋 전 포맷.
- **파일 헤더 주석**: 화면·모듈 상단에 역할을 한국어로 설명하는 블록 주석을 단다 (기존 파일 참고).
- **화면 스타일 분리**: `XxxScreen.tsx` + `XxxScreen.styles.ts` 쌍. 인라인 스타일 지양.
- **새 화면 추가 시**:
  1. `screens/<도메인>/`에 컴포넌트 + `.styles.ts` 생성
  2. `RootStackParamList`에 라우트명·파라미터 타입 추가
  3. `RootNavigator`에 `<Stack.Screen>` 등록
- **API 호출**: 컴포넌트에서 직접 axios 쓰지 말고 `api/apiClient.ts`의 도메인 객체에 메서드를 추가해 사용.
- **비밀 저장**: 토큰 등 민감 정보는 `utils/secureStorage.ts`(Keychain 래퍼) 사용. `AsyncStorage`에 토큰 저장 금지.
- **SVG**: `import Icon from '../assets/x.svg'` → `<Icon />` 컴포넌트로 사용 (metro/jest 트랜스포머 설정됨).
- 새 라이브러리 추가는 신중히. 네이티브 링크가 필요한 패키지는 `jest.setup.js`에 목 추가 필요.

## 5. 테스트 컨벤션

- 러너: Jest + `@react-native/jest-preset`. 스펙은 `__tests__/`에 `*.test.ts(x)`.
- **로직 우선 테스트**: `utils/`의 순수 함수에 단위 테스트를 우선 작성. 화면 테스트는 핵심 상호작용만.
- RN 19 렌더링은 `react-test-renderer`의 `act(async () => …)`로 감싼다 (기존 `LoginScreen.test.tsx` 패턴 참고).
- 네이티브 모듈·SVG·`react-native-config`는 스펙 상단 또는 `jest.setup.js`에서 목 처리.
- 테스트를 깨진 채로 두거나 `.skip`으로 방치하지 않는다.

## 6. Git & PR

- **브랜치**: `main`(배포) ← `develop`(통합) ← `feature/*` · `fix/*` · `hotfix/*`
- **PR base 브랜치는 `develop`** (CodeRabbit 자동 리뷰 대상도 `develop`).
- **커밋 메시지**: Conventional Commits 접두사 + 한국어 본문.
  예: `feat(auth): 네이버 소셜 로그인 연동`, `test: 깨진 스위트 복구`, `chore(android): 패키지명 변경`
- 커밋·PR은 사용자가 요청할 때만 생성.
- **커밋 금지**: `.env*`(example 제외), `dump*.xml`(uiautomator UI 덤프) 등 로컬 디버그 산출물, 키스토어(`debug.keystore` 제외). 대부분 `.gitignore`에 등록돼 있으니 새 패턴이 생기면 규칙과 `.gitignore`를 함께 갱신한다.

## 7. 작업 진행 방식

1. 관련 `docs/` 명세와 기존 유사 구현을 먼저 확인한다.
2. 변경 범위를 최소화하고, 주변 코드의 스타일·주석 밀도를 그대로 따른다.
3. 로직은 `utils/`로 빼서 테스트를 붙인다.
4. `npm test` · `lint` · `tsc` 통과를 확인한 뒤 요약과 함께 보고한다.
5. 불확실한 설계 결정은 진행 전에 사용자에게 확인한다.
