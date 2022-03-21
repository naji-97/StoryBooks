const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOveride = require('method-override')
dotenv.config({ path: "./config/config.env" });

const moment = require("moment");

require("./config/passport")(passport);

const PORT = process.env.PORT || 5000;

connectDB();
const app = express();

// Body-Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// Set static folder
app.use(express.static(path.join(__dirname, "public")));


// Set Templating Engine
app.use(expressLayouts);
app.set("view engine", "ejs");
// app.use()

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.moment = moment;

  next();
});
// Helpers

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(
  process.env.PORT,
  console.log(`App run in ${process.env.NODE_ENV}  mode on ${PORT}`)
);
