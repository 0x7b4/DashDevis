# 📊 Données de Démonstration

## Pourquoi le dashboard est vide ?

Après le déploiement, le fichier `data/devis.json` est vide car c'est une nouvelle installation.

## 3 Solutions pour ajouter des données :

### 1️⃣ **Via l'interface (Recommandé)**

1. Connectez-vous : `admin` / `admin123`
2. Cliquez sur "➕ Nouveau Devis"
3. Remplissez le formulaire
4. Enregistrez

### 2️⃣ **Importer un fichier CSV**

Créez un fichier `devis.csv` :

```csv
date;numeroSinistre;numeroOR;garage;montant;statut;commentaires
2025-01-15;SIN001;OR1001;Garage Martin;1500.50;En étude;Premier devis
2025-01-16;SIN002;OR1002;Garage Dupont;2300.00;Validé;Deuxième devis
2025-01-17;SIN003;OR1003;Auto Plus;1800.75;Terminé;Troisième devis
```

Puis importez-le via le bouton "📤 Importer CSV"

### 3️⃣ **Initialiser automatiquement**

Ajoutez ce code dans `server.js` après les imports :

```javascript
// Données de démo
const DEMO_DATA = [
  {
    "id": "1700000100000",
    "date": "2025-11-20",
    "numeroSinistre": "SIN001",
    "numeroOR": "OR1001",
    "garage": "Garage Dupont",
    "montant": "623.45",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000200000",
    "date": "2025-11-18",
    "numeroSinistre": "SIN002",
    "numeroOR": "OR1002",
    "garage": "Auto Plus",
    "montant": "746.9",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000300000",
    "date": "2025-11-16",
    "numeroSinistre": "SIN003",
    "numeroOR": "OR1003",
    "garage": "Garage Rapide",
    "montant": "870.35",
    "statut": "En étude",
    "commentaires": "Devis exemple 3",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000400000",
    "date": "2025-11-14",
    "numeroSinistre": "SIN004",
    "numeroOR": "OR1004",
    "garage": "Carrosserie Pro",
    "montant": "993.8",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000500000",
    "date": "2025-11-12",
    "numeroSinistre": "SIN005",
    "numeroOR": "OR1005",
    "garage": "Garage Central",
    "montant": "1117.25",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000600000",
    "date": "2025-11-10",
    "numeroSinistre": "SIN006",
    "numeroOR": "OR1006",
    "garage": "Meca Expert",
    "montant": "1240.7",
    "statut": "En étude",
    "commentaires": "Devis exemple 6",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000700000",
    "date": "2025-11-08",
    "numeroSinistre": "SIN007",
    "numeroOR": "OR1007",
    "garage": "Garage Martin",
    "montant": "1364.15",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000800000",
    "date": "2025-11-06",
    "numeroSinistre": "SIN008",
    "numeroOR": "OR1008",
    "garage": "Garage Dupont",
    "montant": "1487.6",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000900000",
    "date": "2025-11-04",
    "numeroSinistre": "SIN009",
    "numeroOR": "OR1009",
    "garage": "Auto Plus",
    "montant": "1611.05",
    "statut": "En étude",
    "commentaires": "Devis exemple 9",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001000000",
    "date": "2025-11-02",
    "numeroSinistre": "SIN010",
    "numeroOR": "OR1010",
    "garage": "Garage Rapide",
    "montant": "1734.5",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001100000",
    "date": "2025-10-31",
    "numeroSinistre": "SIN011",
    "numeroOR": "OR1011",
    "garage": "Carrosserie Pro",
    "montant": "1857.95",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001200000",
    "date": "2025-10-29",
    "numeroSinistre": "SIN012",
    "numeroOR": "OR1012",
    "garage": "Garage Central",
    "montant": "1981.4",
    "statut": "En étude",
    "commentaires": "Devis exemple 12",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001300000",
    "date": "2025-10-27",
    "numeroSinistre": "SIN013",
    "numeroOR": "OR1013",
    "garage": "Meca Expert",
    "montant": "2104.85",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001400000",
    "date": "2025-10-25",
    "numeroSinistre": "SIN014",
    "numeroOR": "OR1014",
    "garage": "Garage Martin",
    "montant": "2228.3",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001500000",
    "date": "2025-10-23",
    "numeroSinistre": "SIN015",
    "numeroOR": "OR1015",
    "garage": "Garage Dupont",
    "montant": "2351.75",
    "statut": "En étude",
    "commentaires": "Devis exemple 15",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  }
];

// Après la création du fichier devis.json vide
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEMO_DATA, null, 2));
    console.log('✅ Données de démonstration initialisées');
}
```

