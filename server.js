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

app.use(bodyParser.json());
app.use(express.static('public'));

if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

const upload = multer({ dest: 'uploads/' });

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/devis', (req, res) => {
  let devis = loadData();
  const { search, statut, dateDebut, dateFin, page = 1, limit = 10 } = req.query;

  if (search) {
    const s = search.toLowerCase();
    devis = devis.filter(d =>
      (d.numeroSinistre || '').toLowerCase().includes(s) ||
      (d.numeroOR || '').toLowerCase().includes(s) ||
      (d.garage || '').toLowerCase().includes(s) ||
      (d.commentaires || '').toLowerCase().includes(s)
    );
  }

  if (statut && statut !== 'tous') {
    devis = devis.filter(d => d.statut === statut);
  }

  if (dateDebut) devis = devis.filter(d => d.date >= dateDebut);
  if (dateFin) devis = devis.filter(d => d.date <= dateFin);

  const total = devis.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;
  const paginated = devis.slice(start, start + limitNum);

  res.json({
    data: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

app.post('/api/devis', (req, res) => {
  const devis = loadData();
  const d = req.body;
  const newDevis = {
    id: Date.now().toString(),
    date: d.date || new Date().toISOString().split('T')[0],
    numeroSinistre: d.numeroSinistre || '',
    numeroOR: d.numeroOR || '',
    garage: d.garage || '',
    montant: d.montant || 0,
    statut: d.statut || 'En étude',
    commentaires: d.commentaires || ''
  };
  devis.push(newDevis);
  saveData(devis);
  res.status(201).json(newDevis);
});

app.put('/api/devis/:id', (req, res) => {
  const devis = loadData();
  const index = devis.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Non trouvé' });

  devis[index] = { ...devis[index], ...req.body, id: req.params.id };
  saveData(devis);
  res.json(devis[index]);
});

app.delete('/api/devis/:id', (req, res) => {
  let devis = loadData();
  const initial = devis.length;
  devis = devis.filter(d => d.id !== req.params.id);
  if (devis.length === initial) return res.status(404).json({ error: 'Non trouvé' });
  saveData(devis);
  res.json({ message: 'Supprimé' });
});

app.get('/api/stats', (req, res) => {
  const devis = loadData();
  const total = devis.length;
  const enEtude = devis.filter(d => d.statut === 'En étude').length;
  const valides = devis.filter(d => d.statut === 'Validé').length;
  const termines = devis.filter(d => d.statut === 'Terminé').length;
  const montantTotal = devis.reduce((s, d) => s + parseFloat(d.montant || 0), 0);
  const montantMoyen = total > 0 ? montantTotal / total : 0;
  res.json({ total, enEtude, valides, termines, montantTotal, montantMoyen });
});

app.get('/api/export/csv', (req, res) => {
  const devis = loadData();
  if (!devis.length) return res.status(404).json({ error: 'Aucun devis' });
  try {
    const fields = ['date', 'numeroSinistre', 'numeroOR', 'garage', 'montant', 'statut', 'commentaires'];
    const csvData = parse(devis, { fields, delimiter: ';' });
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', 'attachment; filename=devis.csv');
    res.send('﻿' + csvData);
  } catch (e) {
    res.status(500).json({ error: 'Erreur export' });
  }
});


app.post('/api/import/csv', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Fichier manquant' });
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: ';' }))
    .on('data', data => {
      results.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: data.date || new Date().toISOString().split('T')[0],
        numeroSinistre: data.numeroSinistre || '',
        numeroOR: data.numeroOR || '',
        garage: data.garage || '',
        montant: data.montant || 0,
        statut: data.statut || 'En étude',
        commentaires: data.commentaires || ''
      });
    })
    .on('end', () => {
      const current = loadData();
      saveData([...current, ...results]);
      fs.unlinkSync(req.file.path);
      res.json({ message: 'Importé', imported: results.length });
    })
    .on('error', () => res.status(500).json({ error: 'Erreur import' }));
});

app.listen(PORT, () => {
  console.log(`🚀 DashDevis simple sur http://localhost:${PORT}`);
});
