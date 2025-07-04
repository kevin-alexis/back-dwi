import {Router} from 'express';
import {actualizarLead, obtenerLeads} from "../controllers/leads/leads.js"
import { verificarToken } from '../middleware/autenticacion.js';
const router = Router()

router.get('/api/leads', verificarToken, obtenerLeads);
router.patch('/api/leads', verificarToken, actualizarLead);

export default router