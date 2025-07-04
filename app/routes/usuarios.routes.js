import {Router} from 'express';
import {actualizarUsuario, agregarUsuario, agregarUsuarioGoogle, eliminarUsuario, obtenerUsuarios, obtenerCantidadUsuarios, obtenerCantidadUsuariosGoogle} from "../Controllers/usuarios/usuarios.js"
const router = Router()

router.post('/usuarios', agregarUsuario);
router.post('/usuarios-google', agregarUsuarioGoogle);
router.get('/usuarios', obtenerUsuarios);
router.put('/usuarios', actualizarUsuario);
router.delete('/usuarios', eliminarUsuario);
router.get('/cantidad-usuarios', obtenerCantidadUsuarios);
router.get('/cantidad-usuarios-google', obtenerCantidadUsuariosGoogle);

export default router