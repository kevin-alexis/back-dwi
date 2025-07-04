import {Router} from 'express';
import {iniciarSesion, crearUsuario, logout} from "../controllers/cuenta/cuenta.js"
const router = Router()

router.post('/api/iniciar-sesion', iniciarSesion);
router.get('/api/crear-usuario', crearUsuario)
router.post('/api/logout', logout)

export default router
