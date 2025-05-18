const socket = io();

let symbol = "";
let myTurn = false;

// DOM Elements
const entry = document.getElementById("entry");
const playerNameInput = document.getElementById("playerName");
const findBtn = document.getElementById("find");
const loading = document.getElementById("loading");
const bigCont = document.getElementById("bigCont");
const user = document.getElementById("user");
const oppName = document.getElementById("oppName");
const value = document.getElementById("value");
const whosTurn = document.getElementById("whosTurn");
const board = document.querySelectorAll(".btn");

let opponent = "";

// Start matchmaking
findBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (name) {
    findBtn.disabled = true;
    loading.style.display = "inline-block";

    socket.emit("find", { name });
  }
});

// On match found
socket.on("matchFound", ({ player, opponent: opp, symbol: assignedSymbol }) => {
  symbol = assignedSymbol;
  opponent = opp;
  myTurn = symbol === "X"; // X starts first

  // Hide entry UI
  entry.style.display = "none";
  loading.style.display = "none";

  // Show game container
  bigCont.style.display = "block";
  user.textContent = player;
  oppName.textContent = opponent;
  value.textContent = symbol;
  whosTurn.textContent = myTurn ? "Your Turn" : `${opponent}'s Turn`;
});

// Handle moves
board.forEach((cell) => {
  cell.addEventListener("click", () => {
    const index = cell.id;

    if (myTurn && cell.textContent === "") {
      cell.textContent = symbol;
      cell.disabled = true;
      socket.emit("move", { index, symbol });

      myTurn = false;
      whosTurn.textContent = `${opponent}'s Turn`;

      if (checkWinner(symbol)) {
        socket.emit("gameOver", { winner: user.textContent });
        showGameOver(`You Win! 🎉`);
      }
    }
  });
});

// Receive opponent's move
socket.on("move", ({ index, symbol: oppSymbol }) => {
  const cell = document.getElementById(index);
  cell.textContent = oppSymbol;
  cell.disabled = true;

  myTurn = true;
  whosTurn.textContent = "Your Turn";

  if (checkWinner(oppSymbol)) {
    showGameOver(`${opponent} Wins! 😢`);
  }
});

// Receive game over
socket.on("gameOver", ({ winner }) => {
  if (winner === null) {
    showGameOver("Opponent left the game. 😔");
  } else if (winner !== user.textContent) {
    showGameOver(`${winner} Wins! 😢`);
  }
});

// Show game over message
function showGameOver(message) {
  setTimeout(() => {
    alert(message);
    location.reload(); // Reload the page for new match
  }, 500);
}

// Check winner logic
function checkWinner(sym) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  return winCombos.some((combo) => {
    return combo.every((i) => document.getElementById(i).textContent === sym);
  });
}
