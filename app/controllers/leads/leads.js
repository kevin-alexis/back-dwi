import pool from "../../config/MySQL/database.js";

export const obtenerLeads = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT * FROM contactos`);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ mensaje: "Leads no existentes" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
  }
};

export const actualizarLead = async (req, res) => {
  try {
    const { idLead, estatus } = req.body;

    const [leads] = await pool.query(`SELECT * FROM contactos WHERE id = ?`, [idLead]);

    if (leads.length === 0) {
      return res.status(404).json({ error: "Lead no encontrado" });
    }

    const lead = leads[0];

    await pool.query(
      `UPDATE contactos SET estatus = ? WHERE id = ?`,
      [estatus, lead.id]
    );

    res.json({ message: "Se actualizo el estatus del lead" });

  } catch (error) {
    console.error("Error al actualizar el lead:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
