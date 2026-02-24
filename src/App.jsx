import { useState } from "react";

// ─────────────────────────────────────────────
// 📚 학습용 동기/비동기 예제
// 카페 주문 시스템을 비유로 사용합니다.
// ─────────────────────────────────────────────
// ── 공통 유틸: 지정된 ms만큼 기다리는 Promise 반환 ──
// new Promise()   → "나중에 결과 줄게"라는 상자를 생성
// (resolve) =>    → resolve를 호출하면 성공 처리됨
// setTimeout      → ms 뒤에 resolve 호출 (실제 API 지연 시뮬레이션)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── 음료 제조 함수 (비동기) ──
// async 키워드 → 이 함수는 항상 Promise를 반환함
// await delay() → delay가 끝날 때까지 "이 줄에서만" 기다림
//                 (다른 코드는 계속 실행됨 — 논블로킹)
async function makeDrink(name, ms) {
  await delay(ms);           // ms초 동안 음료 제조 대기
  return `☕ ${name} 완성`; // 완성된 음료 이름 반환
}

// ─────────────────────────────────────────────
// 1️⃣  동기 방식 시뮬레이션
//   → 한 번에 하나씩, 앞이 끝나야 다음 시작
//   → 실제 JS 동기는 블로킹이지만,
//     여기선 await를 직렬로 써서 "동기처럼" 표현
// ─────────────────────────────────────────────
async function syncStyle(log) {
  log("🧍 [동기] 아메리카노 주문 → 제조 시작...");

  // await → 아메리카노가 완전히 나올 때까지 다음 줄로 못 넘어감
  const americano = await makeDrink("아메리카노", 1500);
  log(`✅ ${americano}`); // 1.5초 뒤 출력

  log("🧍 [동기] 라떼 주문 → 제조 시작...");

  // await → 아메리카노 다 나온 뒤에야 라떼 제조 시작
  const latte = await makeDrink("라떼", 1000);
  log(`✅ ${latte}`); // 추가 1초 뒤 출력

  log("🧍 [동기] 스무디 주문 → 제조 시작...");

  // await → 라떼 다 나온 뒤에야 스무디 제조 시작
  const smoothie = await makeDrink("스무디", 800);
  log(`✅ ${smoothie}`); // 추가 0.8초 뒤 출력

  // 총 대기 시간 = 1500 + 1000 + 800 = 3300ms (직렬 합산)
  log("🏁 [동기] 모든 주문 완료! 총 약 3.3초 소요");
}

// ─────────────────────────────────────────────
// 2️⃣  비동기 방식 (Promise.all)
//   → 세 음료를 동시에 주문, 모두 나오면 한 번에 수령
//   → 가장 오래 걸리는 것 기준으로 대기
// ─────────────────────────────────────────────
async function asyncStyle(log) {
  log("🚀 [비동기] 아메리카노 + 라떼 + 스무디 동시 주문!");

  // makeDrink()를 await 없이 호출 → 즉시 Promise 반환, 제조는 백그라운드에서 동시 시작
  const p1 = makeDrink("아메리카노", 1500); // Promise 객체 (아직 안 기다림)
  const p2 = makeDrink("라떼", 1000);       // Promise 객체 (아직 안 기다림)
  const p3 = makeDrink("스무디", 800);      // Promise 객체 (아직 안 기다림)

  log("⏳ [비동기] 세 음료 동시 제조 중... (다른 작업 가능)");

  // Promise.all([...]) → 배열 안 Promise가 전부 완료될 때까지 기다림
  // await              → 여기서 한 번만 기다림 (가장 긴 1.5초)
  // 구조분해 할당      → 완료된 결과를 순서대로 변수에 담음
  const [americano, latte, smoothie] = await Promise.all([p1, p2, p3]);

  // 세 개가 동시에 완료되면 아래 코드 실행
  log(`✅ ${americano}`);
  log(`✅ ${latte}`);
  log(`✅ ${smoothie}`);

  // 총 대기 시간 = max(1500, 1000, 800) = 1500ms (병렬 최댓값)
  log("🏁 [비동기] 모든 주문 완료! 총 약 1.5초 소요");
}

// ─────────────────────────────────────────────
// 3️⃣  에러 처리 예제 (try/catch)
//   → 비동기 실패 상황을 안전하게 처리하는 패턴
// ─────────────────────────────────────────────

// 실패할 수도 있는 음료 함수 (50% 확률로 에러 발생)
async function makeRiskyDrink(name, ms) {
  await delay(ms); // ms만큼 기다린 뒤

  // Math.random() → 0~1 사이 난수 / 0.5 미만이면 에러 발생
  if (Math.random() < 0.5) {
    // throw → 강제로 에러를 발생시킴 (reject 상태로 전환)
    throw new Error(`❌ ${name} 재료 부족!`);
  }
  return `☕ ${name} 완성`;
}

