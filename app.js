require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const xss = require("xss-clean");

const connectDB = require("./db/connect");
const passportInit = require("./passport/passportInit");
const auth = require("./middleware/auth");

const jobsRouter = require("./routes/jobs");
const secretWordRouter = require("./routes/secretWord");
const sessionRoutes = require("./routes/sessionRoutes");

connectDB(process.env.MONGO_URI);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.use(helmet());
app.use(xss());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);


app.use(cookieParser(process.env.SESSION_SECRET));

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);


passportInit();
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use(csurf({ cookie: true }));


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken();
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.info = req.flash("info");
  next();
});


app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});


app.use("/sessions", sessionRoutes);
app.use("/secretWord", auth, secretWordRouter);
app.use("/jobs", auth, jobsRouter);


app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});


app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).send("Invalid CSRF token");
  } else {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));