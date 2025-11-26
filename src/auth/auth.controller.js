const { User } = require("../user/user.model.js");
const bcrypt = require("bcrypt");
const { issueToken } = require("../utils/issueToken");

exports.signUpCoordinator = async (req, res) => {
  const { username, email, password, phone, position } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone: phone ? String(phone) : null,
      role: "Coordinator",
      position,
    });

    const token = issueToken(savedUser);
    res
      .status(201)
      .json({ status: "success", data: { user: savedUser, token } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.signUpVolunteer = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    availability,
    speciality,
    hoursContributed,
  } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone: phone ? String(phone) : null,
      role: "Volunteer",
      availability,
      speciality,
      hoursContributed: hoursContributed || 0,
    });

    const token = issueToken(savedUser);
    res
      .status(201)
      .json({ status: "success", data: { user: savedUser, token } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Require Email and password" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email or password incorrect" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });
    }

    const token = issueToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};
