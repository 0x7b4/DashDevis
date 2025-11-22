# 🚀 Guide de Déploiement sur Render.com

## Étape 1 : Créer un compte Render (gratuit)

1. Allez sur [https://render.com](https://render.com)
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec votre compte GitHub

## Étape 2 : Déployer votre application

### Option A : Déploiement automatique (RECOMMANDÉ)

1. Une fois connecté, cliquez sur **"New +"** puis **"Web Service"**
2. Connectez votre repository GitHub : **0x7b4/DashDevis**
3. Render détectera automatiquement qu'il s'agit d'une app Node.js

### Configuration automatique :
- **Name** : `dashdevis` (ou le nom de votre choix)
- **Region** : Choisissez la plus proche (ex: Frankfurt)
- **Branch** : `main`
- **Build Command** : `npm install` (déjà configuré)
- **Start Command** : `npm start` (déjà configuré)
- **Instance Type** : **Free** (750h/mois gratuit)

4. Cliquez sur **"Create Web Service"**

### ⏱️ Temps de déploiement : 2-3 minutes

Render va :
- ✅ Cloner votre repository
- ✅ Installer les dépendances (`npm install`)
- ✅ Démarrer le serveur (`npm start`)
- ✅ Générer une URL publique (ex: `https://dashdevis.onrender.com`)

## Étape 3 : Accéder à votre application

Une fois le déploiement terminé, vous recevrez une URL du type :
```
https://dashdevis-xxxx.onrender.com
```

🎉 **Votre dashboard est en ligne et accessible publiquement !**

## 📝 Notes importantes

### ⚠️ Instance gratuite :
- Se met en veille après 15 minutes d'inactivité
- Prend 30-60 secondes pour se réveiller au premier accès
- Limite : 750 heures/mois (suffisant pour usage personnel)

### 🔄 Déploiement automatique :
- Chaque fois que vous faites un `git push` sur GitHub
- Render redéploie automatiquement votre application
- Pas besoin de configuration supplémentaire !

### 💾 Données :
- Les données dans `data/devis.json` seront réinitialisées à chaque déploiement
- Pour persistance, ajoutez un disque Render (payant) ou utilisez une base de données

## 🔧 Configuration avancée (optionnelle)

### Ajouter des variables d'environnement :
1. Dans le dashboard Render, allez dans votre service
2. Onglet **"Environment"**
3. Ajoutez vos variables (ex: `PORT=3000`)

### Ajouter un disque persistant :
1. Onglet **"Disks"**
2. **"Add Disk"**
3. Mount Path : `/app/data`
4. Taille : 1GB (gratuit)

## 🆘 Dépannage

### Le déploiement échoue ?
- Vérifiez les logs dans l'onglet **"Logs"**
- Assurez-vous que `package.json` contient le script `start`

### L'app ne démarre pas ?
- Vérifiez que le port est bien configuré avec `process.env.PORT`
- Dans votre `server.js` : `const PORT = process.env.PORT || 3000;`

### Données perdues après redémarrage ?
- C'est normal avec le système de fichiers éphémère
- Ajoutez un disque persistant ou migrez vers une base de données

## 🎯 Alternatives si Render ne fonctionne pas

### Railway.app
1. [https://railway.app](https://railway.app)
2. Connectez GitHub
3. Deploy from repo
4. Sélectionnez DashDevis

### Fly.io
```bash
# Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# Déployer
cd DashDevis
fly launch
fly deploy
```

---

**Besoin d'aide ?** Demandez-moi et je vous guiderai davantage ! 🚀
