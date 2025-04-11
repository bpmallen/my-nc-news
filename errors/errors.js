exports.routeNotFoundErrors = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.handlePostgresErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503" && err.constraint === "articles_author_fkey") {
    res.status(404).send({ msg: "Username not found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
