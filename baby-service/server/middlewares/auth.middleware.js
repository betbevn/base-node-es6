export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  console.info("User not authenticated");
  return res.redirect("/api/baby/login");
}
