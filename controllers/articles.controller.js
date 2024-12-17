const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleExists,
  addComment,
  alterVotesByArticleId,
  removeCommentById,
  selectAllUsers,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  console.log("Valur of inc_votes", inc_votes);
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
  Promise.all([
    checkArticleExists(article_id),
    selectArticleComments(article_id),
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
    .catch(next);
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
