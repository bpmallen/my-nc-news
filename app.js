const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
} = require("./controllers/articles.controller");
const {
  routeNotFoundErrors,
  handlePostgresErrors,
  handleCustomErrors,
} = require("./errors/errors");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.all("*", routeNotFoundErrors);
app.use(handlePostgresErrors);
app.use(handleCustomErrors);

module.exports = app;
