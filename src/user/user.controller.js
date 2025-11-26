const { User } = require("./user.model");
const { Op } = require("sequelize");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: "success", data: users });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getUsersByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const users = await User.findAll({
      where: {
        availability: {
          [Op.iLike]: `%${day}%`,
        },
      },
    });
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const [updatedRows] = await User.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found or no changes made" });
    }

    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedRows = await User.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({ status: "success", message: "User deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
