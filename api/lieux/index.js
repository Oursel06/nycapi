const { getClient, initDB } = require('../../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await initDB();
  const client = getClient();

  try {
    if (req.method === 'GET') {
      const result = await client.execute('SELECT * FROM lieu ORDER BY id');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { nom, latitude, longitude, adresse, jour } = req.body;
      if (!nom || !latitude || !longitude) {
        return res.status(400).json({ error: 'nom, latitude et longitude sont requis' });
      }
      const result = await client.execute({
        sql: 'INSERT INTO lieu (nom, latitude, longitude, adresse, jour) VALUES (?, ?, ?, ?, ?)',
        args: [nom, latitude, longitude, adresse || null, jour || null]
      });
      const newLieu = await client.execute({
        sql: 'SELECT * FROM lieu WHERE id = ?',
        args: [result.lastInsertRowid]
      });
      return res.status(201).json(newLieu.rows[0]);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
