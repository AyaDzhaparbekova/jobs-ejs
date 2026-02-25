const User = require("../models/User");
const parseVErr = require("../util/parseValidationErr");

const registerShow = (req, res) => {
  res.render("register", { title: "Register" });
};

const registerDo = async (req, res, next) => {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { title: "Register" });
  }

  try {
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }

    return res.render("register", { title: "Register" });
  }

  res.redirect("/");
};

const logonShow = (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("logon", { title: "Logon" });
};

const logoff = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};