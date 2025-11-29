const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/semejantes_db",
  {
    dialect: "postgres",
    logging: false,

    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a SQL (PostgreSQL) correctamente.");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Error conectando a SQL:", error);
  }
};

module.exports = { sequelize, connectSQL };
