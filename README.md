# 📊 DashDevis - Dashboard de Gestion de Devis

Application web Node.js complète pour gérer vos devis avec une interface moderne, des **KPI graphiques interactifs** et une analyse en temps réel.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Fonctionnalités Principales

### 📋 Gestion Complète des Devis
- ✅ **CRUD complet** : Créer, lire, modifier et supprimer des devis
- 💾 **Sauvegarde automatique** : Toutes les modifications sont automatiquement sauvegardées en JSON
- 📥 **Export CSV** : Exportez tous vos devis au format CSV avec encodage UTF-8
- 📤 **Import CSV** : Importez des devis depuis un fichier CSV avec détection automatique
- 🎨 **Interface moderne** : Design responsive avec dégradés et animations fluides
- 🔍 **Gestion des statuts** : En étude, Validé, Terminé

### 📊 KPI & Graphiques Interactifs (Chart.js)

#### 1️⃣ **Graphique Donut - Répartition par Statut**
Visualisez la proportion de chaque statut en temps réel avec un graphique circulaire élégant

#### 2️⃣ **Graphique Barres - Montants par Statut**
Comparez les montants totaux en euros pour chaque catégorie de statut

#### 3️⃣ **Graphique Ligne - Évolution Mensuelle**
Suivez l'évolution de vos devis mois par mois avec 3 courbes distinctes (une par statut)

#### 4️⃣ **Graphique Barres Horizontales - Top 5 Garages**
Identifiez rapidement vos 5 garages les plus actifs

#### 5️⃣ **Cercle de Progression - Taux de Complétion**
Visualisez votre taux de devis terminés avec une animation circulaire

### 📈 Statistiques en Temps Réel
- **Total Devis** - Nombre total de devis enregistrés
- **En Étude** - Nombre de devis en cours d'analyse
- **Validés** - Nombre de devis approuvés
- **Terminés** - Nombre de devis complétés
- **Montant Total** - Somme de tous les montants
- **Montant Moyen** - Moyenne par devis

---

## 📋 Colonnes du Dashboard

| Colonne | Description |
|---------|-------------|
| **Date** | Date du devis |
| **N° de Sinistre** | Numéro de sinistre |
| **N° OR** | Numéro d'ordre de réparation |
| **Garage** | Nom du garage |
| **Montant** | Montant en euros (€) |
| **Statut** | En étude / Validé / Terminé |
| **Commentaires** | Notes et commentaires |
| **Actions** | Éditer ✏️ ou Supprimer 🗑️ |

---

## 🚀 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Étapes d'installation

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

---

## 🛠️ Mode Développement

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

Le serveur redémarrera automatiquement à chaque modification de fichier.

---

## 📦 Dépendances

- **express** `^4.18.2` - Framework web minimaliste et rapide
- **body-parser** `^1.20.2` - Parser pour les requêtes HTTP
- **csv-parser** `^3.0.0` - Lecture de fichiers CSV
- **json2csv** `^6.0.0-alpha.2` - Conversion JSON vers CSV
- **multer** `^1.4.5-lts.1` - Gestion des uploads de fichiers
- **Chart.js** `^4.4.0` (CDN) - Bibliothèque de graphiques interactifs

### Dépendances de développement
- **nodemon** `^3.0.1` - Rechargement automatique du serveur

---

## 📁 Structure du Projet

```
DashDevis/
├── server.js              # Serveur Express et API REST complète
├── package.json           # Configuration npm et dépendances
├── README.md              # Documentation (ce fichier)
├── .gitignore            # Fichiers à ignorer par Git
├── data/                 # Dossier de stockage des données
│   └── devis.json        # Fichier de données JSON (créé automatiquement)
├── public/               # Fichiers statiques
│   ├── index.html        # Interface utilisateur avec graphiques
│   ├── styles.css        # Styles CSS responsive
│   └── script.js         # Logique frontend + Chart.js
└── uploads/              # Dossier temporaire pour imports CSV
```

---

## 🔌 API REST Endpoints

### Devis

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/devis` | Récupérer tous les devis |
| `GET` | `/api/devis/:id` | Récupérer un devis spécifique |
| `POST` | `/api/devis` | Créer un nouveau devis |
| `PUT` | `/api/devis/:id` | Mettre à jour un devis |
| `DELETE` | `/api/devis/:id` | Supprimer un devis |

### Import/Export

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/export/csv` | Exporter tous les devis en CSV |
| `POST` | `/api/import/csv` | Importer des devis depuis un CSV |

### Exemples de requêtes

#### Créer un devis

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
    "commentaires": "Premier devis"
  }'
```

#### Mettre à jour un devis

```bash
curl -X PUT http://localhost:3000/api/devis/123456789 \
  -H "Content-Type: application/json" \
  -d '{
    "statut": "Validé"
  }'
