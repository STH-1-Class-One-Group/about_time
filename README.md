# My Async App (React + Vite)

`App.jsx`에서 `async/await`, `Promise.all`, `try/catch/finally`를 학습할 수 있는 React + Vite 프로젝트입니다.

## 빠른 시작

### 1) 프로젝트 생성 (처음부터 만들 때)
```bash
npm create vite@latest my-async-app -- --template react
```

### 2) 프로젝트 폴더 이동
```bash
cd my-async-app
```

### 3) 개발 서버 실행
```bash
npm run dev
```

### 4) 브라우저 접속
- 기본 주소: `http://localhost:5173/`

## GitHub 클론 후 실행 방법

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_FOLDER>/my-async-app
npm install
npm run dev
```

## 실행 로그 예시 (실제 설치 흐름)

```text
npm create vite@latest my-async-app -- --template react
... Scaffolding project in C:\project\sync\my-async-app
... Installing dependencies with npm
... Starting dev server
VITE v7.3.1 ready
Local: http://localhost:5173/
```

## 사용 패키지

### Dependencies
- `react`
- `react-dom`

### Dev Dependencies
- `vite`
- `@vitejs/plugin-react`
- `eslint` 및 관련 플러그인

## npm 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드 생성
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 검사

## 보안 경고 관련 메모

`npm audit`에서 취약점이 보일 수 있습니다. 학습/개발 단계에서는 즉시 차단 이슈가 아닌 경우가 많고,
먼저 아래 순서로 확인하는 것을 권장합니다.

```bash
npm audit
# 필요 시
npm audit fix
```

`npm audit fix --force`는 메이저 변경(브레이킹 체인지)을 포함할 수 있으므로 신중하게 사용하세요.
