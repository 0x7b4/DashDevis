# 📊 DashDevis - Dashboard Professionnel de Gestion de Devis

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Application web Node.js complète pour gérer vos devis automobiles avec une interface moderne, des graphiques KPI interactifs et une analyse en temps réel.

---

## 📸 Aperçu

### Interface Principale
- **Dashboard moderne** avec design gradient violet/bleu
- **Tableau de gestion** complet avec actions (éditer/supprimer)
- **Statistiques en temps réel** (6 indicateurs)
- **Graphiques KPI interactifs** (Chart.js)
- **Interface responsive** (mobile, tablette, desktop)

---

## ✨ Fonctionnalités Principales

### 📋 Gestion Complète des Devis

#### ✅ CRUD Complet
- **Créer** un nouveau devis via formulaire modal élégant
- **Lire** tous les devis dans un tableau responsive
- **Modifier** un devis existant en 1 clic
- **Supprimer** un devis avec confirmation de sécurité

#### 💾 Sauvegarde Automatique
- Toutes les modifications sont **automatiquement sauvegardées**
- Stockage en JSON local (`data/devis.json`)
- Pas de base de données requise pour démarrer
- Migration facile vers PostgreSQL/MongoDB si besoin

#### 📥 Export CSV
- **Exportez tous vos devis** au format CSV
- Encodage **UTF-8 avec BOM** (compatible Excel)
- Séparateur point-virgule (`;`)
- Nom de fichier avec date : `devis_export_2025-11-22.csv`

#### 📤 Import CSV
- **Importez des devis en masse** depuis un fichier CSV
- Détection automatique des colonnes
- Gestion des erreurs avec messages clairs
- Compatible avec exports Excel

### 📊 Graphiques KPI Interactifs (Chart.js)

#### 1️⃣ Graphique Donut - Répartition par Statut
Visualisez en un coup d'œil la distribution de vos devis :
- 🔵 **En étude** (bleu)
- 🟢 **Validé** (vert)
- ⚫ **Terminé** (gris)

**Fonctionnalités :**
- Pourcentages calculés automatiquement
- Légende interactive (cliquez pour masquer/afficher)
- Tooltips avec détails au survol
- Animation fluide au chargement

#### 2️⃣ Graphique Barres - Montants par Statut
Comparez les montants totaux en euros pour chaque catégorie :
- Vue claire des montants par statut
- Barres colorées avec coins arrondis
- Échelle Y formatée en euros
- Tooltips avec montants formatés

### 📈 Statistiques en Temps Réel

Le dashboard affiche **6 indicateurs clés** qui se mettent à jour automatiquement :

| Indicateur | Description | Icône |
|------------|-------------|-------|
| **Total Devis** | Nombre total de devis enregistrés | 📊 |
| **En Étude** | Devis en cours d'analyse | 🔵 |
| **Validés** | Devis approuvés | 🟢 |
| **Terminés** | Devis complétés | ⚫ |
| **Montant Total** | Somme de tous les montants (€) | 💰 |
| **Montant Moyen** | Moyenne par devis (€) | 📊 |

### 🎨 Design & Interface

#### Interface Moderne
- **Gradient violet/bleu** pour le header
- **Cards avec ombres** pour les statistiques
- **Animations fluides** sur tous les éléments
- **Badges colorés** pour les statuts
- **Notifications toast** pour les actions

#### Responsive Design
- **Desktop** : Vue complète avec grille de graphiques
- **Tablette** : Adaptation automatique des colonnes
- **Mobile** : Navigation optimisée, tableau scrollable

#### Accessibilité
- Formulaires avec labels clairs
- Boutons avec icônes et texte
- Messages d'erreur explicites
- Confirmations avant suppression

---

## 📋 Structure des Données

### Colonnes du Tableau

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| **Date** | Date | Date du devis | 15/01/2025 |
| **N° de Sinistre** | Texte | Numéro de sinistre | SIN001 |
| **N° OR** | Texte | Numéro d'ordre de réparation | OR123 |
| **Garage** | Texte | Nom du garage | Garage Martin |
| **Montant** | Nombre | Montant en euros | 1 500,50 € |
| **Statut** | Énumération | En étude / Validé / Terminé | Validé |
| **Commentaires** | Texte | Notes et commentaires | Premier devis |
| **Actions** | Boutons | Éditer ✏️ / Supprimer 🗑️ | - |

