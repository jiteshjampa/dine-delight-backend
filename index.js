const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
db().then(() => {
  app.use(cookieParser());
  app.use(cors({ origin: ["https://dine-delight.vercel.app","http://localhost:5173"], credentials: true }));
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.get('/',(req,res)=>{
    res.send('hello world!');
  })
  app.use("/api", require("./routes/register"));
  app.use("/api", require("./routes/login"));
  app.use("/api", require("./routes/logout"));
  app.use("/api", require("./routes/check"));
  app.use("/api", require("./routes/cart"));
  app.use("/api", require("./routes/order"));
  app.listen(process.env.PORT, () => {
    console.log("Food app started");
  });
});