## 📄 Données de démonstration

Voici 15 devis exemple à copier dans `data/devis.json` :

```json
[
  {
    "id": "1700000100000",
    "date": "2025-11-20",
    "numeroSinistre": "SIN001",
    "numeroOR": "OR1001",
    "garage": "Garage Dupont",
    "montant": "623.45",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000200000",
    "date": "2025-11-18",
    "numeroSinistre": "SIN002",
    "numeroOR": "OR1002",
    "garage": "Auto Plus",
    "montant": "746.9",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000300000",
    "date": "2025-11-16",
    "numeroSinistre": "SIN003",
    "numeroOR": "OR1003",
    "garage": "Garage Rapide",
    "montant": "870.35",
    "statut": "En étude",
    "commentaires": "Devis exemple 3",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000400000",
    "date": "2025-11-14",
    "numeroSinistre": "SIN004",
    "numeroOR": "OR1004",
    "garage": "Carrosserie Pro",
    "montant": "993.8",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000500000",
    "date": "2025-11-12",
    "numeroSinistre": "SIN005",
    "numeroOR": "OR1005",
    "garage": "Garage Central",
    "montant": "1117.25",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000600000",
    "date": "2025-11-10",
    "numeroSinistre": "SIN006",
    "numeroOR": "OR1006",
    "garage": "Meca Expert",
    "montant": "1240.7",
    "statut": "En étude",
    "commentaires": "Devis exemple 6",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000700000",
    "date": "2025-11-08",
    "numeroSinistre": "SIN007",
    "numeroOR": "OR1007",
    "garage": "Garage Martin",
    "montant": "1364.15",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000800000",
    "date": "2025-11-06",
    "numeroSinistre": "SIN008",
    "numeroOR": "OR1008",
    "garage": "Garage Dupont",
    "montant": "1487.6",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700000900000",
    "date": "2025-11-04",
    "numeroSinistre": "SIN009",
    "numeroOR": "OR1009",
    "garage": "Auto Plus",
    "montant": "1611.05",
    "statut": "En étude",
    "commentaires": "Devis exemple 9",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001000000",
    "date": "2025-11-02",
    "numeroSinistre": "SIN010",
    "numeroOR": "OR1010",
    "garage": "Garage Rapide",
    "montant": "1734.5",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001100000",
    "date": "2025-10-31",
    "numeroSinistre": "SIN011",
    "numeroOR": "OR1011",
    "garage": "Carrosserie Pro",
    "montant": "1857.95",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001200000",
    "date": "2025-10-29",
    "numeroSinistre": "SIN012",
    "numeroOR": "OR1012",
    "garage": "Garage Central",
    "montant": "1981.4",
    "statut": "En étude",
    "commentaires": "Devis exemple 12",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001300000",
    "date": "2025-10-27",
    "numeroSinistre": "SIN013",
    "numeroOR": "OR1013",
    "garage": "Meca Expert",
    "montant": "2104.85",
    "statut": "Validé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001400000",
    "date": "2025-10-25",
    "numeroSinistre": "SIN014",
    "numeroOR": "OR1014",
    "garage": "Garage Martin",
    "montant": "2228.3",
    "statut": "Terminé",
    "commentaires": "",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": "1700001500000",
    "date": "2025-10-23",
    "numeroSinistre": "SIN015",
    "numeroOR": "OR1015",
    "garage": "Garage Dupont",
    "montant": "2351.75",
    "statut": "En étude",
    "commentaires": "Devis exemple 15",
    "createdBy": "admin",
    "createdAt": "2025-11-22T10:00:00.000Z"
  }
]
```

## ⚠️ Note Render.com

Sur Render gratuit, le système de fichiers est **éphémère**. Les données sont perdues à chaque redémarrage.

**Solutions** :
- Ajoutez un **disque persistant** (1GB gratuit)
- Ou migrez vers **PostgreSQL** (recommandé pour production)
