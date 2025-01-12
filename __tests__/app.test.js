const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
/* Set up your test imports here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each of which should have the following properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  describe("Route not found", () => {
    test("404: request to a non-existent route", () => {
      return request(app)
        .get("/api/i_dont_exist")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an individual article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: article id is not a number", () => {
    return request(app)
      .get("/api/articles/cheesesandwich")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: article id does not exist", () => {
    return request(app)
      .get("/api/articles/777")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles, sorted by date in descending order and containing a comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments, sorted by date in descending order and containing a comment_count property", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with an empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("404: article id does not exist", () => {
    return request(app)
      .get("/api/articles/777/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: article id is not a number", () => {
    return request(app)
      .get("/api/articles/cheesesandwich")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with a newly created comment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I saved a life. My own. Am I a hero? I really can’t say, but yes.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "I saved a life. My own. Am I a hero? I really can’t say, but yes.",
            article_id: 1,
            author: "butter_bridge",
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("404: Responds `username not found` if username does not exist", () => {
    const newComment = {
      username: "non_existent_user",
      body: "I dont exist, but I wont't give up ",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
  test("400: Responds `Bad request` if username is missing", () => {
    const newComment = {
      body: "I dont exist, but I wont't give up ",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article when votes have been incremented", () => {
    const addVotes = { inc_votes: 777 };
    return request(app)
      .patch("/api/articles/1")
      .send(addVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 877,
          })
        );
      });
  });
  test("200: Responds with the updated article when votes are decremented", () => {
    const update = { inc_votes: -77 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(23);
      });
  });
  test("400: Responds with an error when inc_votes is invalid", () => {
    const update = { inc_votes: "I_am_invalid" };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an error when article_id does not exist", () => {
    const addVotes = { inc_votes: 777 };
    return request(app)
      .patch("/api/articles/777")
      .send(addVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes comment and responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: Responds with an error when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/777")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("400: Responds with an error when comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/cheeseSandwich")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with an error for invalid route", () => {
    return request(app)
      .get("/api/you_can't_go_this_way")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/articles(sorting queries)", () => {
  test("200: Responds with articles sorted by a valid `sort_by` parameter", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=created_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Filters articles by author", () => {
    return request(app)
      .get("/api/articles?author=butter_bridge")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article.author).toBe("butter_bridge");
        });
      });
  });
  test("200: Responds with an empty array if author does not exist", () => {
    return request(app)
      .get("/api/articles?author=author_never_existed")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("200: Filters articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: Responds with an empty array if topic exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toEqual([]);
        expect(articles).toHaveLength(0);
      });
  });
  test("400: Responds with an error for invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: Responds with an error for invalid order query", () => {
    return request(app)
      .get("/api/articles?order=invalid_query")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid order query");
      });
  });
  test("404: Responds with an error when topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=invalid_topic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: Responds with an article that has a commment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count");
        expect(article.comment_count).toBeGreaterThanOrEqual(0);
        expect(article.article_id).toBe(1);
      });
  });
});
