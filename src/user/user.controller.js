const { User } = require("./user.model");

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: "success", data: users });
};
// Obtener un usuario por ID
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ status: "success", data: user });
};

exports.getUsersByDay = async (req, res) => {
  try {
    const { day } = req.params;

    const users = await User.find({ availability: new RegExp(day, "i") });

    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    const updatedUser = await user.save();
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({ status: "success", message: "User deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
