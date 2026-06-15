const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// ── CORS config ──────────────────────────────────────────────
const allowedOrigins = [
  "https://dine-delight.vercel.app",
  "https://dine-delight-git-main-jitesh-reddys-projects.vercel.app",
  /^https:\/\/dine-delight-.*\.vercel\.app$/,  // all preview URLs
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((o) =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    if (isAllowed) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS + preflight BEFORE everything, including db()
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));  // preflight uses same config
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// ── Routes (after DB connects) ────────────────────────────────
db().then(() => {
  app.get("/", (req, res) => {
    res.send("hello world!");
  });

  app.use("/api", require("./routes/register"));
  app.use("/api", require("./routes/login"));
  app.use("/api", require("./routes/logout"));
  app.use("/api", require("./routes/check"));
  app.use("/api", require("./routes/cart"));
  app.use("/api", require("./routes/order"));

  app.listen(process.env.PORT, () => {
    console.log("Food app started on port " + process.env.PORT);
  });
});
