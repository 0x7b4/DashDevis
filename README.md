# 📊 DashDevis - Dashboard de Gestion de Devis

Application web Node.js complète pour gérer vos devis avec une interface moderne et intuitive.

## ✨ Fonctionnalités

- ✅ **CRUD complet** : Créer, lire, modifier et supprimer des devis
- 💾 **Sauvegarde automatique** : Toutes les modifications sont automatiquement sauvegardées
- 📥 **Export CSV** : Exportez tous vos devis au format CSV
- 📤 **Import CSV** : Importez des devis depuis un fichier CSV
- 📊 **Statistiques en temps réel** : Visualisez le nombre de devis par statut
- 🎨 **Interface moderne** : Design responsive et agréable
- 🔍 **Gestion des statuts** : En étude, Validé, Terminé

## 📋 Colonnes du Dashboard

- **Date** : Date du devis
- **N° de Sinistre** : Numéro de sinistre
- **N° OR** : Numéro d'ordre de réparation
- **Garage** : Nom du garage
- **Montant** : Montant en euros
- **Statut** : En étude / Validé / Terminé
- **Commentaires** : Notes et commentaires
- **Actions** : Éditer ou supprimer

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/VOTRE_USERNAME/DashDevis.git
cd DashDevis
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez le serveur :
```bash
npm start
```

4. Ouvrez votre navigateur sur : `http://localhost:3000`

## 🛠️ Mode Développement

Pour le développement avec rechargement automatique :
```bash
npm run dev
```

## 📦 Dépendances

- **express** : Framework web
- **body-parser** : Parser pour les requêtes HTTP
- **csv-parser** : Lecture de fichiers CSV
- **json2csv** : Conversion JSON vers CSV
- **multer** : Gestion des uploads de fichiers

## 📁 Structure du Projet

```
DashDevis/
├── server.js           # Serveur Express et API REST
├── package.json        # Configuration npm
├── data/              # Dossier de stockage des données
│   └── devis.json     # Fichier de données (créé automatiquement)
├── public/            # Fichiers statiques
│   ├── index.html     # Interface utilisateur
│   ├── styles.css     # Styles CSS
│   └── script.js      # Logique frontend
└── uploads/           # Dossier temporaire pour imports CSV
```

## 🔌 API Endpoints

- `GET /api/devis` - Récupérer tous les devis
- `GET /api/devis/:id` - Récupérer un devis spécifique
- `POST /api/devis` - Créer un nouveau devis
- `PUT /api/devis/:id` - Mettre à jour un devis
- `DELETE /api/devis/:id` - Supprimer un devis
- `GET /api/export/csv` - Exporter en CSV
- `POST /api/import/csv` - Importer depuis CSV

## 📄 Format CSV pour l'Import

Le fichier CSV doit contenir les colonnes suivantes (séparées par des points-virgules) :

```csv
date;numeroSinistre;numeroOR;garage;montant;statut;commentaires
2025-01-15;SIN001;OR123;Garage Martin;1500.50;En étude;Premier devis
```

## 🌐 Variables d'Environnement

- `PORT` : Port du serveur (défaut: 3000)

Exemple :
```bash
PORT=8080 npm start
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

MIT

## 👨‍💻 Auteur

Créé avec ❤️ pour une gestion efficace des devis

---

**Note** : Les données sont stockées localement dans le fichier `data/devis.json`. Pour un usage en production, envisagez d'utiliser une base de données.
