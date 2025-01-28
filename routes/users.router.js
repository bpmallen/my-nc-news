const express = require("express");
const {
  getUsers,
  getUsersByUsername,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUsersByUsername);

module.exports = usersRouter;
