import { Router } from "express"
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js"
import { listarLibros, agregarLibro, eliminarLibro } from "../controllers/libros.controller.js"

const router = Router()

router.get("/", verificarToken, listarLibros)
router.post("/", verificarToken, soloAdmin, agregarLibro)
router.delete("/:id", verificarToken, soloAdmin, eliminarLibro)

export default router