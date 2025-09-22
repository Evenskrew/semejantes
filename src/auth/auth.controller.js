const { User, Volunteer, Coordinator } = require("../user/user.model.js");
const bcrypt = require("bcrypt");
const { issueToken } = require("../utils/issueToken");

exports.signUp = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      role,
      availability,
      speciality,
      hoursContributed,
      position,
    } = req.body;

    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ status: "fail", message: "Required fields are missing" });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({
        status: "fail",
        data: { username: "Username already exists." },
      });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ status: "fail", data: { email: "Email already exists." } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === "Volunteer") {
      if (!availability || !speciality) {
        return res
          .status(400)
          .json({ status: "fail", message: "Volunteer fields are missing" });
      }

      newUser = new Volunteer({
        username,
        email,
        password: hashedPassword,
        phone,
        role,
        availability,
        speciality,
        hoursContributed: hoursContributed || 0,
      });
    } else if (role === "Coordinator") {
      if (!position) {
        return res
          .status(400)
          .json({ status: "fail", message: "Coordinator fields are missing" });
      }

      newUser = new Coordinator({
        username,
        email,
        password: hashedPassword,
        phone,
        role,
        position,
      });
    } else {
      return res.status(400).json({ status: "fail", message: "Invalid role" });
    }

    const savedUser = await newUser.save();
    const token = issueToken(savedUser);

    res
      .status(201)
      .json({ status: "success", data: { user: savedUser, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Login de usuario
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Require Email and password" });
    }

    const user = await User.findOne({ email });
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
    res.status(200).json({ status: "success", data: { user, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
