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

    const statusInicial = email === "admin@admin.com" ? "active" : "pending";

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone: phone ? String(phone) : null,
      role: "Coordinator",
      status: statusInicial,
      position,
    });

    let token = null;
    if (statusInicial === "active") {
      token = issueToken(savedUser);
    }

    res.status(201).json({
      status: "success",
      message:
        statusInicial === "active"
          ? "Admin maestro creado y activo."
          : "Registro recibido. Pendiente de aprobación.",
      data: { user: savedUser, token },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.signUpVolunteer = async (req, res) => {
  try {
    const { username, email, password, phone, availability, speciality } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone: phone ? String(phone) : null,
      role: "Volunteer",
      status: "pending",
      availability,
      speciality,
    });

    res.status(201).json({
      status: "success",
      message: "Registro recibido. Pendiente de aprobación.",
      data: { id: savedUser.id },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Credenciales incorrectas" });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        status: "fail",
        message: "Tu cuenta aún no ha sido aprobada o fue rechazada.",
      });
    }

    const token = issueToken(user);
    res.status(200).json({
      status: "success",
      token,
      user: { id: user.id, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
