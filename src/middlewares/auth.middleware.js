import jwt from "jsonwebtoken"

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) return res.status(401).json({ error: "token requerido" })

  const token = authHeader.split(" ")[1]
  if (!token) return res.status(401).json({ error: "token requerido" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch {
    res.status(401).json({ error: "token invalido" })
  }
}

export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "acceso denegado" })
  }
  next()
}