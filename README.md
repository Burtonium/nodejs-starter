# nodejs-starter
Base project for learning about NodeJS

## Installation

Install dependencies

```shell
npm install
```

Fill out the .env.test file with your testing environment variables.
Create a copy of .env.test as .env. Fill out the environment variables for your
development setup.

```shell
cp .env.test .env
```

After installing postgresql on the machine, then migrate the database to the latest version

```shell
knex migrate:latest
```

Run your app

```shell
npm start
```
