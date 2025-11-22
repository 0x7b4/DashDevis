

function updateStatusChart() {
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
                barThickness: 28,      // barres plus fines
                maxBarThickness: 32
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // on laisse le CSS contrôler la taille
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} devis`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { display: true, color: '#e5e7eb' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}
