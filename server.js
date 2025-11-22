const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'devis.json');

// Configuration
app.use(bodyParser.json());
app.use(express.static('public'));

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

// Initialiser le fichier de données s'il n'existe pas
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Configuration Multer pour l'upload CSV
const upload = multer({ dest: 'uploads/' });

// Fonction de sauvegarde automatique
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Fonction de lecture des données
function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Routes API

// GET - Récupérer tous les devis
app.get('/api/devis', (req, res) => {
    const devis = loadData();
    res.json(devis);
});

// GET - Récupérer un devis par ID
app.get('/api/devis/:id', (req, res) => {
    const devis = loadData();
    const item = devis.find(d => d.id === req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Devis non trouvé' });
    }
});

// POST - Créer un nouveau devis
app.post('/api/devis', (req, res) => {
    const devis = loadData();
    const newDevis = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        numeroSinistre: req.body.numeroSinistre,
        numeroOR: req.body.numeroOR,
        garage: req.body.garage,
        montant: req.body.montant,
        statut: req.body.statut || 'En étude',
        commentaires: req.body.commentaires || ''
    };
    devis.push(newDevis);
    saveData(devis);
    res.status(201).json(newDevis);
});

// PUT - Mettre à jour un devis
app.put('/api/devis/:id', (req, res) => {
    const devis = loadData();
    const index = devis.findIndex(d => d.id === req.params.id);

    if (index !== -1) {
        devis[index] = {
            ...devis[index],
            date: req.body.date,
            numeroSinistre: req.body.numeroSinistre,
            numeroOR: req.body.numeroOR,
            garage: req.body.garage,
            montant: req.body.montant,
            statut: req.body.statut,
            commentaires: req.body.commentaires
        };
        saveData(devis);
        res.json(devis[index]);
    } else {
        res.status(404).json({ error: 'Devis non trouvé' });
    }
});

// DELETE - Supprimer un devis
app.delete('/api/devis/:id', (req, res) => {
    let devis = loadData();
    const initialLength = devis.length;
    devis = devis.filter(d => d.id !== req.params.id);

    if (devis.length < initialLength) {
        saveData(devis);
        res.json({ message: 'Devis supprimé avec succès' });
    } else {
        res.status(404).json({ error: 'Devis non trouvé' });
    }
});

// Export CSV
app.get('/api/export/csv', (req, res) => {
    const devis = loadData();

    if (devis.length === 0) {
        return res.status(404).json({ error: 'Aucun devis à exporter' });
    }

    try {
        const fields = ['date', 'numeroSinistre', 'numeroOR', 'garage', 'montant', 'statut', 'commentaires'];
        const opts = { fields, delimiter: ';' };
        const csv = parse(devis, opts);

        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.header('Content-Disposition', 'attachment; filename=devis_export.csv');
        res.send('\ufeff' + csv); // BOM pour Excel
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'export' });
    }
});

// Import CSV
app.post('/api/import/csv', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
            // Normaliser les noms de colonnes
            const normalized = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                date: data.date || data.Date || new Date().toISOString().split('T')[0],
                numeroSinistre: data.numeroSinistre || data['N° de Sinistre'] || '',
                numeroOR: data.numeroOR || data['N° OR'] || '',
                garage: data.garage || data.Garage || '',
                montant: data.montant || data.Montant || '',
                statut: data.statut || data.Statut || 'En étude',
                commentaires: data.commentaires || data.Commentaires || ''
            };
            results.push(normalized);
        })
        .on('end', () => {
            const currentDevis = loadData();
            const updatedDevis = [...currentDevis, ...results];
            saveData(updatedDevis);

            // Supprimer le fichier uploadé
            fs.unlinkSync(req.file.path);

            res.json({ 
                message: `${results.length} devis importés avec succès`,
                imported: results.length 
            });
        })
        .on('error', (error) => {
            res.status(500).json({ error: 'Erreur lors de l\'import' });
        });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 Dashboard accessible sur http://localhost:${PORT}`);
});
