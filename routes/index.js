const Router = require("@koa/router");
const router = new Router();

// auth middleware
const auth = require("../middleware/authenticated");

// import other routes
const authRoute = require("./auth");
const userRoute = require("./user");

// routes

//? ping-pong route
router.get("/ping", async (ctx, next) => {
  ctx.body = "pong";
});

//? example route with auth required
router.get("/locked", auth, (ctx, next) => {
  ctx.body = "authenticated";
});

router.use("/auth", authRoute.routes());
router.use("/user", userRoute.routes());

module.exports = router;
