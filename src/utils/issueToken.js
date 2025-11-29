const jwt = require("jsonwebtoken");

const issueToken = (user) => {
  const _id = user.id;
  const expiresIn = "2d";

  const payload = {
    sub: _id,
    id: _id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: expiresIn,
  });
};

module.exports = { issueToken };
