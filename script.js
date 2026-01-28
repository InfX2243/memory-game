const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const resetBtn = document.getElementById("resetBtn");

const allSymbols = [
  "🍎","🍌","🍇","🍓","🍉","🍒","🥝","🍍",
  "🥭","🍑","🍋","🍐","🍏","🍊","🥥","🍈",
  "🍅","🍆","🥕","🌽","🥔","🍄"
];

// Level progression
const levels = [
  { cols: 4, rows: 4 }, // 16 cards
  { cols: 6, rows: 4 }, // 24 cards
  { cols: 6, rows: 6 }, // 36 cards
  { cols: 8, rows: 6 }  // 48 cards
];

let currentLevel = 0;

let cards = [];
let totalPairs = 0;
let matchedPairs = 0;
let moves = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Shuffle cards
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Create board
function createBoard(cols) {
  gameBoard.innerHTML = "";
  shuffle(cards);

  const colSize = 12 / cols;

  cards.forEach(symbol => {
    const col = document.createElement("div");
    col.className = `col-${colSize}`;

    col.innerHTML = `
      <div class="card-box">
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${symbol}</div>
        </div>
      </div>
    `;

    col.querySelector(".card-box").addEventListener("click", flipCard);
    gameBoard.appendChild(col);
  });
}

// Flip logic
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

// Match logic
function checkMatch() {
  const firstSymbol = firstCard.querySelector(".card-back").textContent;
  const secondSymbol = secondCard.querySelector(".card-back").textContent;

  if (firstSymbol === secondSymbol) {
    matchedPairs++;
    resetTurn();

    // Level complete
    if (matchedPairs === totalPairs) {
      setTimeout(() => {
        alert(`🎉 Level ${currentLevel + 1} complete!`);

        currentLevel++;
        if (currentLevel >= levels.length) {
          alert("🏆 You completed all levels! Restarting...");
          currentLevel = 0;
        }

        startNewGame();
      }, 600);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

// Reset turn
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Start / restart game
function startNewGame() {
  const { cols, rows } = levels[currentLevel];
  const totalCards = cols * rows;
  totalPairs = totalCards / 2;

  const selectedSymbols = allSymbols.slice(0, totalPairs);
  cards = [...selectedSymbols, ...selectedSymbols];

  matchedPairs = 0;
  moves = 0;
  movesEl.textContent = moves;

  resetTurn();
  createBoard(cols);
}

// Reset button
resetBtn.addEventListener("click", () => {
  currentLevel = 0;
  startNewGame();
});

// Init
startNewGame();
