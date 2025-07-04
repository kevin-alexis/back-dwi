import jwt from 'jsonwebtoken'

export const verificarSesion = (req, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ autenticado: false, usuario: null })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return res.status(200).json({
      autenticado: true,
      usuario: decoded // { id, correoElectronico }
    })
  } catch (error) {
    return res.status(401).json({ autenticado: false, usuario: null })
  }
}
