import {Router} from 'express';
import {actualizarLead, obtenerLeads} from "../controllers/leads/leads.js"
const router = Router()

router.get('/api/leads', obtenerLeads);
router.patch('/api/leads', actualizarLead);

export default router