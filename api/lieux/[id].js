const { getClient, initDB } = require('../../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await initDB();
  const client = getClient();
  const id = req.query.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    if (req.method === 'GET') {
      const result = await client.execute({
        sql: 'SELECT * FROM lieu WHERE id = ?',
        args: [id]
      });
      if (result.rows.length === 0) return res.status(404).json({ error: 'Lieu non trouvé' });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PUT') {
      const { nom, latitude, longitude, adresse, jour } = req.body;
      if (!nom || !latitude || !longitude) {
        return res.status(400).json({ error: 'nom, latitude et longitude sont requis' });
      }
      const result = await client.execute({
        sql: 'UPDATE lieu SET nom = ?, latitude = ?, longitude = ?, adresse = ?, jour = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [nom, latitude, longitude, adresse || null, jour || null, id]
      });
      if (result.rowsAffected === 0) return res.status(404).json({ error: 'Lieu non trouvé' });
      const updatedLieu = await client.execute({
        sql: 'SELECT * FROM lieu WHERE id = ?',
        args: [id]
      });
      return res.status(200).json(updatedLieu.rows[0]);
    }

    if (req.method === 'DELETE') {
      const result = await client.execute({
        sql: 'DELETE FROM lieu WHERE id = ?',
        args: [id]
      });
      if (result.rowsAffected === 0) return res.status(404).json({ error: 'Lieu non trouvé' });
      return res.status(200).json({ message: 'Lieu supprimé' });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
