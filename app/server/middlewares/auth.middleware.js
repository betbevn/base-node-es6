import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "secretkeyappearshere", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
