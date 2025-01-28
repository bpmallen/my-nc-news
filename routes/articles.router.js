const express = require("express");

const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  postComment,
  patchVotesByArticleId,
  deleteCommentById,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", patchVotesByArticleId);

module.exports = articlesRouter;
