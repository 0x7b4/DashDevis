let devisData = [];

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadDevis();
    setDefaultDate();
});

// Fonction pour charger tous les devis
async function loadDevis() {
    try {
        const response = await fetch('/api/devis');
        devisData = await response.json();
        renderTable();
        updateStats();
    } catch (error) {
        console.error('Erreur lors du chargement des devis:', error);
        alert('Erreur lors du chargement des données');
    }
}

// Fonction pour afficher les données dans le tableau
function renderTable() {
    const tbody = document.getElementById('devisTableBody');
    tbody.innerHTML = '';

    if (devisData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #94a3b8;">Aucun devis enregistré. Cliquez sur "Nouveau Devis" pour commencer.</td></tr>';
        return;
    }

    devisData.forEach(devis => {
        const tr = document.createElement('tr');

        const statusClass = 
            devis.statut === 'En étude' ? 'status-etude' :
            devis.statut === 'Validé' ? 'status-valide' : 'status-termine';

        tr.innerHTML = `
            <td>${formatDate(devis.date)}</td>
            <td>${devis.numeroSinistre}</td>
            <td>${devis.numeroOR}</td>
            <td>${devis.garage}</td>
            <td>${formatMontant(devis.montant)}</td>
            <td><span class="status-badge ${statusClass}">${devis.statut}</span></td>
            <td>${devis.commentaires}</td>
            <td class="actions">
                <button onclick="editDevis('${devis.id}')" class="btn btn-edit">✏️</button>
                <button onclick="deleteDevis('${devis.id}')" class="btn btn-danger">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Mettre à jour les statistiques
function updateStats() {
    document.getElementById('totalDevis').textContent = devisData.length;
    document.getElementById('enEtude').textContent = devisData.filter(d => d.statut === 'En étude').length;
    document.getElementById('valides').textContent = devisData.filter(d => d.statut === 'Validé').length;
    document.getElementById('termines').textContent = devisData.filter(d => d.statut === 'Terminé').length;
}

// Afficher le modal pour ajouter un devis
function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Nouveau Devis';
    document.getElementById('devisForm').reset();
    document.getElementById('devisId').value = '';
    setDefaultDate();
    document.getElementById('modal').style.display = 'block';
}

// Éditer un devis
function editDevis(id) {
    const devis = devisData.find(d => d.id === id);
    if (!devis) return;

    document.getElementById('modalTitle').textContent = 'Modifier le Devis';
    document.getElementById('devisId').value = devis.id;
    document.getElementById('date').value = devis.date;
    document.getElementById('numeroSinistre').value = devis.numeroSinistre;
    document.getElementById('numeroOR').value = devis.numeroOR;
    document.getElementById('garage').value = devis.garage;
    document.getElementById('montant').value = devis.montant;
    document.getElementById('statut').value = devis.statut;
    document.getElementById('commentaires').value = devis.commentaires;

    document.getElementById('modal').style.display = 'block';
}

// Sauvegarder un devis (créer ou mettre à jour)
async function saveDevis(event) {
    event.preventDefault();

    const id = document.getElementById('devisId').value;
    const devisData = {
        date: document.getElementById('date').value,
        numeroSinistre: document.getElementById('numeroSinistre').value,
        numeroOR: document.getElementById('numeroOR').value,
        garage: document.getElementById('garage').value,
        montant: document.getElementById('montant').value,
        statut: document.getElementById('statut').value,
        commentaires: document.getElementById('commentaires').value
    };

    try {
        let response;
        if (id) {
            // Mise à jour
            response = await fetch(`/api/devis/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devisData)
            });
        } else {
            // Création
            response = await fetch('/api/devis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devisData)
            });
        }

        if (response.ok) {
            closeModal();
            loadDevis();
            showNotification('Devis sauvegardé avec succès! ✅');
        } else {
            alert('Erreur lors de la sauvegarde');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la sauvegarde');
    }
}

// Supprimer un devis
async function deleteDevis(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
        return;
    }

    try {
        const response = await fetch(`/api/devis/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadDevis();
            showNotification('Devis supprimé avec succès! 🗑️');
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// Exporter en CSV
async function exportCSV() {
    try {
        const response = await fetch('/api/export/csv');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devis_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('Export CSV réussi! 📥');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'export CSV');
    }
}

// Importer un CSV
async function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/import/csv', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            loadDevis();
            showNotification(`${result.imported} devis importés avec succès! 📤`);
        } else {
            alert('Erreur lors de l\'import: ' + result.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'import CSV');
    }

    // Réinitialiser l'input file
    event.target.value = '';
}

// Fermer le modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Fonction utilitaire pour formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Fonction utilitaire pour formater le montant
function formatMontant(montant) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(montant);
}

// Définir la date par défaut à aujourd'hui
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Notification toast
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
