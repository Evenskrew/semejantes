require("dotenv").config({ quiet: true });

const express = require("express");
const connectMongoDB = require("./config/mongo-db");
const { connectSQL } = require("./config/sql-db"); // Importar conexión SQL
const authRouter = require("./src/auth/auth.route");
const usersRouter = require("./src/user/user.route");
const eventsRouter = require("./src/event/event.route");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// Conectar ambas bases de datos
if (process.env.NODE_ENV !== "test") {
  connectMongoDB();
  connectSQL();
}

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/events", eventsRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Híbrido (SQL + NoSQL) funcionando :D",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
  });
});

module.exports = app;
