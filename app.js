require("dotenv").config({ quiet: true });

const express = require("express");
const connectMongoDB = require("./config/mongo-db");
const { connectSQL } = require("./config/sql-db");
const authRouter = require("./src/auth/auth.route");
const usersRouter = require("./src/user/user.route");
const eventsRouter = require("./src/event/event.route");
const requestsRouter = require("./src/request/request.route");
const donationsRouter = require("./src/donation/donation.route");
const reportsRouter = require("./src/report/report.route");

const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

if (process.env.NODE_ENV !== "test") {
  connectMongoDB();
  connectSQL();
}

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/donations", donationsRouter);
app.use("/api/reports", reportsRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Semejantes API completa funcionando (SQL + NoSQL)",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
  });
});

module.exports = app;
