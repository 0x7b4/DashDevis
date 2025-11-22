let devisData = [];
let charts = {}; // Stocker les instances de graphiques

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
        updateCharts();
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
    const enEtude = devisData.filter(d => d.statut === 'En étude');
    const valides = devisData.filter(d => d.statut === 'Validé');
    const termines = devisData.filter(d => d.statut === 'Terminé');

    const montantTotal = devisData.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);
    const montantMoyen = devisData.length > 0 ? montantTotal / devisData.length : 0;

    document.getElementById('totalDevis').textContent = devisData.length;
    document.getElementById('enEtude').textContent = enEtude.length;
    document.getElementById('valides').textContent = valides.length;
    document.getElementById('termines').textContent = termines.length;
    document.getElementById('montantTotal').textContent = formatMontant(montantTotal);
    document.getElementById('montantMoyen').textContent = formatMontant(montantMoyen);
}

// Mettre à jour tous les graphiques
function updateCharts() {
    updateStatusChart();
    updateAmountChart();
    updateTimelineChart();
    updateGarageChart();
    updateCompletionCircle();
}

// 1. Graphique Donut - Répartition par statut
function updateStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const enEtude = devisData.filter(d => d.statut === 'En étude').length;
    const valides = devisData.filter(d => d.statut === 'Validé').length;
    const termines = devisData.filter(d => d.statut === 'Terminé').length;

    if (charts.status) {
        charts.status.destroy();
    }

    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['En étude', 'Validé', 'Terminé'],
            datasets: [{
                data: [enEtude, valides, termines],
                backgroundColor: [
                    '#3b82f6', // Bleu
                    '#10b981', // Vert
                    '#6b7280'  // Gris
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 2. Graphique Barres - Montants par statut
function updateAmountChart() {
    const ctx = document.getElementById('amountChart');
    if (!ctx) return;

    const enEtudeMontant = devisData
        .filter(d => d.statut === 'En étude')
        .reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);

    const validesMontant = devisData
        .filter(d => d.statut === 'Validé')
        .reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);

    const terminesMontant = devisData
        .filter(d => d.statut === 'Terminé')
        .reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);

    if (charts.amount) {
        charts.amount.destroy();
    }

    charts.amount = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['En étude', 'Validé', 'Terminé'],
            datasets: [{
                label: 'Montant (€)',
                data: [enEtudeMontant, validesMontant, terminesMontant],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#6b7280'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Montant: ${formatMontant(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('fr-FR') + ' €';
                        }
                    }
                }
            }
        }
    });
}

// 3. Graphique Ligne - Évolution temporelle
function updateTimelineChart() {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;

    // Grouper par mois
    const monthlyData = {};

    devisData.forEach(devis => {
        const date = new Date(devis.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                enEtude: 0,
                valide: 0,
                termine: 0,
                total: 0
            };
        }

        if (devis.statut === 'En étude') monthlyData[monthKey].enEtude++;
        else if (devis.statut === 'Validé') monthlyData[monthKey].valide++;
        else if (devis.statut === 'Terminé') monthlyData[monthKey].termine++;

        monthlyData[monthKey].total++;
    });

    // Trier par date
    const sortedMonths = Object.keys(monthlyData).sort();

    const labels = sortedMonths.map(month => {
        const [year, m] = month.split('-');
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        return `${monthNames[parseInt(m) - 1]} ${year}`;
    });

    if (charts.timeline) {
        charts.timeline.destroy();
    }

    charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'En étude',
                    data: sortedMonths.map(m => monthlyData[m].enEtude),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Validé',
                    data: sortedMonths.map(m => monthlyData[m].valide),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Terminé',
                    data: sortedMonths.map(m => monthlyData[m].termine),
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// 4. Graphique Barres Horizontales - Top 5 Garages
function updateGarageChart() {
    const ctx = document.getElementById('garageChart');
    if (!ctx) return;

    // Compter les devis par garage
    const garageCount = {};
    devisData.forEach(devis => {
        const garage = devis.garage || 'Non spécifié';
        garageCount[garage] = (garageCount[garage] || 0) + 1;
    });

    // Top 5 garages
    const sortedGarages = Object.entries(garageCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (charts.garage) {
        charts.garage.destroy();
    }

    charts.garage = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedGarages.map(g => g[0]),
            datasets: [{
                label: 'Nombre de devis',
                data: sortedGarages.map(g => g[1]),
                backgroundColor: '#667eea',
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// 5. Cercle de Progression - Taux de complétion
function updateCompletionCircle() {
    const total = devisData.length;
    const termines = devisData.filter(d => d.statut === 'Terminé').length;
    const percentage = total > 0 ? (termines / total) * 100 : 0;

    const circle = document.getElementById('progressCircle');
    const text = document.getElementById('progressText');

    if (circle && text) {
        const circumference = 2 * Math.PI * 45; // rayon = 45
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDashoffset = offset;
        text.textContent = `${percentage.toFixed(0)}%`;
    }
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
            response = await fetch(`/api/devis/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devisData)
            });
        } else {
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
