import express from 'express';
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.send('Hola mundo!');
});

export default router;