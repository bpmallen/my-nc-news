const express = require("express");
const { getTopics, postTopics } = require("../controllers/topics.controller");

const topicsRouter = express.Router();
topicsRouter.route("/").get(getTopics).post(postTopics);

module.exports = topicsRouter;
