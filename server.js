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
    secret: 'dashdevis-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Créer les dossiers nécessaires
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Initialiser les fichiers
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
if (!fs.existsSync(USERS_FILE)) {
    // Créer un utilisateur par défaut: admin / admin123
    const defaultUser = {
        id: '1',
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        email: 'admin@dashdevis.com'
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify([defaultUser], null, 2));
}

// Configuration Multer
const upload = multer({ dest: 'uploads/' });

// Middleware d'authentification
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Non autorisé' });
}

// Fonctions helpers
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

// Routes d'authentification
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ 
        success: true, 
        user: { id: user.id, username: user.username, email: user.email }
    });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/auth/check', (req, res) => {
    if (req.session && req.session.userId) {
        const users = loadUsers();
        const user = users.find(u => u.id === req.session.userId);
        res.json({ 
            authenticated: true, 
            user: { id: user.id, username: user.username, email: user.email }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Servir la page de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Middleware pour servir les fichiers statiques seulement si authentifié
app.use((req, res, next) => {
    if (req.path === '/login' || req.path.startsWith('/api/auth')) {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return requireAuth(req, res, next);
    }
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
});

app.use(express.static('public'));

// Routes API Devis (protégées)
app.get('/api/devis', requireAuth, (req, res) => {
    const devis = loadData();

    // Filtres
    let filtered = devis;
    const { search, statut, dateDebut, dateFin, page = 1, limit = 10 } = req.query;

    // Recherche globale
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(d => 
            d.numeroSinistre.toLowerCase().includes(searchLower) ||
            d.numeroOR.toLowerCase().includes(searchLower) ||
            d.garage.toLowerCase().includes(searchLower) ||
            d.commentaires.toLowerCase().includes(searchLower)
        );
    }

    // Filtre par statut
    if (statut && statut !== 'tous') {
        filtered = filtered.filter(d => d.statut === statut);
    }

    // Filtre par date
    if (dateDebut) {
        filtered = filtered.filter(d => d.date >= dateDebut);
    }
    if (dateFin) {
        filtered = filtered.filter(d => d.date <= dateFin);
    }

    // Pagination
    const total = filtered.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginated = filtered.slice(startIndex, endIndex);

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
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Devis non trouvé' });
    }
});

app.post('/api/devis', requireAuth, (req, res) => {
    const devis = loadData();
    const newDevis = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        numeroSinistre: req.body.numeroSinistre,
        numeroOR: req.body.numeroOR,
        garage: req.body.garage,
        montant: req.body.montant,
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
            date: req.body.date,
            numeroSinistre: req.body.numeroSinistre,
            numeroOR: req.body.numeroOR,
            garage: req.body.garage,
            montant: req.body.montant,
            statut: req.body.statut,
            commentaires: req.body.commentaires,
            updatedBy: req.session.username,
            updatedAt: new Date().toISOString()
        };
        saveData(devis);
        res.json(devis[index]);
    } else {
        res.status(404).json({ error: 'Devis non trouvé' });
    }
});

app.delete('/api/devis/:id', requireAuth, (req, res) => {
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
app.get('/api/export/csv', requireAuth, (req, res) => {
    const devis = loadData();

    if (devis.length === 0) {
        return res.status(404).json({ error: 'Aucun devis à exporter' });
    }

    try {
        const fields = ['date', 'numeroSinistre', 'numeroOR', 'garage', 'montant', 'statut', 'commentaires'];
        const opts = { fields, delimiter: ';' };
        const csvData = parse(devis, opts);

        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.header('Content-Disposition', 'attachment; filename=devis_export.csv');
        res.send('\ufeff' + csvData);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'export' });
    }
});

// Import CSV
app.post('/api/import/csv', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
            const normalized = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                date: data.date || data.Date || new Date().toISOString().split('T')[0],
                numeroSinistre: data.numeroSinistre || data['N° de Sinistre'] || '',
                numeroOR: data.numeroOR || data['N° OR'] || '',
                garage: data.garage || data.Garage || '',
                montant: data.montant || data.Montant || '',
                statut: data.statut || data.Statut || 'En étude',
                commentaires: data.commentaires || data.Commentaires || '',
                createdBy: req.session.username,
                createdAt: new Date().toISOString()
            };
            results.push(normalized);
        })
        .on('end', () => {
            const currentDevis = loadData();
            const updatedDevis = [...currentDevis, ...results];
            saveData(updatedDevis);

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

// Statistiques
app.get('/api/stats', requireAuth, (req, res) => {
    const devis = loadData();

    const stats = {
        total: devis.length,
        enEtude: devis.filter(d => d.statut === 'En étude').length,
        valides: devis.filter(d => d.statut === 'Validé').length,
        termines: devis.filter(d => d.statut === 'Terminé').length,
        montantTotal: devis.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0),
        montantMoyen: devis.length > 0 ? devis.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0) / devis.length : 0
    };

    res.json(stats);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur DashDevis v2.2 démarré sur http://localhost:${PORT}`);
    console.log(`📊 Dashboard accessible après authentification`);
    console.log(`🔐 Identifiants par défaut: admin / admin123`);
});
