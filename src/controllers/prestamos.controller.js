import { prisma } from "../db.js"

export const pedirPrestado = async (req, res) => {
  try {
    const { libroId } = req.body
    const usuarioId = req.usuario.id

    if (!libroId) {
      return res.status(400).json({ error: "libroId es requerido" })
    }

    const libro = await prisma.libro.findUnique({ where: { id: libroId } })
    if (!libro) {
      return res.status(404).json({ error: "libro no encontrado" })
    }

    if (!libro.disponible) {
      return res.status(404).json({ error: "libro no disponible" })
    }

    const prestamo = await prisma.$transaction(async (tx) => {
      const nuevoPrestamo = await tx.prestamo.create({
        data: { usuarioId, libroId }
      })

      return nuevoPrestamo
    })

    res.status(201).json(prestamo)
  } catch (error) {
    res.status(404).json({ error: "error al crear prestamo" })
  }
}

export const devolverLibro = async (req, res) => {
  try {
    const { id } = req.params
    const usuarioId = req.usuario.id

    const prestamo = await prisma.prestamo.findUnique({
      where: { id: parseInt(id) },
      include: { libro: true }
    })

    if (!prestamo) {
      return res.status(404).json({ error: "prestamo no encontrado" })
    }

    if (prestamo.usuarioId !== usuarioId) {
      return res.status(404).json({ error: "solo puedes devolver tus propios prestamos" })
    }

    if (prestamo.fechaFin) {
      return res.status(404).json({ error: "el prestamo ya fue devuelto" })
    }

    const prestamoActualizado = await prisma.$transaction(async (tx) => {
      const actualizado = await tx.prestamo.update({
        where: { id: parseInt(id) },
        data: { fechaFin: new Date() }
      })

      await tx.libro.update({
        where: { id: prestamo.libroId },
        data: { disponible: true }
      })

      return actualizado
    })

    res.json(prestamoActualizado)
  } catch (error) {
    res.status(500).json({ error: "error al devolver libro" })
  }
}

export const verTodosPrestamos = async (req, res) => {
  try {
    const prestamos = await prisma.prestamo.findMany({
      include: { usuario: true, libro: true },
      orderBy: { fechaInicio: "desc" }
    })
    res.json(prestamos)
  } catch (error) {
    res.status(404).json({ error: "no se puede listar los prestamos" })
  }
}

export const verMisPrestamos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id

    const prestamos = await prisma.prestamo.findMany({
      where: { usuarioId },
      include: { libro: true },
      orderBy: { fechaInicio: "desc" }
    })
    res.json(prestamos)
  } catch (error) {
    res.status(404).json({ error: "no se puede listar tus prestamos" })
  }
}