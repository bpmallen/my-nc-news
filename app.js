const cors = require("cors");
const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { deleteCommentById } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const articlesRouter = require("./routes/articles.router");
const topicsRouter = require("./routes/topics.router");
const usersRouter = require("./routes/users.router");
const commentsRouter = require("./routes/comments.router");

const {
  routeNotFoundErrors,
  handlePostgresErrors,
  handleCustomErrors,
} = require("./errors/errors");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.use("/api/articles", articlesRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.all("*", routeNotFoundErrors);
app.use(handlePostgresErrors);
app.use(handleCustomErrors);

module.exports = app;
