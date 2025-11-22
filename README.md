# 📊 DashDevis v2.2 - Dashboard Professionnel de Gestion de Devis

![Version](https://img.shields.io/badge/version-2.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)

Application web Node.js complète pour gérer vos devis avec **authentification**, **filtres avancés**, **recherche**, **tri** et **pagination**.

---

## 🆕 Nouveautés Version 2.2

### 🔐 Authentification Utilisateur
- ✅ Page de connexion sécurisée
- ✅ Sessions persistantes (24 heures)
- ✅ Mots de passe hashés avec bcryptjs
- ✅ Protection de toutes les routes API
- 🔑 **Identifiants par défaut** : `admin` / `admin123`

### 🔍 Recherche & Filtres
- ✅ **Recherche globale** instantanée (N° Sinistre, N° OR, Garage, Commentaires)
- ✅ **Filtre par statut** : Tous / En étude / Validé / Terminé
- ✅ **Filtre par date** : Début et fin
- ✅ Bouton **Réinitialiser** pour tout effacer

### ⬆️⬇️ Tri par Colonnes
- ✅ Cliquez sur n'importe quel en-tête de colonne
- ✅ Tri ascendant/descendant
- ✅ Tri sur : Date, N° Sinistre, N° OR, Garage, Montant, Statut

### 📄 Pagination
- ✅ 10 devis par page (configurable)
- ✅ Navigation Précédent/Suivant
- ✅ Saut rapide entre pages
- ✅ Indicateur "Page X / Y (Total devis)"

---

## ✨ Fonctionnalités Complètes

### 📋 Gestion des Devis
- **CRUD complet** : Créer, Lire, Modifier, Supprimer
- **Sauvegarde automatique** en JSON
- **Import/Export CSV** avec encodage UTF-8
- **Notifications toast** pour chaque action
- **Traçabilité** : createdBy, updatedBy, timestamps

### 📊 Graphiques KPI (Chart.js)
- **Donut** : Répartition par statut avec pourcentages
- **Barres** : Montants totaux par statut

### 📈 Statistiques Temps Réel
| Indicateur | Description |
|------------|-------------|
| Total Devis | Nombre total enregistré |
| En Étude | Devis en cours d'analyse |
| Validés | Devis approuvés |
| Terminés | Devis complétés |
| Montant Total | Somme de tous les montants (€) |
| Montant Moyen | Moyenne par devis (€) |

### 🎨 Interface Moderne
- Design **responsive** (mobile, tablette, desktop)
- Gradient **violet/bleu** élégant
- **Animations fluides** sur tous les éléments
- **Badges colorés** pour les statuts

---

## 📋 Structure des Données

### Colonnes du Tableau

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| Date | Date | Date du devis | 22/11/2025 |
| N° de Sinistre | Texte | Numéro de sinistre | SIN001 |
| N° OR | Texte | Numéro d'ordre | OR123 |
| Garage | Texte | Nom du garage | Garage Martin |
| Montant | Nombre | Montant en € | 1 500,50 € |
| Statut | Énumération | En étude / Validé / Terminé | Validé |
| Commentaires | Texte | Notes | Premier devis |
| Actions | Boutons | ✏️ Éditer / 🗑️ Supprimer | - |

---

## 🚀 Installation Rapide

### Prérequis
- Node.js v14+ 
- npm ou yarn
- Git

### Installation Locale

```bash
# 1. Cloner le repository
git clone https://github.com/0x7b4/DashDevis.git
cd DashDevis

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start

# 4. Ouvrir dans le navigateur
# http://localhost:3000
```

### Première Connexion

Utilisez les identifiants par défaut :
- **Username** : `admin`
- **Password** : `admin123`

⚠️ **Important** : Changez ces identifiants en production !

---

### Variables d'Environnement (Optionnel)

```bash
NODE_ENV=production
PORT=3000
SESSION_SECRET=votre-secret-unique-ici
```

### Plan Gratuit Render
- ✅ 750 heures/mois
- ✅ SSL automatique (HTTPS)
- ✅ Déploiement automatique sur git push
- ⚠️ Mise en veille après 15 min d'inactivité

---

## 📦 Technologies & Dépendances

### Backend

| Package | Version | Description |
|---------|---------|-------------|
| express | ^4.18.2 | Framework web |
| body-parser | ^1.20.2 | Parser HTTP |
| express-session | ^1.17.3 | ✨ Gestion sessions |
| bcryptjs | ^2.4.3 | ✨ Hash mots de passe |
| csv-parser | ^3.0.0 | Lecture CSV |
| json2csv | ^6.0.0 | Export CSV |
| multer | ^1.4.5 | Upload fichiers |

### Frontend

- **Chart.js** 4.4.0 (CDN) - Graphiques interactifs
- **HTML5** - Structure
- **CSS3** - Design & animations
- **JavaScript ES6** - Logique

---

## 📁 Structure du Projet

```
DashDevis/
├── server.js                 # ⚙️ Serveur Express + Auth + API
├── package.json              # 📦 Configuration npm
├── render.yaml              # 🚀 Config Render.com
├── README.md                # 📖 Documentation
├── DEPLOYMENT_GUIDE.md      # 📘 Guide déploiement
├── .gitignore              # 🙈 Fichiers ignorés
├── data/                   # 💾 Données
│   ├── devis.json         # 📄 Base de données JSON
│   └── users.json         # 👥 Utilisateurs (créé auto)
├── public/                # 🌐 Frontend
│   ├── login.html        # 🔐 Page de connexion
│   ├── index.html        # 📄 Dashboard principal
│   ├── styles.css        # 🎨 Styles CSS
│   └── script-v2.2.js    # ⚡ Logique JavaScript
└── uploads/              # 📤 Temporaire (imports CSV)
```

---

## 🔌 API REST

### Authentification

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Réponse** :
```json
{
  "success": true,
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@dashdevis.com"
  }
}
```

#### Vérifier Session
```http
GET /api/auth/check
```

#### Déconnexion
```http
POST /api/auth/logout
```

### Gestion des Devis (Protégées 🔒)

#### Liste avec Filtres & Pagination
```http
GET /api/devis?page=1&limit=10&search=garage&statut=Validé&dateDebut=2025-01-01
```

**Réponse** :
```json
{
  "data": [
    {
      "id": "1732270123456",
      "date": "2025-01-15",
      "numeroSinistre": "SIN001",
      "numeroOR": "OR123",
      "garage": "Garage Martin",
      "montant": "1500.50",
      "statut": "Validé",
      "commentaires": "Premier devis",
      "createdBy": "admin",
      "createdAt": "2025-11-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Créer un Devis
```http
POST /api/devis
Content-Type: application/json

{
  "date": "2025-01-15",
  "numeroSinistre": "SIN001",
  "numeroOR": "OR123",
  "garage": "Garage Martin",
  "montant": 1500.50,
  "statut": "En étude",
  "commentaires": "Nouveau devis"
}
```

#### Modifier un Devis
```http
PUT /api/devis/:id
Content-Type: application/json

{
  "statut": "Validé"
}
```

#### Supprimer un Devis
```http
DELETE /api/devis/:id
```

#### Statistiques
```http
GET /api/stats
```

**Réponse** :
```json
{
  "total": 45,
  "enEtude": 12,
  "valides": 18,
  "termines": 15,
  "montantTotal": 67500.00,
  "montantMoyen": 1500.00
}
```

### Import/Export

#### Export CSV
```http
GET /api/export/csv
```

#### Import CSV
```http
POST /api/import/csv
Content-Type: multipart/form-data

file: [fichier.csv]
```

---

## 📄 Format CSV

### Structure

```csv
date;numeroSinistre;numeroOR;garage;montant;statut;commentaires
2025-01-15;SIN001;OR123;Garage Martin;1500.50;En étude;Premier devis
2025-01-16;SIN002;OR124;Garage Dupont;2300.00;Validé;Deuxième devis
```

### Spécifications
- **Séparateur** : Point-virgule (`;`)
- **Encodage** : UTF-8 avec BOM
- **Format date** : YYYY-MM-DD
- **Format montant** : Nombre décimal
- **Statuts** : `En étude`, `Validé`, `Terminé`

---

## 🛠️ Guide d'Utilisation

### 1️⃣ Connexion
1. Ouvrez l'application
2. Entrez : `admin` / `admin123`
3. Cliquez sur "Se connecter"

### 2️⃣ Rechercher des Devis
1. Tapez dans la barre de recherche
2. Résultats instantanés sur tous les champs

### 3️⃣ Filtrer par Statut
1. Sélectionnez un statut dans la liste déroulante
2. Les résultats se mettent à jour automatiquement

### 4️⃣ Filtrer par Date
1. Choisissez une date de début
2. Choisissez une date de fin (optionnel)
3. Seuls les devis dans cette période s'affichent

### 5️⃣ Trier les Colonnes
1. Cliquez sur n'importe quel en-tête de colonne
2. Premier clic : tri ascendant ⬆️
3. Deuxième clic : tri descendant ⬇️

### 6️⃣ Naviguer entre Pages
1. Utilisez les boutons "Précédent" / "Suivant"
2. Ou cliquez directement sur un numéro de page

### 7️⃣ Créer un Devis
1. Cliquez sur "➕ Nouveau"
2. Remplissez le formulaire
3. Cliquez sur "Enregistrer"

### 8️⃣ Modifier un Devis
1. Cliquez sur ✏️ dans la colonne Actions
2. Modifiez les champs
3. Cliquez sur "Enregistrer"

### 9️⃣ Supprimer un Devis
1. Cliquez sur 🗑️ dans la colonne Actions
2. Confirmez la suppression

### 🔟 Déconnexion
1. Cliquez sur "🚪 Déconnexion"
2. Vous êtes redirigé vers la page de login

---

## 🔐 Sécurité

### Recommandations pour la Production

⚠️ **IMPORTANT** : Changez les identifiants par défaut !

1. **Modifier le mot de passe admin**
   - Éditez `data/users.json`
   - Générez un nouveau hash bcrypt

2. **Changer la clé de session**
   ```javascript
   // Dans server.js
   secret: process.env.SESSION_SECRET || 'votre-secret-unique'
   ```

3. **Utiliser HTTPS**
   - Render fournit SSL automatiquement
   - En local, utilisez un reverse proxy (nginx)

4. **Variables d'environnement**
   ```bash
   export SESSION_SECRET=super-secret-unique-key
   export NODE_ENV=production
   ```

5. **Limiter les tentatives de connexion**
   - Ajouter express-rate-limit (futur)

6. **Base de données**
   - Migrer vers PostgreSQL/MongoDB pour production

---

## 🎨 Personnalisation

### Changer les Couleurs

Éditez `public/styles.css` :

```css
/* Gradient principal */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Couleurs graphiques */
backgroundColor: ['#3b82f6', '#10b981', '#6b7280']
```

### Modifier le Nombre d'Éléments par Page

Dans `public/script-v2.2.js` :

```javascript
let limit = 20; // Au lieu de 10
```

### Ajouter un Nouvel Utilisateur

Éditez `data/users.json` :

```javascript
const bcrypt = require('bcryptjs');
const password = bcrypt.hashSync('motdepasse', 10);
// Ajoutez dans users.json
```

---

## 🐛 Dépannage

### Impossible de se connecter

**Problème** : "Identifiants incorrects"

**Solutions** :
1. Vérifiez que `data/users.json` existe
2. Utilisez `admin` / `admin123`
3. Supprimez `data/users.json` et redémarrez le serveur

### Les filtres ne fonctionnent pas

**Solution** :
1. Vérifiez la console (F12)
2. Rechargez la page (Ctrl+F5)
3. Vérifiez que l'API répond : `GET /api/devis`

### Données perdues après redémarrage (Render)

**Cause** : Système de fichiers éphémère

**Solution** :
1. Ajoutez un disque persistant Render (1GB gratuit)
2. Ou migrez vers PostgreSQL

### Pagination cassée

**Solution** :
1. Vérifiez que `limit` et `page` sont des nombres
2. Rechargez les données avec `applyFilters()`

---

## 🤝 Contribution

Les contributions sont bienvenues !

### Comment Contribuer
1. Fork le projet
2. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
3. Commitez : `git commit -m 'Ajout fonctionnalité'`
4. Push : `git push origin feature/ma-fonctionnalite`
5. Ouvrez une Pull Request

---

## 🎯 Roadmap

### ✅ Version 2.2 (Actuelle)
- [x] Authentification utilisateur
- [x] Recherche globale
- [x] Filtres avancés
- [x] Tri par colonnes
- [x] Pagination

### 📋 Version 2.3 (Prochaine)
- [ ] Multi-utilisateurs
- [ ] Rôles et permissions
- [ ] Changement de mot de passe
- [ ] Logs d'activité

### 🚀 Version 3.0 (Futur)
- [ ] Base de données PostgreSQL
- [ ] Export PDF
- [ ] Emails automatiques
- [ ] Dashboard avancé
- [ ] API GraphQL

---

## 📝 Changelog

### Version 2.2.0 (2025-11-22)
- ✨ Ajout authentification avec express-session et bcryptjs
- ✨ Ajout recherche globale instantanée
- ✨ Ajout filtres par statut et dates
- ✨ Ajout tri par colonnes (cliquer sur en-têtes)
- ✨ Ajout pagination (10 par page)
- 🔒 Protection de toutes les routes API
- 📊 Ajout endpoint `/api/stats`
- 🎨 Page de login sécurisée

### Version 2.1.0 (2025-11-22)
- ✨ Ajout 2 graphiques KPI (Donut + Barres)
- 📊 Ajout 6 statistiques temps réel
- 🎨 Amélioration design interface
- 📝 Documentation complète

### Version 2.0.0 (2025-11-22)
- 🚀 Première version publique
- ✅ CRUD complet
- 📥 Import/Export CSV
- 💾 Sauvegarde automatique JSON

---

## 📞 Support

- 📖 [Documentation complète](https://github.com/0x7b4/DashDevis/blob/main/README.md)
- 📘 [Guide de déploiement](https://github.com/0x7b4/DashDevis/blob/main/DEPLOYMENT_GUIDE.md)
- 🐛 [Signaler un bug](https://github.com/0x7b4/DashDevis/issues)

---

## 📝 Licence

MIT License - Vous êtes libre d'utiliser, modifier et distribuer ce projet.

---

## 🔗 Liens Utiles

- **Repository** : [github.com/0x7b4/DashDevis](https://github.com/0x7b4/DashDevis)
- **Chart.js** : [chartjs.org](https://www.chartjs.org/)
- **Express** : [expressjs.com](https://expressjs.com/)

---

**⭐ Si ce projet vous aide, donnez-lui une étoile sur GitHub !**

---

**Version** : 2.2.0  
**Dernière mise à jour** : 22 Novembre 2025  
**Auteur** : 0x7b4  
**Licence** : MIT
