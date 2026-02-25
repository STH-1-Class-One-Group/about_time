# My Async App (React + Vite)

`App.jsx`에서 `async/await`, `Promise.all`, `try/catch/finally`를 학습할 수 있는 React + Vite 프로젝트입니다.

## 빠른 시작

```bash
npm create vite@latest my-async-app -- --template react
cd my-async-app
npm run dev
```

브라우저에서 `http://localhost:5173/` 접속.

## GitHub 클론 후 실행

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_FOLDER>/my-async-app
npm install
npm run dev
```

## 실행 로그 예시

```text
npm create vite@latest my-async-app -- --template react
... Scaffolding project in C:\project\sync\my-async-app
... Installing dependencies with npm
... Starting dev server
VITE v7.3.1 ready
Local: http://localhost:5173/
```

## npm scripts

- `npm run dev` 개발 서버
- `npm run build` 프로덕션 빌드
- `npm run preview` 빌드 미리보기
- `npm run lint` ESLint 검사

## 보안 경고 메모

```bash
npm audit
npm audit fix
```

`npm audit fix --force`는 브레이킹 체인지가 들어갈 수 있어 신중히 사용하세요.
