const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const resetBtn = document.getElementById("resetBtn");
const progressBar = document.getElementById("progressBar");

const levelModal = document.getElementById("levelModal");
const modalMessage = document.getElementById("modalMessage");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const allSymbols = [
  "🍎","🍌","🍇","🍓","🍉","🍒","🥝","🍍",
  "🥭","🍑","🍋","🍐","🍏","🍊","🥥","🍈"
];

const levels = [
  { cols: 4, rows: 4 },
  { cols: 6, rows: 4 },
  { cols: 6, rows: 6 }
];

let currentLevel = 0;
let cards = [];
let totalPairs = 0;
let matchedPairs = 0;
let moves = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;


// HELPERS
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function updateProgress() {
  progressBar.style.width =
    (matchedPairs / totalPairs) * 100 + "%";
}


//  BOARD CREATION
function createBoard(cols) {
  gameBoard.innerHTML = "";
  shuffle(cards);

  const cardSize = 100;
  const gap = 16;

  gameBoard.style.gridTemplateColumns =
    `repeat(${cols}, ${cardSize}px)`;
  gameBoard.style.gap = `${gap}px`;

  const boardWrapper = document.querySelector(".board-wrapper");
  boardWrapper.style.width =
    cols * cardSize + (cols - 1) * gap + "px";

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card-box";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;

    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

// GAME LOGIC
function flipCard() {
  if (lockBoard || this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const a = firstCard.querySelector(".card-back").textContent;
  const b = secondCard.querySelector(".card-back").textContent;

  if (a === b) {
    matchedPairs++;
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    updateProgress();
    resetTurn();
  } else {
    lockBoard = true;

    [firstCard, secondCard].forEach(card => {
      card.classList.remove("wrong");
      void card.offsetWidth;
      card.classList.add("wrong");
    });

    setTimeout(() => {
      firstCard.classList.remove("flipped", "wrong");
      secondCard.classList.remove("flipped", "wrong");
      resetTurn();
    }, 700);
  }

  if (matchedPairs === totalPairs) {
    setTimeout(() => {
      modalMessage.textContent =
        `You completed level ${currentLevel + 1}!`;
      levelModal.style.display = "flex";
      confetti();
    }, 500);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// GAME CONTROL
function startGame() {
  const { cols, rows } = levels[currentLevel];
  totalPairs = (cols * rows) / 2;

  cards = [
    ...allSymbols.slice(0, totalPairs),
    ...allSymbols.slice(0, totalPairs)
  ];

  matchedPairs = 0;
  moves = 0;
  movesEl.textContent = 0;
  progressBar.style.width = "0%";

  resetTurn();
  createBoard(cols);
}

resetBtn.addEventListener("click", () => {
  currentLevel = 0;
  startGame();
});

nextLevelBtn.addEventListener("click", () => {
  levelModal.style.display = "none";
  currentLevel = (currentLevel + 1) % levels.length;
  startGame();
});


// INIT
startGame();
