const jwt = require("jsonwebtoken");
const secret = process.env.jwt_key;

// checks for a valid token
module.exports = function (ctx, next) {
  //get the token from the header if present
  const token =
    ctx.request.headers["x-access-token"] ||
    ctx.request.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token)
    return (ctx.status = 401), (ctx.body = "Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, secret);
    ctx.request.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    (ctx.status = 401), (ctx.body = "Access denied. Invalid Token.");
  }
};
