const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleExists,
  addComment,
  alterVotesByArticleId,

  addArticle,
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
  const { limit = 10, page = 1, ...query } = req.query;
  selectAllArticles(query, limit, page)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })

    .catch((err) => {
      next(err);
    });
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit = 10, page = 1, ...query } = req.query;
  Promise.all([
    checkArticleExists(article_id),
    selectArticleComments(article_id, limit, page),
  ])
    .then(([, comments]) => {
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
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes) {
    return res.status(400).send({ msg: "Bad request" });
  }
  alterVotesByArticleId(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Bad request" });
  }

  addArticle({ author, title, body, topic, article_img_url })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
