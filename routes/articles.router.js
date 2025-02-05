const express = require("express");

const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  postComment,
  patchVotesByArticleId,
  postArticle,
  deleteArticleByArticleId,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId)
  .delete(deleteArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter;
