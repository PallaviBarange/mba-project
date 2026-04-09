exports.isUserAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/user/login");
};
