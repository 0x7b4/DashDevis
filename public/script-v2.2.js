let devisData = [];
let filteredData = [];
let charts = {};
let currentPage = 1;
let limit = 10;
let sortField = 'date';
let sortOrder = 'desc';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setDefaultDate();
});

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (data.authenticated) {
            document.getElementById('userInfo').textContent = `👤 ${data.user.username}`;
            loadDevis();
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        window.location.href = '/login';
    }
}

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
}

async function loadDevis() {
    try {
        const search = document.getElementById('searchInput').value;
        const statut = document.getElementById('statutFilter').value;
        const dateDebut = document.getElementById('dateDebut').value;
        const dateFin = document.getElementById('dateFin').value;

        const params = new URLSearchParams({
            page: currentPage,
            limit,
            ...(search && { search }),
            ...(statut !== 'tous' && { statut }),
            ...(dateDebut && { dateDebut }),
            ...(dateFin && { dateFin })
        });

        const response = await fetch(`/api/devis?${params}`);
        const result = await response.json();

        devisData = result.data;
        renderTable();
        renderPagination(result.pagination);

        await loadStats();
        updateCharts();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        document.getElementById('totalDevis').textContent = stats.total;
        document.getElementById('enEtude').textContent = stats.enEtude;
        document.getElementById('valides').textContent = stats.valides;
        document.getElementById('termines').textContent = stats.termines;
        document.getElementById('montantTotal').textContent = formatMontant(stats.montantTotal);
        document.getElementById('montantMoyen').textContent = formatMontant(stats.montantMoyen);
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}

function renderTable() {
    const tbody = document.getElementById('devisTableBody');
    tbody.innerHTML = '';

    if (devisData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:#94a3b8;">Aucun devis</td></tr>';
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

function renderPagination(pagination) {
    const div = document.getElementById('pagination');
    if (!pagination || pagination.totalPages <= 1) {
        div.innerHTML = '';
        return;
    }

    let html = `<div class="pagination-info">Page ${pagination.page} / ${pagination.totalPages} (${pagination.total} devis)</div><div class="pagination-buttons">`;

    if (pagination.page > 1) {
        html += `<button onclick="changePage(${pagination.page - 1})" class="btn btn-secondary">◀ Précédent</button>`;
    }

    for (let i = 1; i <= Math.min(pagination.totalPages, 5); i++) {
        const active = i === pagination.page ? 'active' : '';
        html += `<button onclick="changePage(${i})" class="btn btn-secondary ${active}">${i}</button>`;
    }

    if (pagination.page < pagination.totalPages) {
        html += `<button onclick="changePage(${pagination.page + 1})" class="btn btn-secondary">Suivant ▶</button>`;
    }

    html += '</div>';
    div.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadDevis();
}

function applyFilters() {
    currentPage = 1;
    loadDevis();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statutFilter').value = 'tous';
    document.getElementById('dateDebut').value = '';
    document.getElementById('dateFin').value = '';
    applyFilters();
}

function sortTable(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'asc';
    }

    devisData.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'montant') {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        }

        if (sortOrder === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });

    renderTable();
}

function updateCharts() {
    updateStatusChart();
}

function updateStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const enEtude = parseInt(document.getElementById('enEtude').textContent);
    const valides = parseInt(document.getElementById('valides').textContent);
    const termines = parseInt(document.getElementById('termines').textContent);

    if (charts.status) charts.status.destroy();

    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['En étude', 'Validé', 'Terminé'],
            datasets: [{
                data: [enEtude, valides, termines],
                backgroundColor: ['#3b82f6', '#10b981', '#6b7280'],
                borderWidth: 3,
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
                        padding: 20,
                        font: { size: 14, weight: '600' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
                            const pct = ((ctx.parsed / total) * 100).toFixed(1);
                            return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Nouveau Devis';
    document.getElementById('devisForm').reset();
    document.getElementById('devisId').value = '';
    setDefaultDate();
    document.getElementById('modal').style.display = 'block';
}

function editDevis(id) {
    const devis = devisData.find(d => d.id === id);
    if (!devis) return;

    document.getElementById('modalTitle').textContent = 'Modifier';
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

async function saveDevis(e) {
    e.preventDefault();
    const id = document.getElementById('devisId').value;
    const data = {
        date: document.getElementById('date').value,
        numeroSinistre: document.getElementById('numeroSinistre').value,
        numeroOR: document.getElementById('numeroOR').value,
        garage: document.getElementById('garage').value,
        montant: document.getElementById('montant').value,
        statut: document.getElementById('statut').value,
        commentaires: document.getElementById('commentaires').value
    };

    try {
        const response = await fetch(id ? `/api/devis/${id}` : '/api/devis', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            loadDevis();
            showNotification('✅ Sauvegardé!');
        }
    } catch (error) {
        alert('Erreur');
    }
}

async function deleteDevis(id) {
    if (!confirm('Supprimer ?')) return;
    try {
        await fetch(`/api/devis/${id}`, { method: 'DELETE' });
        loadDevis();
        showNotification('🗑️ Supprimé!');
    } catch (error) {
        alert('Erreur');
    }
}

async function exportCSV() {
    try {
        const response = await fetch('/api/export/csv');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devis_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        showNotification('📥 Exporté!');
    } catch (error) {
        alert('Erreur export');
    }
}

async function importCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('/api/import/csv', { method: 'POST', body: formData });
        const result = await response.json();
        loadDevis();
        showNotification(`📤 ${result.imported} importés!`);
    } catch (error) {
        alert('Erreur import');
    }
    e.target.value = '';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = (e) => {
    if (e.target === document.getElementById('modal')) closeModal();
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('fr-FR');
}

function formatMontant(m) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(m);
}

function setDefaultDate() {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:15px 25px;border-radius:10px;z-index:10000;box-shadow:0 10px 25px rgba(0,0,0,0.2);';
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}
