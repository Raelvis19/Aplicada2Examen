import { prisma } from "../db.js"

export const listarLibros = async (req, res) => {
  try {
    const libros = await prisma.libro.findMany()
    res.json(libros)
  } catch (error) {
    res.status(500).json({ error: "error al listar libros" })
  }
}

export const agregarLibro = async (req, res) => {
  try {
    const { titulo, autor } = req.body

    if (!titulo || !autor) {
      return res.status(400).json({ error: "titulo y autor son requeridos" })
    }

    const libro = await prisma.libro.create({
      data: { titulo, autor }
    })

    res.status(201).json(libro)
  } catch (error) {
    res.status(500).json({ error: "error al agregar libro" })
  }
}

export const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params

    const libro = await prisma.libro.findUnique({ where: { id: parseInt(id) } })
    if (!libro) {
      return res.status(404).json({ error: "libro no encontrado" })
    }

    await prisma.libro.delete({ where: { id: parseInt(id) } })
    res.json({ mensaje: "libro eliminado" })
  } catch (error) {
    res.status(404).json({ error: "error al eliminar libro" })
  }
}