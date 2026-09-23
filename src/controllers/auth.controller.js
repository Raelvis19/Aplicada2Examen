import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../db.js"

export const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    const existe = await prisma.usuario.findUnique({ 
      where: { email } 
    })
    if (existe) {
      return res.status(400).json({ error: "email ya registrado" })
    }

    const hash = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuario.create({
      data: { 
        nombre, 
        email, 
        password: hash 
      }
    })

    const token = jwt.sign(
      { id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.status(201).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } })
  } catch (error) {
    console.error("Error registro:", error)
    res.status(500).json({ error: "error al registrar usuario", details: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ error: "credenciales invalidas" })
    }

    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido) {
      return res.status(401).json({ error: "credenciales invalidas" })
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } })
  } catch (error) {
    res.status(500).json({ error: "error al iniciar sesion" })
  }
}