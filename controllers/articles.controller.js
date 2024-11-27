const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  addComment,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })

    .catch(next);
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })

    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Bad request" });
  }
  addComment({ username, body }, article_id)
    .then((createdComment) => {
      res.status(201).send({ comment: createdComment });
    })
    .catch(next);
};
