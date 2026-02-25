require("dotenv").config();
require("express-async-errors");

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");

const MongoDBStore = require("connect-mongodb-session")(session);

const connectDB = require("./db/connect");
const passportInit = require("./passport/passportInit");

const app = express();

//data
connectDB(process.env.MONGO_URI);

//session
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


//passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());


//flash
app.use(flash());


//parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(require("./middleware/storeLocals"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");

app.use("/secretWord", auth, secretWordRouter);


app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
