const Router = require("@koa/router");
const router = new Router();
const auth = require("../middleware/authenticated");

router.get("/", (ctx, next) => {
  ctx.body = "user route";
});

// export router
module.exports = router;
