exports.routeNotFoundErrors = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
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
    console.log("im in the handleCustomErrors code block");
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
