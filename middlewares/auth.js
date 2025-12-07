import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Token ausente");

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).send("Token inválido");
  }
}

export function adminOnly(req, res, next) {
  if (req.user.level !== 1) {
    return res.status(403).send("Acesso negado: apenas administradores");
  }
  next();
}
