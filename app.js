const express = require("express");

const app = express();

const getApi = require("./controllers/api.controller");

app.get("/api", getApi);

module.exports = app;
