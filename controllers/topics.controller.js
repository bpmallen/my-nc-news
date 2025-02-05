const { getAllTopics, addTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopics = (req, res, next) => {
  const { slug, description } = req.body;

  if (!slug || !description) {
    return res.status(400).send({ msg: "Bad request" });
  }
  addTopic({ slug, description })
    .then((createdTopic) => {
      res.status(201).send({ topic: createdTopic });
    })
    .catch((err) => {
      next(err);
    });
};
