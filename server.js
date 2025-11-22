const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'devis.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'dashdevis-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000,
        secure: false // false pour dev, true en prod avec HTTPS
    }
}));

// Créer les dossiers
if (!fs.existsSync('data')) {
    fs.mkdirSync('data', { recursive: true });
}
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

// Initialiser les fichiers
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

if (!fs.existsSync(USERS_FILE)) {
    const defaultUser = {
        id: '1',
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        email: 'admin@dashdevis.com'
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify([defaultUser], null, 2));
    console.log('✅ Utilisateur admin créé: admin / admin123');
}

// Multer config
const upload = multer({ dest: 'uploads/' });

// Middleware auth
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Non autorisé' });
}

// Helpers
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        return [];
    }
}

function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (error) {
        return [];
    }
}

// Routes Auth
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username et password requis' });
    }

    const users = loadUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ 
        success: true, 
        user: { id: user.id, username: user.username, email: user.email }
    });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur déconnexion' });
        }
        res.json({ success: true });
    });
});

app.get('/api/auth/check', (req, res) => {
    if (req.session && req.session.userId) {
        const users = loadUsers();
        const user = users.find(u => u.id === req.session.userId);
        if (user) {
            return res.json({ 
                authenticated: true, 
                user: { id: user.id, username: user.username, email: user.email }
            });
        }
    }
    res.json({ authenticated: false });
});

// Middleware pour pages
app.use((req, res, next) => {
    // Routes publiques
    if (req.path === '/login' || req.path === '/login.html' || req.path.startsWith('/api/auth')) {
        return next();
    }

    // Routes API protégées
    if (req.path.startsWith('/api')) {
        return requireAuth(req, res, next);
    }

    // Pages protégées
    if (req.session && req.session.userId) {
        return next();
    }

    res.redirect('/login');
});

app.use(express.static('public'));

// Routes Devis
app.get('/api/devis', requireAuth, (req, res) => {
    let devis = loadData();
    const { search, statut, dateDebut, dateFin, page = 1, limit = 10 } = req.query;

    if (search) {
        const s = search.toLowerCase();
        devis = devis.filter(d => 
            (d.numeroSinistre && d.numeroSinistre.toLowerCase().includes(s)) ||
            (d.numeroOR && d.numeroOR.toLowerCase().includes(s)) ||
            (d.garage && d.garage.toLowerCase().includes(s)) ||
            (d.commentaires && d.commentaires.toLowerCase().includes(s))
        );
    }

    if (statut && statut !== 'tous') {
        devis = devis.filter(d => d.statut === statut);
    }

    if (dateDebut) {
        devis = devis.filter(d => d.date >= dateDebut);
    }
    if (dateFin) {
        devis = devis.filter(d => d.date <= dateFin);
    }

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

app.get('/api/devis/:id', requireAuth, (req, res) => {
    const devis = loadData();
    const item = devis.find(d => d.id === req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Non trouvé' });
});

app.post('/api/devis', requireAuth, (req, res) => {
    const devis = loadData();
    const newDevis = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        numeroSinistre: req.body.numeroSinistre || '',
        numeroOR: req.body.numeroOR || '',
        garage: req.body.garage || '',
        montant: req.body.montant || 0,
        statut: req.body.statut || 'En étude',
        commentaires: req.body.commentaires || '',
        createdBy: req.session.username,
        createdAt: new Date().toISOString()
    };
    devis.push(newDevis);
    saveData(devis);
    res.status(201).json(newDevis);
});

app.put('/api/devis/:id', requireAuth, (req, res) => {
    const devis = loadData();
    const index = devis.findIndex(d => d.id === req.params.id);

    if (index !== -1) {
        devis[index] = {
            ...devis[index],
            ...req.body,
            id: req.params.id,
            updatedBy: req.session.username,
            updatedAt: new Date().toISOString()
        };
        saveData(devis);
        res.json(devis[index]);
    } else {
        res.status(404).json({ error: 'Non trouvé' });
    }
});

app.delete('/api/devis/:id', requireAuth, (req, res) => {
    let devis = loadData();
    const initialLength = devis.length;
    devis = devis.filter(d => d.id !== req.params.id);

    if (devis.length < initialLength) {
        saveData(devis);
        res.json({ message: 'Supprimé' });
    } else {
        res.status(404).json({ error: 'Non trouvé' });
    }
});

app.get('/api/export/csv', requireAuth, (req, res) => {
    const devis = loadData();
    if (devis.length === 0) {
        return res.status(404).json({ error: 'Aucun devis' });
    }

    try {
        const fields = ['date', 'numeroSinistre', 'numeroOR', 'garage', 'montant', 'statut', 'commentaires'];
        const csvData = parse(devis, { fields, delimiter: ';' });
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.header('Content-Disposition', 'attachment; filename=devis.csv');
        res.send('\ufeff' + csvData);
    } catch (error) {
        res.status(500).json({ error: 'Erreur export' });
    }
});

app.post('/api/import/csv', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Fichier manquant' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
            results.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                date: data.date || new Date().toISOString().split('T')[0],
                numeroSinistre: data.numeroSinistre || '',
                numeroOR: data.numeroOR || '',
                garage: data.garage || '',
                montant: data.montant || '',
                statut: data.statut || 'En étude',
                commentaires: data.commentaires || '',
                createdBy: req.session.username,
                createdAt: new Date().toISOString()
            });
        })
        .on('end', () => {
            const current = loadData();
            saveData([...current, ...results]);
            fs.unlinkSync(req.file.path);
            res.json({ message: 'Importé', imported: results.length });
        })
        .on('error', () => {
            res.status(500).json({ error: 'Erreur import' });
        });
});

app.get('/api/stats', requireAuth, (req, res) => {
    const devis = loadData();
    res.json({
        total: devis.length,
        enEtude: devis.filter(d => d.statut === 'En étude').length,
        valides: devis.filter(d => d.statut === 'Validé').length,
        termines: devis.filter(d => d.statut === 'Terminé').length,
        montantTotal: devis.reduce((s, d) => s + parseFloat(d.montant || 0), 0),
        montantMoyen: devis.length > 0 ? devis.reduce((s, d) => s + parseFloat(d.montant || 0), 0) / devis.length : 0
    });
});

app.listen(PORT, () => {
    console.log(`🚀 DashDevis v2.2 - http://localhost:${PORT}`);
    console.log(`🔐 Login: admin / admin123`);
});
