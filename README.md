# 📊 DashDevis - Dashboard de Gestion de Devis

Application Node.js pour gérer vos devis avec interface moderne et graphiques KPI.

## ✨ Fonctionnalités

- ✅ CRUD complet des devis
- 💾 Sauvegarde automatique JSON
- 📥📤 Import/Export CSV
- 📊 2 Graphiques KPI (Donut + Barres)
- 📈 6 Statistiques temps réel
- 🎨 Interface responsive

## 📊 Graphiques KPI

1. **Donut** - Répartition par statut
2. **Barres** - Montants par statut

## 🚀 Installation

```bash
git clone https://github.com/0x7b4/DashDevis.git
cd DashDevis
npm install
npm start
# http://localhost:3000
```

## 🌐 Déploiement Render.com

1. Allez sur [render.com](https://render.com)
2. Connectez votre repo GitHub
3. Déployez en 1 clic (config auto via render.yaml)

## 📋 Colonnes

Date | N° Sinistre | N° OR | Garage | Montant | Statut | Commentaires | Actions

## 🔌 API REST

- `GET /api/devis` - Liste
- `POST /api/devis` - Créer
- `PUT /api/devis/:id` - Modifier
- `DELETE /api/devis/:id` - Supprimer
- `GET /api/export/csv` - Export
- `POST /api/import/csv` - Import

## 📦 Technologies

Node.js • Express • Chart.js • CSV

---

**Version 2.1** avec 2 graphiques KPI optimisés
