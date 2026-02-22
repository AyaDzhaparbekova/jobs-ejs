require("dotenv").config();
const express = require("express");
require("express-async-errors");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


// ROUTES
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  res.render("secretWord", {
    secretWord: req.session.secretWord,
    title: "Secret Word Page"
  
  });
});


app.post("/secretWord", (req, res) => {
  req.session.secretWord = req.body.secretWord; 
  res.redirect("/secretWord");
});

// 404
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
