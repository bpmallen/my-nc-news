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

exports.selectAllArticles = (query) => {
  const { author, topic, sort_by = "created_at", order = "DESC" } = query;

  const validSortBys = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const validOrderQueries = ["ASC", "DESC"];

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryValues = [];
  let queryString = `
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
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (author) {
    queryValues.push(author);
    queryString += ` WHERE articles.author = $${queryValues.length}`;
  }
  if (topic) {
    queryValues.push(topic);
    if (queryValues.length > 1) {
      queryString += ` AND articles.topic = $${queryValues.length}`;
    } else {
      queryString += ` WHERE articles.topic = $${queryValues.length}`;
    }
  }
  queryString += ` 
  GROUP BY articles.article_id 
  ORDER BY articles.created_at DESC;`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return db.query(
        `SELECT comment_id, votes, created_at, author,body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (newComment, article_id) => {
  const { username, body } = newComment;

  return db
    .query(
      `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({ status: 404, msg: "Username not found" });
      }
    });
};
