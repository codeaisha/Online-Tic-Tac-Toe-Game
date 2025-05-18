const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(__dirname + "/public"));

// Start server
http.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Manage player connections
let waitingPlayer = null;
const players = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);

  // Handle player entry and matchmaking
  socket.on("find", ({ name }) => {
    players.set(socket.id, { name, opponent: null });

    if (!waitingPlayer) {
      waitingPlayer = socket;
      console.log(`🕐 ${name} is waiting for an opponent...`);
    } else {
      const player1 = waitingPlayer;
      const player2 = socket;

      const player1Data = players.get(player1.id);
      const player2Data = players.get(player2.id);

      // Match players
      player1Data.opponent = player2;
      player2Data.opponent = player1;

      player1.emit("matchFound", {
        player: player1Data.name,
        opponent: player2Data.name,
        symbol: "X",
      });

      player2.emit("matchFound", {
        player: player2Data.name,
        opponent: player1Data.name,
        symbol: "O",
      });

      waitingPlayer = null;
      console.log(`🎮 Match started: ${player1Data.name} (X) vs ${player2Data.name} (O)`);
    }
  });

  // Handle moves
  socket.on("move", ({ index, symbol }) => {
    const playerData = players.get(socket.id);
    if (playerData?.opponent) {
      playerData.opponent.emit("move", { index, symbol });
    }
  });

  // Handle game over
  socket.on("gameOver", ({ winner }) => {
    const playerData = players.get(socket.id);
    if (playerData?.opponent) {
      playerData.opponent.emit("gameOver", { winner });
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);

    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }

    const playerData = players.get(socket.id);
    if (playerData?.opponent) {
      playerData.opponent.emit("gameOver", { winner: null }); // Opponent left
      const opponentData = players.get(playerData.opponent.id);
      if (opponentData) opponentData.opponent = null;
    }

    players.delete(socket.id);
  });
});
