const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  let token = req.cookies?.token;
  console.log(token);

  if (!token) {
    token =
      req.headers["authorization"]?.split(" ")[1] ||
      req.headers["x-access-token"] ||
      req.query.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", data: { message: "Unauthorized." } });
  }

  console.log(token);
  next();
};

const authRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ status: "fail", data: { message: "Not allowed." } });
    }

    next();
  };
};

module.exports = {
  authUser,
  authRole,
};
