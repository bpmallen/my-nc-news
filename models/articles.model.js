const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  console.log("im here");
  const query = `
  SELECT articles.*,
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;
  const idValue = [article_id];
  return db.query(query, idValue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article Not found" });
    }
    return rows[0];
  });
};

exports.selectAllArticles = (query) => {
  const { author, topic, sort_by = "created_at", order = "DESC" } = query;

  const validColumns = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validColumns.includes(sort_by)) {
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
      queryString += ` WHERE articles.topic = $1`;
    }
  }
  queryString += ` 
  GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (!rows.length && topic) {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
        .then(({ rows: topicRows }) => {
          if (!topicRows.length) {
            return Promise.reject({ status: 404, msg: "Topic not found" });
          }
          return [];
        });
    }
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not found" });
      }
    });
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author,body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
      [article_id]
    )
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

exports.alterVotesByArticleId = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
