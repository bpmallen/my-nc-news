const {
  updateCommentById,
  removeCommentById,
} = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    return res.status(400).send({ msg: "Bad request" });
  }
  updateCommentById(comment_id, inc_votes)
    .then((updatedComment) => {
      res.status(200).send({ comment: updatedComment });
    })
    .catch(next);
};
