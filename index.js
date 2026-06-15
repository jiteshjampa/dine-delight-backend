const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// CORS Configuration
const allowedOrigins = [
  "https://dine-delight.vercel.app",
  "https://dine-delight-git-main-jitesh-reddys-projects.vercel.app",
  /^https:\/\/dine-delight-.*\.vercel\.app$/,
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman, curl, server-to-server requests
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      }
      return allowedOrigin.test(origin);
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect DB and Register Routes
db()
  .then(() => {
    console.log("Database connected");

    app.get("/", (req, res) => {
      res.send("Food App Backend Running");
    });

    app.use("/api", require("./routes/register"));
    app.use("/api", require("./routes/login"));
    app.use("/api", require("./routes/logout"));
    app.use("/api", require("./routes/check"));
    app.use("/api", require("./routes/cart"));
    app.use("/api", require("./routes/order"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// For Vercel
module.exports = app;const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// CORS Configuration
const allowedOrigins = [
  "https://dine-delight.vercel.app",
  "https://dine-delight-git-main-jitesh-reddys-projects.vercel.app",
  /^https:\/\/dine-delight-.*\.vercel\.app$/,
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman, curl, server-to-server requests
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      }
      return allowedOrigin.test(origin);
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect DB and Register Routes
db()
  .then(() => {
    console.log("Database connected");

    app.get("/", (req, res) => {
      res.send("Food App Backend Running");
    });

    app.use("/api", require("./routes/register"));
    app.use("/api", require("./routes/login"));
    app.use("/api", require("./routes/logout"));
    app.use("/api", require("./routes/check"));
    app.use("/api", require("./routes/cart"));
    app.use("/api", require("./routes/order"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// For Vercel
module.exports = app;
