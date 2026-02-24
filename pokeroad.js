const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

// 공통 데이터 패치 함수
async function getPokemon(name) {
  // 실제 네트워크 환경처럼 보이게 0.5초 지연 추가
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const res = await fetch(`${POKEMON_BASE_URL}${name}`);
  const data = await res.json();
  return { name: data.name };
}

// 1. 동기 섹션 (피카츄: 순차적)
async function runSyncTest() {
  console.log("\n--- [동기 섹션 시작: 피카츄] ---");
  const pikaFamily = ['pichu', 'pikachu', 'raichu'];
  
  // 시간 측정 시작 (라벨: 'Sync Time')
  console.time('Sync Time'); 
  
  const results = [];
  for (const name of pikaFamily) {
    const data = await getPokemon(name);
    console.log(`> ${data.name} 완료`);
    results.push(data);
    console.timeEnd('Sync Time'); 
    console.time('Sync Time');
  }

  // 시간 측정 종료 및 결과 출력
  console.log("--- [동기 섹션 종료] ---\n");
}

// 2. 비동기 섹션 (이상해씨: 병렬적)
async function runAsyncTest() {
  console.log("--- [비동기 섹션 시작: 이상해씨] ---");
  const bulbaFamily = ['bulbasaur', 'ivysaur', 'venusaur'];

  console.time('전체 비동기 소요 시간'); // 전체 시간 측정

  const promises = bulbaFamily.map(async (name) => {
    // 1. 각 포켓몬의 이름으로 개별 타이머 시작
    console.time(`소요시간-${name}`); 
    
    const data = await getPokemon(name);
    
    console.log(`>> ${data.name} 데이터 도착!`);
    
    // 2. 해당 포켓몬의 이름으로 타이머 종료
    console.timeEnd(`소요시간-${name}`); 
    
    return data;
  });

  await Promise.all(promises);
  console.timeEnd('전체 비동기 소요 시간');
}

async function main() {
  await runSyncTest();
  await runAsyncTest();
}

main();