```

---

## 📄 Format CSV pour l'Import

Le fichier CSV doit contenir les colonnes suivantes (séparées par des points-virgules `;`) :

```csv
date;numeroSinistre;numeroOR;garage;montant;statut;commentaires
2025-01-15;SIN001;OR123;Garage Martin;1500.50;En étude;Premier devis
2025-01-16;SIN002;OR124;Garage Dupont;2300.00;Validé;Deuxième devis
2025-01-17;SIN003;OR125;Garage Bernard;1800.75;Terminé;Troisième devis
```

### Notes importantes :
- Séparateur : **point-virgule** (`;`)
- Encodage : **UTF-8** avec BOM pour Excel
- Format de date : **YYYY-MM-DD**
- Format de montant : **Nombres décimaux** (point ou virgule)
- Statuts acceptés : `En étude`, `Validé`, `Terminé`

---

## 🌐 Variables d'Environnement

| Variable | Valeur par défaut | Description |
|----------|------------------|-------------|
| `PORT` | `3000` | Port du serveur |

### Exemple d'utilisation

```bash
PORT=8080 npm start
```

---

## 🎨 Captures d'écran

### Dashboard Principal
Interface moderne avec statistiques, graphiques KPI et tableau de gestion

### Graphiques KPI
- **Donut Chart** : Répartition par statut
- **Bar Chart** : Montants par catégorie
- **Line Chart** : Évolution temporelle
- **Horizontal Bar** : Top garages
- **Progress Circle** : Taux de complétion

### Modal d'édition
Formulaire élégant pour créer et modifier les devis

---

## 🔧 Personnalisation

### Modifier les couleurs

Éditez `public/styles.css` pour personnaliser les couleurs :

```css
/* Gradient principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Couleurs des statuts */
.status-etude { background: #dbeafe; color: #1e40af; }
.status-valide { background: #d1fae5; color: #065f46; }
.status-termine { background: #e5e7eb; color: #374151; }
```

### Ajouter de nouveaux graphiques

Éditez `public/script.js` et utilisez Chart.js :

```javascript
const ctx = document.getElementById('myChart');
const chart = new Chart(ctx, {
    type: 'bar', // ou 'line', 'pie', 'doughnut', etc.
    data: { /* vos données */ },
    options: { /* vos options */ }
});
```

---

## 🚦 Utilisation

### 1. Ajouter un devis
Cliquez sur **➕ Nouveau Devis**, remplissez le formulaire et sauvegardez

### 2. Modifier un devis
Cliquez sur l'icône **✏️** dans la colonne Actions

### 3. Supprimer un devis
Cliquez sur l'icône **🗑️** et confirmez la suppression

### 4. Exporter en CSV
Cliquez sur **📥 Exporter CSV** pour télécharger tous vos devis

### 5. Importer depuis CSV
Cliquez sur **📤 Importer CSV** et sélectionnez votre fichier

### 6. Visualiser les KPI
Les graphiques se mettent à jour automatiquement après chaque action

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que Node.js est installé
node --version

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Les graphiques ne s'affichent pas
- Vérifiez votre connexion internet (Chart.js est chargé via CDN)
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Erreur d'import CSV
- Vérifiez que le séparateur est bien un point-virgule (`;`)
- Assurez-vous que l'encodage est UTF-8
- Vérifiez que les noms de colonnes correspondent

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une **branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

---

## 📝 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

## 🙏 Remerciements

- **Chart.js** - Pour les magnifiques graphiques interactifs
- **Express.js** - Pour le framework web robuste
- **Node.js** - Pour l'environnement d'exécution

---

## 👨‍💻 Auteur

Créé avec ❤️ pour une gestion efficace et visuelle des devis

---

## 🔗 Liens Utiles

- [Documentation Chart.js](https://www.chartjs.org/docs/latest/)
- [Documentation Express](https://expressjs.com/)
- [Documentation Node.js](https://nodejs.org/docs/)
- [Guide CSV](https://www.ietf.org/rfc/rfc4180.txt)

---

## 📊 Statistiques du Projet

- **Langages** : JavaScript, HTML, CSS
- **Framework Backend** : Express.js
- **Bibliothèque Graphiques** : Chart.js
- **Stockage** : JSON (fichier local)
- **Format d'échange** : CSV

---

## 🎯 Roadmap Future

- [ ] Authentification utilisateur
- [ ] Base de données (MongoDB/PostgreSQL)
- [ ] Export PDF des devis
- [ ] Notifications par email
- [ ] API GraphQL
- [ ] Mode sombre
- [ ] Multi-langue (i18n)
- [ ] Dashboard mobile (PWA)

---

**⭐ Si ce projet vous plaît, n'oubliez pas de lui donner une étoile sur GitHub !**

---

**Version**: 2.0.0 (avec KPI graphiques)  
**Dernière mise à jour**: Novembre 2025
