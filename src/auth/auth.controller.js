const { User, Volunteer, Coordinator } = require("../user/user.model.js");
const bcrypt = require("bcrypt");
const { issueToken } = require("../utils/issueToken");


exports.signUpCoordinator = async (req, res) => {
    const {
      username,
      email,
      password,
      phone,
      position,
    } = req.body;

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

      const newUser = new Coordinator({
        username,
        email,
        password: hashedPassword,
        phone,
        role: "Coordinator",
        position,
      });
    

    const savedUser = await newUser.save();
    const token = issueToken(savedUser);

    res
      .status(201)
      .json({ status: "success", data: { user: savedUser, token } });

  
  
};

exports.signUpVolunteer = async (req,res) => {
  const {
      username,
      email,
      password,
      phone,
      availability,
      speciality,
      hoursContributed,
    } = req.body;

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

      newUser = new Volunteer({
        username,
        email,
        password: hashedPassword,
        phone,
        role: "Volunteer",
        availability,
        speciality,
        hoursContributed: hoursContributed || 0,
      });

          const savedUser = await newUser.save();
    const token = issueToken(savedUser);

    res
      .status(201)
      .json({ status: "success", data: { user: savedUser, token } });


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

    // Configurar cookie con token
    res.cookie("token", token, { //la respuesta incluye una cuki, nombre de cucki, data de kuki
      httpOnly: true, //cuki tipo httpOnly
      secure: process.env.NODE_ENV === "production", //si secure == true, mandala solo si quien te lo pide es httpS, revisa si estoy en entorno de producción correcto
      sameSite: "Lax", //cuki solo se manda entre diferentes sitios (permite flujo de info entre fe y be)
      maxAge: 24 * 60 * 60 * 1000, //tiempo de vida maximo de kuki
    });

    // ✅ Importante: responder
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

