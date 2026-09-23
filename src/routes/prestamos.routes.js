import { Router } from "express"
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js"
import { pedirPrestado, devolverLibro, verTodosPrestamos, verMisPrestamos } from "../controllers/prestamos.controller.js"

const router = Router()

router.post("/", verificarToken, pedirPrestado)
router.put("/:id/devolver", verificarToken, devolverLibro)
router.get("/", verificarToken, soloAdmin, verTodosPrestamos)
router.get("/mis-prestamos", verificarToken, verMisPrestamos)

export default router