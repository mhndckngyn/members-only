export function authUser(req, res, next) {
  if (!req.user) {
    return res.render("unauthorized");
  }

  next();
}
