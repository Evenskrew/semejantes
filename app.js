require("dotenv").config({ quiet: true });

const express = require("express");
const connectMongoDB = require("./config/mongo-db");
const authRouter = require("./src/auth/auth.route");
const usersRouter = require("./src/user/user.route");
const eventsRouter = require("./src/event/event.route");

const app = express();
const PORT = process.env.PORT || 3000;

connectMongoDB();
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/events", eventsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Mi primera backend :D",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
