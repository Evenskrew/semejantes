const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      token =
        req.headers["authorization"]?.split(" ")[1] ||
        req.headers["x-access-token"] ||
        req.query.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({
          status: "fail",
          data: { message: "Unauthorized. No token provided." },
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    req.user = decoded;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "fail", data: { message: "Invalid or expired Token." } });
  }
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
