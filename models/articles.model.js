const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;
  const idValue = [article_id];
  return db.query(query, idValue).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};
