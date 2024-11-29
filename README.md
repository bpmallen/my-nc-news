# Northcoders News API

To run this project locally, please create the following environment files and add the corresponding variables to connect to the databases.

1. Create ".env.development" file and add "PGDATABASE=nc_news" variable

2. Create ".env.test" file and add "PGDATABASE=nc_news_test" variable

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

Northcoders News API

- Hosted Project Link: https://my-nc-news-yyln.onrender.com/api

---

Project Summary

This project is a backend application built with Node.js, Express, and PostgreSQL. It provides endpoints to manage articles, users, topics, and comments. Users can sort, filter, and interact with the data. It serves as the backend for potential frontend applications.

---

Clone the Repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install the follwing to run the project locally

- Node.js: Minimum version 16.0.0
- PostgreSQL: Minimum version 12.0

Run the following command to install all necessary dependencies:

npm install

---

Setting Up the Environment

This project requires two .env files for development and test environments.

1.  Create .env.development and add the following: PGDATABASE=nc_news

2.  Create .env.test and add the following: PGDATABASE=nc_news_test

---

Seeding the Local Database

To set up the database with the initial data, run:

- npm run setup-dbs
- npm run seed

---

Running Tests

To run the test suite, use:

- npm test

---

Starting the Server

To start the development server, use:

- npm start
