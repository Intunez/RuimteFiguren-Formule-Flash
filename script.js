const app = document.getElementById("app");

const figures = [
  { id: "kubus", name: "Kubus", figure: "images/kubus.jpg", formula: "images/for_kub.jpg" },
  { id: "balk", name: "Balk", figure: "images/balk.jpg", formula: "images/for_balk.jpg" },
  { id: "cilinder", name: "Cilinder", figure: "images/cilinder.jpg", formula: "images/for_cil.jpg" },
  { id: "prisma", name: "Prisma", figure: "images/prisma.jpg", formula: "images/for_pris.jpg" },
  { id: "piramide", name: "Piramide", figure: "images/piramide.jpg", formula: "images/for_pira.jpg" },
  { id: "kegel", name: "Kegel", figure: "images/kegel.jpg", formula: "images/for_keg.jpg" },
  { id: "bol", name: "Bol", figure: "images/bol.jpg", formula: "images/for_bol.jpg" }
];

let startTime;
let timerInterval;
let selectedCards = [];
let matchedPairs = 0;

function setBackground(number) {
  document.body.style.backgroundImage = `url("images/achtergrond${number}.png")`;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 500);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function getTimeSeconds() {
  return Math.floor((Date.now() - startTime) / 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function updateTimer() {
  const timer = document.getElementById("timer");
  if (timer) timer.textContent = `⏱️ Tijd: ${formatTime(getTimeSeconds())}`;
}

function getTitle(seconds) {
  if (seconds < 90) return "👑 Meester van de Ruimtefiguren";
  if (seconds < 120) return "🏆 Formule Kampioen";
  if (seconds < 150) return "🚀 Ruimtefiguur Expert";
  if (seconds < 180) return "📐 Volume Kenner";
  return "🔍 Formule Verkenner";
}

function showStart() {
  setBackground(1);
  const best = localStorage.getItem("bestTime");
  app.innerHTML = `
    <div class="panel">
      <h1>Ruimtefiguren Formule Flash</h1>
      <p>Oefen de volumeformules van ruimtefiguren.</p>
      <p>🏆 Beste tijd: ${best ? formatTime(Number(best)) : "nog geen record"}</p>
      <p>${best ? getTitle(Number(best)) : "Speel een eerste keer!"}</p>
      <button onclick="startGame()">Start spel</button>
    </div>
  `;
}

function startGame() {
  startTimer();
  showMemory();
}

function showMemory() {
  setBackground(2);
  selectedCards = [];
  matchedPairs = 0;

  const cards = shuffle([
    ...figures.map(f => ({ type: "figure", id: f.id, img: f.figure })),
    ...figures.map(f => ({ type: "formula", id: f.id, img: f.formula }))
  ]);

  app.innerHTML = `
    <div class="panel">
      <div id="timer" class="timer"></div>
      <h2>Ronde 1: Memory</h2>
      <p>Zoek de juiste combinatie van ruimtefiguur en formule.</p>
      <div class="grid">
        ${cards.map((card, index) => `
  <div class="card hidden ${card.type}" data-id="${card.id}" data-index="${index}">
            <img src="${card.img}" alt="">
          </div>
        `).join("")}
      </div>
    </div>
  `;

  updateTimer();

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => flipCard(card));
  });
}

function flipCard(card) {
  if (!card.classList.contains("hidden")) return;
  if (selectedCards.length === 2) return;

  card.classList.remove("hidden");
  selectedCards.push(card);

  if (selectedCards.length === 2) {
    const [a, b] = selectedCards;

    if (a.dataset.id === b.dataset.id) {
      a.classList.add("matched");
      b.classList.add("matched");
      selectedCards = [];
      matchedPairs++;

      if (matchedPairs === figures.length) {
        setTimeout(showMol, 800);
      }
    } else {
      setTimeout(() => {
        a.classList.add("hidden");
        b.classList.add("hidden");
        selectedCards = [];
      }, 900);
    }
  }
}

