const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sql-db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { len: [3, 32] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Volunteer", "Coordinator"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    speciality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hoursContributed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { User, Volunteer: User, Coordinator: User };
