const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

// 공통 데이터 패치 함수 (지연 시간 0.8초)
async function getPokemon(name) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const res = await fetch(`${POKEMON_BASE_URL}${name}`);
    const data = await res.json();
    return { name: data.name, image: data.sprites.front_default };
}

// 1. 동기 섹션: 피카츄 가족 (순차적 렌더링)
async function runSyncRace() {
    const container = document.getElementById('sync-container');
    const timerDisplay = document.getElementById('sync-timer');
    const pikaFamily = ['pichu', 'pikachu', 'raichu'];

    container.innerHTML = '';
    const startTime = performance.now();
    timerDisplay.innerText = "Running...";

    // [변경점] 미리 빈 카드 3개를 만들어둡니다.
    const cards = pikaFamily.map(() => { // picaFamily의 길이만큼 카드 생성
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="loader"></div>`;
        container.appendChild(card);
        return card;
    });

    // 순서대로 하나씩 가져와서 채웁니다.
    for (let i = 0; i < pikaFamily.length; i++) {
        const data = await getPokemon(pikaFamily[i]); // 여기서 기다림!
        const currentTime = ((performance.now() - startTime) / 1000).toFixed(2); // 타임스탬프 계산

        // 데이터가 도착하면 해당 순서의 카드만 업데이트
        cards[i].innerHTML = `
            <img src="${data.image}" alt="${data.name}">
            <p><strong>${data.name.toUpperCase()}</strong></p>
            <p style="color: blue; font-size: 0.8rem;">Loaded at: ${currentTime}s</p>
        `;
    }

    const endTime = performance.now();
    timerDisplay.innerText = `Total Time: ${((endTime - startTime) / 1000).toFixed(2)}s`;
}

// 2. 비동기 섹션: 이상해씨 가족 (병렬적 렌더링)
async function runAsyncRace() {
    const container = document.getElementById('async-container');
    const timerDisplay = document.getElementById('async-timer');
    const bulbaFamily = ['bulbasaur', 'ivysaur', 'venusaur'];

    container.innerHTML = '';
    const startTime = performance.now();
    timerDisplay.innerText = "Running...";

    // 모든 프로미스를 동시에 실행 (동시에 3개가 움직임)
    const promises = bulbaFamily.map(async (name) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="loader"></div>`;
        container.appendChild(card);

        const data = await getPokemon(name);
        const currentTime = ((performance.now() - startTime) / 1000).toFixed(2); // 타임스탬프 계산

        card.innerHTML = `
            <img src="${data.image}" alt="${data.name}">
            <p><strong>${data.name.toUpperCase()}</strong></p>
            <p style="color: green; font-size: 0.8rem;">Loaded at: ${currentTime}s</p>
            `;
            return data;
    });

    await Promise.all(promises);
    const endTime = performance.now();
    timerDisplay.innerText = `Total Time: ${((endTime - startTime) / 1000).toFixed(2)}s`;
}

document.getElementById('start-btn').addEventListener('click', () => {
    runSyncRace();
    runAsyncRace();
});