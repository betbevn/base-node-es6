import jwt from "jsonwebtoken";

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.info("User not authenticated");
  return res.redirect("/api/baby/login");
}