async function errorStyle(log) {
  log("⚠️  [에러처리] 불안정한 음료 주문 시작...");

  // try 블록 → 정상 흐름 코드를 여기에 작성
  try {
    // await → 성공하면 결과값, 실패하면 catch로 점프
    const drink = await makeRiskyDrink("에스프레소", 1000);
    log(`✅ 성공: ${drink}`); // 성공 시 실행
  } catch (err) {
    // catch(err) → throw된 에러가 err 변수로 전달됨
    log(`🚨 실패: ${err.message}`); // 실패 시 실행
  } finally {
    // finally → 성공/실패 상관없이 항상 실행
    log("🧹 [finally] 테이블 정리 완료 (항상 실행)");
  }
}

// ─────────────────────────────────────────────
// UI 컴포넌트
// ─────────────────────────────────────────────

const EXAMPLES = [
  {
    id: "sync",
    label: "동기 방식",
    emoji: "🐢",
    desc: "한 번에 하나씩 — 직렬 실행",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    fn: syncStyle,
    time: "약 3.3초",
  },
  {
    id: "async",
    label: "비동기 방식",
    emoji: "🚀",
    desc: "동시에 모두 — 병렬 실행",
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    fn: asyncStyle,
    time: "약 1.5초",
  },
  {
    id: "error",
    label: "에러 처리",
    emoji: "🛡️",
    desc: "try / catch / finally",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    fn: errorStyle,
    time: "약 1초",
  },
];

const CODE = {
  sync: `// ── 동기 방식: await를 직렬로 사용 ──
async function syncStyle() {

  // await → 앞 음료가 완성될 때까지 다음 줄 실행 불가
  const americano = await makeDrink("아메리카노", 1500);
  // 1.5초 뒤에야 아래 줄 실행됨
  console.log(americano);

  // await → 아메리카노 완성 후에야 라떼 제조 시작
  const latte = await makeDrink("라떼", 1000);
  // 추가 1초 뒤 실행
  console.log(latte);

  // await → 라떼 완성 후에야 스무디 제조 시작
  const smoothie = await makeDrink("스무디", 800);
  // 추가 0.8초 뒤 실행
  console.log(smoothie);

  // 총 소요: 1500 + 1000 + 800 = 3300ms
}`,
  async: `// ── 비동기 방식: Promise.all로 병렬 처리 ──
async function asyncStyle() {

  // await 없이 호출 → 즉시 Promise 반환
  // 세 제조가 백그라운드에서 동시에 시작됨!
  const p1 = makeDrink("아메리카노", 1500);
  const p2 = makeDrink("라떼", 1000);
  const p3 = makeDrink("스무디", 800);

  // Promise.all → 세 Promise를 배열로 묶어서
  // await       → 전부 완료될 때까지 한 번만 기다림
  // 구조분해    → 완료 결과를 순서대로 변수에 담음
  const [americano, latte, smoothie] =
    await Promise.all([p1, p2, p3]);

  // 세 개 동시 완료 후 출력
  console.log(americano, latte, smoothie);

  // 총 소요: max(1500, 1000, 800) = 1500ms
}`,
  error: `// ── 에러 처리: try / catch / finally ──
async function errorStyle() {

  // try 블록 → 정상 흐름 코드 작성
  try {
    // await → 성공하면 결과값 반환
    //         실패(throw)하면 catch로 점프
    const drink = await makeRiskyDrink("에스프레소", 1000);

    // throw 없이 완료된 경우만 여기 실행
    console.log("성공:", drink);

  } catch (err) {
    // throw된 에러가 err 변수로 전달됨
    // 이 블록이 있으면 앱이 죽지 않고 안전하게 처리
    console.error("실패:", err.message);

  } finally {
    // 성공/실패 상관없이 무조건 실행
    // 로딩 스피너 끄기, 리소스 해제 등에 활용
    console.log("항상 실행");
  }
}`,
};

