# Kitschcatch-frontend

## 개발 환경
- React Native CLI
- Node 18+
- JDK 17 (Android)

## 설치 및 실행

```bash

# Android
npx react-native run-android
```

## 환경변수 설정
```bash
cp .env.example .env
# .env 파일 열어서 값 채우기
```

## 브랜치 전략
- `main`      : 배포 가능한 안정 버전
- `develop`   : 개발 통합
- `feature/*` : 기능 개발
- `fix/*`     : 버그 수정
- `hotfix/*`  : 긴급 패치 (main에서 분기)