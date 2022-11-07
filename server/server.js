const path = require("path");
const express = require("express");
const playlistsRouter = require("./routes/playlists");
const cors = require("cors");

const app = express();
const PORT = 5020;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: '*' }));

// afficher chaque nouvelle requête dans la console
app.use((request, response, next) => {
  console.log(`New HTTP request: ${request.method} ${request.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

// TODO : Rajouter les routeurs sur les bon prefixes
app.use("/api/playlists", playlistsRouter.router);

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = server;