export default function App() {
  const [logs, setLogs] = useState({});
  const [running, setRunning] = useState({});
  const [activeCode, setActiveCode] = useState("sync");

  const run = async (ex) => {
    if (running[ex.id]) return;
    setLogs((p) => ({ ...p, [ex.id]: [] }));
    setRunning((p) => ({ ...p, [ex.id]: true }));

    const log = (msg) =>
      setLogs((p) => ({ ...p, [ex.id]: [...(p[ex.id] || []), msg] }));

    const start = Date.now();
    await ex.fn(log);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    log(`⏱ 실제 소요 시간: ${elapsed}초`);

    setRunning((p) => ({ ...p, [ex.id]: false }));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: "32px 16px 60px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto 32px" }}>
        <div style={{ fontSize: 11, color: "#6366f1", letterSpacing: 3, marginBottom: 8, fontWeight: 700 }}>
          JAVASCRIPT ASYNC LEARNING LAB
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#f8fafc", lineHeight: 1.3 }}>
          카페 주문으로 배우는<br />
          <span style={{ color: "#818cf8" }}>동기 / 비동기 처리</span>
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 10, lineHeight: 1.7 }}>
          ▶ 실행 버튼을 눌러 로그를 확인하고, 아래 주석 코드로 원리를 학습하세요.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 28 }}>
          {EXAMPLES.map((ex) => {
            const exLogs = logs[ex.id] || [];
            const isRunning = running[ex.id];
            return (
              <div key={ex.id} style={{
                background: "#1a1d27",
                border: `1px solid ${isRunning ? ex.color : "#2d3148"}`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.3s",
              }}>
                {/* Card top */}
                <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid #2d3148" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 20 }}>{ex.emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", marginTop: 4 }}>{ex.label}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{ex.desc}</div>
                    </div>
                    <span style={{
                      background: ex.color + "22",
                      color: ex.color,
                      border: `1px solid ${ex.color}44`,
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}>{ex.time}</span>
                  </div>
                  <button
                    onClick={() => run(ex)}
                    disabled={isRunning}
                    style={{
                      marginTop: 12,
                      width: "100%",
                      padding: "8px",
                      borderRadius: 8,
                      border: "none",
                      background: isRunning ? "#2d3148" : ex.color,
                      color: isRunning ? "#64748b" : "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: isRunning ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    {isRunning ? "⏳ 실행 중..." : "▶ 실행"}
                  </button>
                </div>
                {/* Log area */}
                <div style={{
                  minHeight: 120,
                  padding: "12px 16px",
                  fontSize: 12,
                  lineHeight: 2,
                  color: "#94a3b8",
                }}>
                  {exLogs.length === 0 ? (
                    <span style={{ color: "#374151" }}>실행 버튼을 눌러보세요...</span>
                  ) : (
                    exLogs.map((l, i) => (
                      <div key={i} style={{
                        color: l.startsWith("✅") ? "#34d399"
                          : l.startsWith("🚨") ? "#f87171"
                          : l.startsWith("🏁") ? ex.color
                          : l.startsWith("⏱") ? "#fbbf24"
                          : "#cbd5e1",
                        animation: "fadeIn 0.3s ease",
                      }}>{l}</div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Code Viewer */}
        <div style={{
          background: "#1a1d27",
          border: "1px solid #2d3148",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #2d3148" }}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setActiveCode(ex.id)}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  background: activeCode === ex.id ? "#252836" : "transparent",
                  color: activeCode === ex.id ? ex.color : "#4b5563",
                  fontWeight: activeCode === ex.id ? 700 : 400,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderBottom: activeCode === ex.id ? `2px solid ${ex.color}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {ex.emoji} {ex.label}
              </button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingRight: 16 }}>
              <span style={{ fontSize: 10, color: "#374151", letterSpacing: 1 }}>주석 포함 코드</span>
            </div>
          </div>

          {/* Code */}
          <pre style={{
            margin: 0,
            padding: "24px 28px",
            fontSize: 12.5,
            lineHeight: 2,
            overflowX: "auto",
            color: "#e2e8f0",
          }}>
            {CODE[activeCode].split("\n").map((line, i) => {
              const isComment = line.trim().startsWith("//");
              const isKeyword = /\b(async|await|try|catch|finally|const|return|throw|new|if)\b/.test(line);
              return (
                <div key={i} style={{
                  color: isComment ? "#4b6b4b" : "#e2e8f0",
                  fontStyle: isComment ? "italic" : "normal",
                }}>
                  <span style={{ color: "#374151", userSelect: "none", marginRight: 16, fontSize: 11 }}>
                    {String(i + 1).padStart(2, " ")}
                  </span>
                  {isComment ? (
                    <span style={{ color: "#6a9955" }}>{line}</span>
                  ) : (
                    line.split(/(\b(?:async|await|try|catch|finally|const|return|throw|new|if|Promise)\b)/).map((part, j) =>
                      /^(async|await|try|catch|finally|const|return|throw|new|if|Promise)$/.test(part)
                        ? <span key={j} style={{ color: "#c792ea" }}>{part}</span>
                        : <span key={j}>{part}</span>
                    )
                  )}
                </div>
              );
            })}
          </pre>
        </div>

        {/* Bottom tip */}
        <div style={{
          marginTop: 20,
          padding: "14px 20px",
          background: "#1a1d27",
          borderRadius: 10,
          border: "1px solid #2d3148",
          fontSize: 12,
          color: "#64748b",
          lineHeight: 1.8,
        }}>
          <span style={{ color: "#818cf8", fontWeight: 700 }}>💡 핵심 암기 포인트 </span><br />
          <span style={{ color: "#94a3b8" }}>
            async 함수 안에서만 await 사용 가능 &nbsp;·&nbsp;
            Promise.all = 동시 실행 후 전부 완료 대기 &nbsp;·&nbsp;
            try/catch = 비동기 에러 처리 기본 패턴
          </span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}