function showMol() {
  setBackground(3);

  const correct = shuffle(figures);
  const molIndex = Math.floor(Math.random() * correct.length);
  let wrongFormula;

  do {
    wrongFormula = figures[Math.floor(Math.random() * figures.length)];
  } while (wrongFormula.id === correct[molIndex].id);

  const combos = correct.map((f, index) => ({
    figure: f.figure,
    name: f.name,
    formula: index === molIndex ? wrongFormula.formula : f.formula,
    isMol: index === molIndex
  }));

  app.innerHTML = `
    <div class="panel">
      <div id="timer" class="timer"></div>
      <h2>Ronde 2: Wie is de Mol?</h2>
      <p>Welke formule klopt niet?</p>
      <div id="feedback" class="feedback"></div>
      <div class="mol-grid">
        ${combos.map((c, index) => `
          <div class="combo" data-mol="${c.isMol}">
            <h3>${c.name}</h3>
            <img src="${c.figure}" alt="">
            <img src="${c.formula}" alt="">
          </div>
        `).join("")}
      </div>
    </div>
  `;

  updateTimer();

  document.querySelectorAll(".combo").forEach(combo => {
    combo.addEventListener("click", () => {
      if (combo.dataset.mol === "true") {
        document.getElementById("feedback").textContent = "✅ Juist! Je hebt de mol gevonden.";
        setTimeout(showFlits, 1000);
      } else {
        document.getElementById("feedback").textContent = "❌ Niet juist. Kijk nog eens goed.";
      }
    });
  });
}

let flitsQuestions = [];
let currentFlits = 0;

function showFlits() {
  setBackground(4);
  flitsQuestions = shuffle(figures);
  currentFlits = 0;
  renderFlitsQuestion();
}

function renderFlitsQuestion() {
  const question = flitsQuestions[currentFlits];

  app.innerHTML = `
    <div class="panel">
      <div id="timer" class="timer"></div>
      <h2>Ronde 3: Formule Flits</h2>
      <p>Klik zo snel mogelijk op het juiste ruimtefiguur.</p>
      <div id="feedback" class="feedback"></div>
      <div class="formula-box">
        <img src="${question.formula}" alt="">
      </div>
      <div class="flits-grid">
        ${shuffle(figures).map(f => `
          <div class="figure-choice" data-id="${f.id}">
            <img src="${f.figure}" alt="">
            <h3>${f.name}</h3>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  updateTimer();

  document.querySelectorAll(".figure-choice").forEach(choice => {
    choice.addEventListener("click", () => {
      if (choice.dataset.id === question.id) {
        currentFlits++;

        if (currentFlits >= flitsQuestions.length) {
          showEnd();
        } else {
          renderFlitsQuestion();
        }
      } else {
        document.getElementById("feedback").textContent = "❌ Probeer opnieuw.";
      }
    });
  });
}

function showEnd() {
  stopTimer();
  setBackground(5);

  const finalTime = getTimeSeconds();
  const oldBest = localStorage.getItem("bestTime");
  let message = "";

  if (!oldBest || finalTime < Number(oldBest)) {
    localStorage.setItem("bestTime", finalTime);

    if (oldBest) {
      message = `🎉 NIEUW PERSOONLIJK RECORD! Je bent ${Number(oldBest) - finalTime} seconden sneller.`;
    } else {
      message = "🎉 Eerste record opgeslagen!";
    }
  } else {
    message = `💪 Nog ${finalTime - Number(oldBest) + 1} seconden sneller voor een nieuw record.`;
  }

  const best = localStorage.getItem("bestTime");

  app.innerHTML = `
    <div class="panel">
      <h1>Goed gedaan!</h1>
      <p>Je hebt alle uitdagingen voltooid.</p>
      <h2>⏱️ Jouw tijd: ${formatTime(finalTime)}</h2>
      <h2>🏆 Persoonlijk record: ${formatTime(Number(best))}</h2>
      <h2>${getTitle(Number(best))}</h2>
      <p>${message}</p>
      <button onclick="startGame()">Verbeter je tijd</button>
      <button onclick="showStart()">Terug naar start</button>
    </div>
  `;
}

showStart();
