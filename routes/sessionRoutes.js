const express = require("express");
const passport = require("passport");
const auth = require("../middleware/auth"); 

const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
} = require("../controllers/sessionController");


router.route("/register")
  .get(registerShow)
  .post(registerDo);


router.route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );


router.post("/logoff", auth, (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success_msg", "You have logged off successfully.");
    res.redirect("/");
  });
});

module.exports = router;