// .env
require("dotenv").config();

// Koa
const Koa = require("koa");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const routes = require("./routes");

// ObjectionJS
const Knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection");

// Initialize knex
const knex = Knex(knexConfig[process.env.enviroment]);

// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(knex);

const app = new Koa();
app.use(logger());
app.use(bodyParser());

// init routes, listen
app.use(routes.routes()).use(routes.allowedMethods());
app.listen(3000);
