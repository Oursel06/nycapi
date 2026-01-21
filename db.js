const { createClient } = require('@libsql/client');

let client = null;

function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
  }
  return client;
}

async function initDB() {
  const client = getClient();
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS lieu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        latitude TEXT NOT NULL,
        longitude TEXT NOT NULL,
        adresse TEXT,
        jour TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Erreur initialisation DB:', error);
  }
}

module.exports = { getClient, initDB };