### États des Statuts

```javascript
Statuts possibles :
├── "En étude"   → Badge bleu (devis en analyse)
├── "Validé"     → Badge vert (devis approuvé)
└── "Terminé"    → Badge gris (devis complété)
```

---

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** version 14 ou supérieure
- **npm** ou **yarn**
- Un éditeur de code (VSCode recommandé)
- Git installé

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

### Mode Développement

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

Le serveur redémarrera automatiquement à chaque modification de fichier.

### Configuration du Port

Par défaut, le serveur démarre sur le port **3000**. Pour changer :

```bash
# Windows
set PORT=8080 && npm start

# Linux/Mac
PORT=8080 npm start
```

---

## 🌐 Déploiement sur Render.com

### Étape 1 : Créer un compte (gratuit)

1. Allez sur **[render.com](https://render.com)**
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec votre compte **GitHub**

### Étape 2 : Déployer l'application

1. Dans le dashboard, cliquez sur **"New +"** → **"Web Service"**
2. Autorisez Render à accéder à vos repositories GitHub
3. Sélectionnez le repository **"DashDevis"**
4. Configuration automatique détectée via `render.yaml` :
   - **Name** : `dashdevis` (ou personnalisé)
   - **Region** : Frankfurt / Oregon (choisissez la plus proche)
   - **Branch** : `main`
   - **Build Command** : `npm install` ✅
   - **Start Command** : `npm start` ✅
   - **Instance Type** : **Free** (750h/mois)
5. Cliquez sur **"Create Web Service"**

### Étape 3 : Attendre le déploiement

**Durée estimée :** 2-3 minutes

Render va :
- ✅ Cloner votre repository
- ✅ Installer les dépendances
- ✅ Démarrer le serveur Node.js
- ✅ Générer une URL publique HTTPS

### URL de Production

Votre application sera accessible sur :
```
https://dashdevis-xxxx.onrender.com
```

### Déploiement Automatique

Chaque fois que vous faites un `git push` sur la branche `main` :
- Render **détecte automatiquement** le nouveau commit
- Redéploie l'application **automatiquement**
- Votre site est à jour en **2-3 minutes**

### Notes Importantes

⚠️ **Plan Gratuit Render :**
- Instance se met en **veille après 15 minutes** d'inactivité
- Premier accès après veille : **30-60 secondes** de chargement
- Limite : **750 heures/mois** (suffisant pour usage personnel)

💾 **Données Éphémères :**
- Le fichier `data/devis.json` est **réinitialisé** à chaque redémarrage
- Pour persistance, ajoutez un **disque Render** (1GB gratuit) :
  1. Onglet **"Disks"** → **"Add Disk"**
  2. Mount Path : `/app/data`
  3. Taille : 1GB

---

## 📦 Technologies & Dépendances

### Backend

| Package | Version | Description |
|---------|---------|-------------|
| **express** | ^4.18.2 | Framework web minimaliste |
| **body-parser** | ^1.20.2 | Parser pour requêtes HTTP |
| **csv-parser** | ^3.0.0 | Lecture de fichiers CSV |
| **json2csv** | ^6.0.0-alpha.2 | Conversion JSON → CSV |
| **multer** | ^1.4.5-lts.1 | Upload de fichiers |

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Chart.js** | 4.4.0 (CDN) | Graphiques interactifs |
| **HTML5** | - | Structure |
| **CSS3** | - | Design & animations |
| **JavaScript (ES6)** | - | Logique métier |

### Développement

| Package | Version | Description |
|---------|---------|-------------|
| **nodemon** | ^3.0.1 | Rechargement automatique |

---

## 📁 Structure du Projet

```
DashDevis/
├── server.js                 # ⚙️ Serveur Express + API REST
├── package.json              # 📦 Configuration npm
├── package-lock.json         # 🔒 Versions exactes des dépendances
├── render.yaml              # 🚀 Configuration Render.com
├── README.md                # 📖 Documentation (ce fichier)
├── DEPLOYMENT_GUIDE.md      # 📘 Guide de déploiement détaillé
├── .gitignore              # 🙈 Fichiers ignorés par Git
├── data/                   # 💾 Dossier de données
│   └── devis.json         # 📄 Fichier JSON (créé automatiquement)
├── public/                # 🌐 Fichiers statiques
│   ├── index.html        # 📄 Interface utilisateur
│   ├── styles.css        # 🎨 Styles CSS
│   └── script.js         # ⚡ Logique JavaScript + Chart.js
└── uploads/              # 📤 Dossier temporaire (imports CSV)
```

### Détails des Fichiers Principaux

#### `server.js`
Serveur Express avec :
- Routes API REST complètes (GET, POST, PUT, DELETE)
- Gestion des imports/exports CSV
- Middleware body-parser et multer
- Sauvegarde automatique JSON
- Gestion des erreurs

#### `public/index.html`
Interface utilisateur avec :
- Header responsive
- 6 cartes statistiques
- 2 graphiques Chart.js (Donut + Barres)
- Tableau de données dynamique
- Modal d'édition/création

#### `public/script.js`
Logique frontend :
- Chargement des données via API
- Mise à jour des graphiques Chart.js
- Gestion du formulaire modal
- Import/Export CSV
- Notifications toast

#### `public/styles.css`
Design moderne :
- Gradient violet/bleu
- Cards avec ombres
- Animations CSS
- Responsive design
- Badges colorés

---

## 🔌 API REST Complète

### Endpoints Disponibles

#### 📋 Gestion des Devis

**Liste tous les devis**
```http
GET /api/devis
```
**Réponse :**
```json
[
  {
    "id": "1732270123456",
    "date": "2025-01-15",
    "numeroSinistre": "SIN001",
    "numeroOR": "OR123",
    "garage": "Garage Martin",
    "montant": "1500.50",
    "statut": "Validé",
    "commentaires": "Premier devis"
  }
]
```

**Récupérer un devis spécifique**
```http
GET /api/devis/:id
```

**Créer un nouveau devis**
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

**Mettre à jour un devis**
```http
PUT /api/devis/:id
Content-Type: application/json

{
  "statut": "Validé",
  "commentaires": "Devis approuvé"
}
```

**Supprimer un devis**
```http
DELETE /api/devis/:id
```

#### 📥📤 Import/Export CSV

**Exporter tous les devis en CSV**
```http
GET /api/export/csv
```
**Réponse :** Téléchargement fichier `devis_export_2025-11-22.csv`

**Importer des devis depuis CSV**
```http
POST /api/import/csv
Content-Type: multipart/form-data

file: [fichier CSV]
```

### Exemples avec cURL

**Créer un devis :**
```bash
curl -X POST http://localhost:3000/api/devis \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "numeroSinistre": "SIN001",
    "numeroOR": "OR123",
    "garage": "Garage Martin",
    "montant": 1500.50,
    "statut": "En étude",
    "commentaires": "Nouveau devis"
  }'
```

**Lister les devis :**
```bash
curl http://localhost:3000/api/devis
```

**Mettre à jour un devis :**
```bash
curl -X PUT http://localhost:3000/api/devis/1732270123456 \
  -H "Content-Type: application/json" \
  -d '{"statut": "Validé"}'
```

**Supprimer un devis :**
```bash
curl -X DELETE http://localhost:3000/api/devis/1732270123456
```

---

## 📄 Format CSV pour Import/Export

### Structure du Fichier CSV

Le fichier CSV doit respecter ce format :

```csv
date;numeroSinistre;numeroOR;garage;montant;statut;commentaires
2025-01-15;SIN001;OR123;Garage Martin;1500.50;En étude;Premier devis
2025-01-16;SIN002;OR124;Garage Dupont;2300.00;Validé;Deuxième devis
2025-01-17;SIN003;OR125;Garage Bernard;1800.75;Terminé;Troisième devis
```

### Spécifications Techniques

- **Séparateur** : Point-virgule (`;`)
- **Encodage** : UTF-8 avec BOM (pour Excel)
- **Format de date** : YYYY-MM-DD
- **Format de montant** : Nombre décimal avec point ou virgule
- **Statuts autorisés** : `En étude`, `Validé`, `Terminé`
- **Première ligne** : En-têtes de colonnes

### Exemple Complet

```csv
date;numeroSinistre;numeroOR;garage;montant;statut;commentaires
2025-01-10;SIN001;OR100;Garage Auto Plus;1245.00;En étude;Réparation pare-chocs
2025-01-11;SIN002;OR101;Garage Rapide;890.50;Validé;Changement pneus
2025-01-12;SIN003;OR102;Garage Martin;3450.00;Terminé;Réparation moteur
2025-01-13;SIN004;OR103;Garage Dupont;567.80;En étude;Révision complète
2025-01-14;SIN005;OR104;Garage Pro;2100.00;Validé;Carrosserie
```

---

## 🛠️ Guide d'Utilisation

### 1️⃣ Créer un Devis

1. Cliquez sur le bouton **"➕ Nouveau Devis"**
2. Remplissez le formulaire modal :
   - **Date** : Sélectionnez la date (aujourd'hui par défaut)
   - **N° de Sinistre** : Entrez le numéro
   - **N° OR** : Entrez le numéro d'ordre
   - **Garage** : Nom du garage
   - **Montant** : Montant en euros
   - **Statut** : Choisissez dans la liste déroulante
   - **Commentaires** : Notes optionnelles
3. Cliquez sur **"Enregistrer"**
4. Le devis apparaît dans le tableau et les graphiques se mettent à jour

### 2️⃣ Modifier un Devis

1. Dans le tableau, cliquez sur l'icône **✏️ Éditer**
2. Le formulaire modal s'ouvre avec les données pré-remplies
3. Modifiez les champs souhaités
4. Cliquez sur **"Enregistrer"**
5. Les changements sont appliqués immédiatement

### 3️⃣ Supprimer un Devis

1. Dans le tableau, cliquez sur l'icône **🗑️ Supprimer**
2. Une confirmation apparaît : **"Êtes-vous sûr ?"**
3. Confirmez pour supprimer définitivement
4. Le devis est retiré du tableau et des graphiques

### 4️⃣ Exporter en CSV

1. Cliquez sur **"📥 Exporter CSV"**
2. Le fichier `devis_export_YYYY-MM-DD.csv` est téléchargé
3. Ouvrez-le avec Excel, LibreOffice ou un éditeur de texte
4. Les données sont formatées avec séparateur `;` et encodage UTF-8

### 5️⃣ Importer depuis CSV

1. Préparez votre fichier CSV selon le format indiqué
2. Cliquez sur **"📤 Importer CSV"**
3. Sélectionnez votre fichier
4. Les devis sont ajoutés automatiquement
5. Une notification indique le nombre de devis importés

### 6️⃣ Analyser les KPI

Les graphiques se mettent à jour automatiquement après chaque action :

**Graphique Donut :**
- Survolez pour voir les pourcentages
- Cliquez sur la légende pour masquer/afficher un statut

**Graphique Barres :**
- Compare visuellement les montants par statut
- Survolez pour voir le montant exact formaté

---

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez `public/styles.css` :

```css
/* Gradient principal du header */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Couleurs des statuts */
.status-etude { background: #dbeafe; color: #1e40af; }
.status-valide { background: #d1fae5; color: #065f46; }
.status-termine { background: #e5e7eb; color: #374151; }

/* Couleurs des graphiques Chart.js */
backgroundColor: ['#3b82f6', '#10b981', '#6b7280']
```

### Ajouter de Nouvelles Statistiques

Dans `public/script.js`, fonction `updateStats()` :

```javascript
// Exemple : Calculer le montant maximum
const montantMax = Math.max(...devisData.map(d => parseFloat(d.montant)));
document.getElementById('montantMax').textContent = formatMontant(montantMax);
```

### Modifier le Port par Défaut

Dans `server.js` :

```javascript
const PORT = process.env.PORT || 8080; // Changez 3000 en 8080
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas

**Erreur :** `Cannot find module 'express'`

**Solution :**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Les graphiques ne s'affichent pas

**Causes possibles :**
- Pas de connexion Internet (Chart.js chargé via CDN)
- Erreur JavaScript dans la console

**Solution :**
1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Assurez-vous que Chart.js est chargé
4. Rechargez la page (Ctrl+F5)

### Erreur d'import CSV

**Erreur :** Colonnes mal détectées

**Solution :**
- Vérifiez le séparateur (`;` et non `,`)
- Assurez-vous de l'encodage UTF-8
- Vérifiez que la première ligne contient les en-têtes

### Données perdues après redémarrage (Render)

**Cause :** Système de fichiers éphémère sur Render gratuit

**Solution :**
1. Ajoutez un disque persistant Render (1GB gratuit)
2. Ou migrez vers une base de données (PostgreSQL/MongoDB)

---

## 🔐 Sécurité

### Recommandations

⚠️ **Cette application est conçue pour un usage local/interne**

Pour un usage en production :
- [ ] Ajoutez l'authentification (JWT, OAuth)
- [ ] Validez les entrées utilisateur côté serveur
- [ ] Utilisez HTTPS (Render fournit SSL automatique)
- [ ] Limitez les requêtes (rate limiting)
- [ ] Ajoutez des logs d'audit
- [ ] Utilisez une vraie base de données

---

## 🤝 Contribution

Les contributions sont les bienvenues !

### Comment contribuer

1. **Fork** le projet
2. Créez une **branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commitez** : `git commit -m 'Ajout nouvelle fonctionnalité'`
4. **Push** : `git push origin feature/nouvelle-fonctionnalite`
5. Ouvrez une **Pull Request**

### Idées de Contributions

- 🔐 Système d'authentification
- 💾 Support PostgreSQL/MongoDB
- 📊 Nouveaux graphiques (évolution temporelle, etc.)
- 🌍 Internationalisation (i18n)
- 📱 Application mobile (React Native)
- 🎨 Thèmes personnalisables
- 📧 Notifications par email
- 📄 Export PDF des devis

---

## 📝 Licence

Ce projet est sous licence **MIT**.

Vous êtes libre de :
- ✅ Utiliser commercialement
- ✅ Modifier
- ✅ Distribuer
- ✅ Utiliser en privé

---

## 🙏 Remerciements

- **[Chart.js](https://www.chartjs.org/)** - Graphiques interactifs magnifiques
- **[Express.js](https://expressjs.com/)** - Framework web robuste et minimaliste
- **[Node.js](https://nodejs.org/)** - Environnement d'exécution JavaScript
- **[Render.com](https://render.com/)** - Plateforme de déploiement gratuite

---

## 📞 Support

Besoin d'aide ? Plusieurs options :

- 📖 Lisez la [documentation complète](https://github.com/0x7b4/DashDevis/blob/main/README.md)
- 📘 Consultez le [guide de déploiement](https://github.com/0x7b4/DashDevis/blob/main/DEPLOYMENT_GUIDE.md)
- 🐛 Ouvrez une [issue GitHub](https://github.com/0x7b4/DashDevis/issues)
- 💬 Contactez le développeur

---

## 🔗 Liens Utiles

- **Repository GitHub** : [https://github.com/0x7b4/DashDevis](https://github.com/0x7b4/DashDevis)
- **Render Dashboard** : [https://dashboard.render.com](https://dashboard.render.com)
- **Chart.js Docs** : [https://www.chartjs.org/docs/](https://www.chartjs.org/docs/)
- **Express Docs** : [https://expressjs.com/](https://expressjs.com/)
- **Node.js Docs** : [https://nodejs.org/docs/](https://nodejs.org/docs/)

---

## 📊 Statistiques du Projet

- **Langages** : JavaScript (100%)
- **Framework Backend** : Express.js
- **Bibliothèque Graphiques** : Chart.js 4.4.0
- **Stockage** : JSON (fichier local)
- **Format d'échange** : CSV
- **Fichiers** : 9 fichiers principaux
- **Lignes de code** : ~1500 lignes

---

## 🎯 Roadmap

### Version Actuelle : 2.1

✅ CRUD complet  
✅ 2 graphiques KPI (Donut + Barres)  
✅ 6 statistiques temps réel  
✅ Import/Export CSV  
✅ Interface responsive  
✅ Déploiement Render  

### Prochaines Versions

#### Version 2.2 (Court terme)
- [ ] Authentification utilisateur
- [ ] Filtre et recherche dans le tableau
- [ ] Tri par colonnes
- [ ] Pagination du tableau

#### Version 3.0 (Moyen terme)
- [ ] Base de données PostgreSQL
- [ ] Multi-utilisateurs
- [ ] Rôles et permissions
- [ ] Export PDF
- [ ] Emails automatiques

#### Version 4.0 (Long terme)
- [ ] API GraphQL
- [ ] Application mobile
- [ ] Mode sombre
- [ ] Multi-langue
- [ ] Tableau de bord avancé

---

**⭐ Si ce projet vous plaît, donnez-lui une étoile sur GitHub !**

---

**Version** : 2.1.0  
**Dernière mise à jour** : Novembre 2025  
**Auteur** : 0x7b4  
**Licence** : MIT
