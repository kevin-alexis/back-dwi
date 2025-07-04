
import {Router} from 'express';
import {iniciarSesion, recuperarCuenta,iniciarSesionGoogle, cambiarContraseña} from "../controllers/cuenta/cuenta.js"
const router = Router()

router.post('/iniciar-sesion', iniciarSesion);
router.post('/iniciar-sesion-google', iniciarSesionGoogle);
router.post('/recuperar-cuenta', recuperarCuenta);
router.patch('/cambiar-password', cambiarContraseña);

export default router
