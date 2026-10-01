# Online Tic-Tac-Toe

A real-time two-player Tic-Tac-Toe game with automatic matchmaking, built with Node.js, Express and Socket.IO.

## Features
- Enter your name and get matched with another online player
- Real-time moves over WebSockets (Socket.IO)
- Win and draw detection
- Handles opponent disconnects
- Responsive UI for desktop and mobile

## Tech Stack
- **Backend:** Node.js, Express, Socket.IO
- **Frontend:** HTML, CSS, JavaScript

## Project Structure
```
.
├── server.js        # Express + Socket.IO server, matchmaking
├── public/
│   ├── index.html   # Game UI and client logic
│   ├── style.css
│   ├── loading.png
│   └── loading.gif
├── package.json
└── LICENSE
```

## How It Works
1. A player enters a name and clicks **Find Opponent**.
2. The server keeps a waiting queue. When a second player joins, the two are matched and assigned X and O.
3. Moves are sent to the server and relayed to the opponent in real time.
4. The game ends on a win, a draw, or when a player leaves.

## Run Locally
```bash
git clone https://github.com/codeaisha/Online-Tic-Tac-Toe-Game.git
cd Online-Tic-Tac-Toe-Game
npm install
npm start
```
Open `http://localhost:3001` in two browser tabs (or two devices on the same network) and click **Find Opponent** in both.

## Screenshots
_Add a screenshot or GIF of two players in a game here._

## Future Improvements
- Server-side move validation
- Rematch option and game history
- Automated tests

## License
MIT
