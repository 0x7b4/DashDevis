let devisData = [];
let charts = {};
let currentPage = 1;
let limit = 10;
let sortField = 'date';
let sortOrder = 'desc';

document.addEventListener('DOMContentLoaded', () => {
  loadDevis();
  setDefaultDate();
});

async function loadDevis() {
  try {
    const search = document.getElementById('searchInput').value;
    const statut = document.getElementById('statutFilter').value;
    const dateDebut = document.getElementById('dateDebut').value;
    const dateFin = document.getElementById('dateFin').value;

    const params = new URLSearchParams({ page: currentPage, limit });
    if (search) params.append('search', search);
    if (statut && statut !== 'tous') params.append('statut', statut);
    if (dateDebut) params.append('dateDebut', dateDebut);
    if (dateFin) params.append('dateFin', dateFin);

    const res = await fetch('/api/devis?' + params.toString());
    const result = await res.json();
    devisData = result.data || [];
    renderTable();
    renderPagination(result.pagination);
    await loadStats();
    updateCharts();
  } catch (e) {
    console.error(e);
  }
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const s = await res.json();
    document.getElementById('totalDevis').textContent = s.total;
    document.getElementById('enEtude').textContent = s.enEtude;
    document.getElementById('valides').textContent = s.valides;
    document.getElementById('termines').textContent = s.termines;
    document.getElementById('montantTotal').textContent = formatMontant(s.montantTotal);
    document.getElementById('montantMoyen').textContent = formatMontant(s.montantMoyen);
  } catch (e) {
    console.error(e);
  }
}

function renderTable() {
  const tbody = document.getElementById('devisTableBody');
  tbody.innerHTML = '';
  if (!devisData.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:#94a3b8;">Aucun devis</td></tr>';
    return;
  }
  devisData.forEach(d => {
    const tr = document.createElement('tr');
    const statusClass = d.statut === 'En étude' ? 'status-etude' : d.statut === 'Validé' ? 'status-valide' : 'status-termine';
    tr.innerHTML = `
      <td>${formatDate(d.date)}</td>
      <td>${d.numeroSinistre}</td>
      <td>${d.numeroOR}</td>
      <td>${d.garage}</td>
      <td>${formatMontant(d.montant)}</td>
      <td><span class="status-badge ${statusClass}">${d.statut}</span></td>
      <td>${d.commentaires || ''}</td>
      <td class="actions">
        <button class="btn btn-edit" onclick="editDevis('${d.id}')">✏️</button>
        <button class="btn btn-danger" onclick="deleteDevis('${d.id}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPagination(p) {
  const div = document.getElementById('pagination');
  if (!p || p.totalPages <= 1) {
    div.innerHTML = '';
    return;
  }
  let html = `<div class="pagination-info">Page ${p.page} / ${p.totalPages} (${p.total} devis)</div><div class="pagination-buttons">`;
  if (p.page > 1) html += `<button class="btn btn-secondary" onclick="changePage(${p.page - 1})">◀ Précédent</button>`;
  for (let i = 1; i <= p.totalPages; i++) {
    const active = i === p.page ? 'active' : '';
    html += `<button class="btn btn-secondary ${active}" onclick="changePage(${i})">${i}</button>`;
  }
  if (p.page < p.totalPages) html += `<button class="btn btn-secondary" onclick="changePage(${p.page + 1})">Suivant ▶</button>`;
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
  if (sortField === field) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  else { sortField = field; sortOrder = 'asc'; }

  devisData.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (field === 'montant') {
      valA = parseFloat(valA || 0);
      valB = parseFloat(valB || 0);
    }
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  renderTable();
}

function updateCharts() {
  const ctx = document.getElementById('statusChart');
  if (!ctx) return;

  const enEtude = parseInt(document.getElementById('enEtude').textContent) || 0;
  const valides = parseInt(document.getElementById('valides').textContent) || 0;
  const termines = parseInt(document.getElementById('termines').textContent) || 0;

  if (charts.status) charts.status.destroy();

  charts.status = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['En étude', 'Validé', 'Terminé'],
      datasets: [{
        label: 'Nombre de devis',
        data: [enEtude, valides, termines],
        backgroundColor: ['#3b82f6', '#10b981', '#6b7280'],
        borderRadius: 6,
        barThickness: 28,
        maxBarThickness: 32
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `${ctx.parsed.y} devis` }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: { color: '#e5e7eb' }
        },
        x: { grid: { display: false } }
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
  const d = devisData.find(x => x.id === id);
  if (!d) return;
  document.getElementById('modalTitle').textContent = 'Modifier';
  document.getElementById('devisId').value = d.id;
  document.getElementById('date').value = d.date;
  document.getElementById('numeroSinistre').value = d.numeroSinistre;
  document.getElementById('numeroOR').value = d.numeroOR;
  document.getElementById('garage').value = d.garage;
  document.getElementById('montant').value = d.montant;
  document.getElementById('statut').value = d.statut;
  document.getElementById('commentaires').value = d.commentaires || '';
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
  const res = await fetch(id ? `/api/devis/${id}` : '/api/devis', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    closeModal();
    loadDevis();
    showNotification('✅ Sauvegardé');
  }
}

async function deleteDevis(id) {
  if (!confirm('Supprimer ce devis ?')) return;
  const res = await fetch(`/api/devis/${id}`, { method: 'DELETE' });
  if (res.ok) {
    loadDevis();
    showNotification('🗑️ Supprimé');
  }
}

async function exportCSV() {
  try {
    const res = await fetch('/api/export/csv');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showNotification('📥 Exporté');
  } catch (e) { alert('Erreur export'); }
}

async function importCSV(e) {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch('/api/import/csv', { method: 'POST', body: formData });
    const result = await res.json();
    loadDevis();
    showNotification(`📤 ${result.imported} importés`);
  } catch (e) { alert('Erreur import'); }
  e.target.value = '';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = e => {
  if (e.target === document.getElementById('modal')) closeModal();
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR');
}

function formatMontant(m) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(m || 0);
}

function setDefaultDate() {
  document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

function showNotification(msg) {
  const n = document.createElement('div');
  n.textContent = msg;
  n.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:15px 25px;border-radius:10px;z-index:10000;box-shadow:0 10px 25px rgba(0,0,0,0.2);';
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2500);
}
