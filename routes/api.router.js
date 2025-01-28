const express = require("express");
const { getApi } = require("../controllers/api.controller");

const apiRouter = express.Router();

apiRouter.get("/", getApi);
