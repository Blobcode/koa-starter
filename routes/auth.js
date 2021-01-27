const Router = require("@koa/router");
const router = new Router();

// utils
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

// jwt secret
const secret = process.env.jwt_key;

// user model
const User = require("../models/User");

//? This is replied when the username/password is wrong
const wrongUserPassMsg = "Incorrect username and/or password.";

// signup route
router.post("/signup", async (ctx, next) => {
  if (!ctx.request.body.username || !ctx.request.body.password) {
    ctx.status = 400;
    ctx.body = {
      error:
        "expected an object with username, password, email, name but got: " +
        ctx.request.body,
    };
  }

  // get user
  const user = await User.query().findOne(
    "username",
    ctx.request.body.username
  );
  console.log(user);

  if (!user) {
    // hash password
    ctx.request.body.password = await bcrypt.hash(
      ctx.request.body.password,
      12
    );

    await User.query().insert({
      id: nanoid(8),
      username: ctx.request.body.username,
      password: ctx.request.body.password,
    });
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign(
        {
          id: user.id,
          name: user.username,
        },
        secret
      ),
    };
  } else {
    ctx.status = 406;
    ctx.body = {
      error: "User exists",
    };
  }
});

// signin route
router.post("/signin", async (ctx, next) => {
  let user = await User.query().findOne("username", ctx.request.body.username);
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      error: wrongUserPassMsg,
    };
  }
  // hash & compare passwords
  if (await bcrypt.compare(ctx.request.body.password, user.password)) {
    ctx.body = {
      token: jwt.sign(
        {
          id: user.id,
          name: user.username,
        },
        secret
      ),
    };
  } else {
    // if user's password is wrong
    ctx.status = 401;
    ctx.body = {
      error: wrongUserPassMsg,
    };
  }
});

// export router
module.exports = router;
