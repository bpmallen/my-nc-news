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

exports.selectAllArticles = () => {
  const query = `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;

  return db.query(query).then(({ rows }) => {
    return rows;
  });
};
