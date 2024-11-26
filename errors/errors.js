exports.routeNotFoundErrors = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.handlePostgresErrors = (err, req, res, next) => {
  // postgres errors
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  // custom errors
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
};
