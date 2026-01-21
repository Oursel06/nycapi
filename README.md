# NYC API

API CRUD simple pour gérer les lieux, hébergée sur Vercel avec base de données Turso.

## Configuration Turso

### 1. Créer une base de données sur Turso

1. Allez sur [turso.tech](https://turso.tech)
2. Créez un compte ou connectez-vous
3. Créez une nouvelle base de données
4. Notez l'URL de la base de données (format: `libsql://xxx-xxx.turso.io`)
5. Créez un token d'authentification dans les paramètres de la base

### 2. Configurer les variables d'environnement dans Vercel

Dans le dashboard Vercel de votre projet :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez les variables suivantes :

- `TURSO_DATABASE_URL` : L'URL de votre base Turso (ex: `libsql://xxx-xxx.turso.io`)
- `TURSO_AUTH_TOKEN` : Le token d'authentification Turso

### 3. Installation et déploiement

```bash
# Installer les dépendances
npm install

# Déployer sur Vercel
vercel deploy
```

## Endpoints

### GET /api/lieux
Récupère tous les lieux

### POST /api/lieux
Crée un nouveau lieu
Body: `{ nom, latitude, longitude, adresse?, jour? }`

### GET /api/lieux/[id]
Récupère un lieu par son ID

### PUT /api/lieux/[id]
Met à jour un lieu
Body: `{ nom, latitude, longitude, adresse?, jour? }`

### DELETE /api/lieux/[id]
Supprime un lieu

## Structure de la table

La table `lieu` est créée automatiquement avec les colonnes :
- `id` (INTEGER, auto-increment)
- `nom` (TEXT, requis)
- `latitude` (TEXT, requis)
- `longitude` (TEXT, requis)
- `adresse` (TEXT, optionnel)
- `jour` (TEXT, optionnel)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)
