const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const resetBtn = document.getElementById("resetBtn");

const symbols = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒"];
let cards = [...symbols, ...symbols];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

// Shuffle cards
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Create board
function createBoard() {
  gameBoard.innerHTML = "";
  shuffle(cards);

  cards.forEach(symbol => {
    const col = document.createElement("div");
    col.className = "col-3";

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

// Check match
function checkMatch() {
  const firstSymbol = firstCard.querySelector(".card-back").textContent;
  const secondSymbol = secondCard.querySelector(".card-back").textContent;

  if (firstSymbol === secondSymbol) {
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Reset game
resetBtn.addEventListener("click", () => {
  moves = 0;
  movesEl.textContent = moves;
  resetTurn();
  createBoard();
});

// Init
createBoard();
