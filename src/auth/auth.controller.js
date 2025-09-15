const { User, Volunteer, Coordinator } = require("../user/user.model.js");
const bcrypt = require("bcrypt");
const { issueToken } = require("../utils/issueToken");

exports.signUp = async (req, res) => {
  const { username, email, phone, availability } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res
      .status(400)
      .json({ status: "fail", data: { username: "Username already exists." } });

  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res
      .status(400)
      .json({ status: "fail", data: { username: "Email already exists." } });

  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) return next(err);

    newUser = new Volunteer({
      username,
      email,
      password: hashedPassword,
      phone,
      availability,
    });

    const savedUser = await newUser.save();
    const token = issueToken(savedUser);

    res.status(201).json({ status: "success", data: { user: newUser, token } });
  });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(401).json({
      status: "fail",
      data: { message: "Invalid email or password." },
    });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(401).json({
      status: "fail",
      data: { message: "Invalid email or password" },
    });

  const token = issueToken(user);
  res.status(200).json({ status: "success", data: { user, token } });
};
