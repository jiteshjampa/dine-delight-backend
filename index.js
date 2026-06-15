const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const allowedOrigins = [
  "https://dine-delight.vercel.app",
  "https://dine-delight-git-main-jitesh-reddys-projects.vercel.app",
  "http://localhost:5173",
  "http://://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.get("/", (req, res) => {
  res.send("Food App Backend Running");
});

app.use("/api", require("./routes/register"));
app.use("/api", require("./routes/login"));
app.use("/api", require("./routes/logout"));
app.use("/api", require("./routes/check"));
app.use("/api", require("./routes/cart"));
app.use("/api", require("./routes/order"));

module.exports = app;
