const cors = require("cors");
const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  postComment,
  patchVotesByArticleId,
  deleteCommentById,
  getUsers,
} = require("./controllers/articles.controller");
const {
  routeNotFoundErrors,
  handlePostgresErrors,
  handleCustomErrors,
} = require("./errors/errors");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", routeNotFoundErrors);
app.use(handlePostgresErrors);
app.use(handleCustomErrors);

module.exports = app;
