document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin Dashboard: Initializing Charts...');

    
    const revenueCanvas = document.getElementById('revenueChart');
    const destCanvas = document.getElementById('destinationChart');

    if (!revenueCanvas || !destCanvas) {
        return;
    }

    const revenueData = JSON.parse(revenueCanvas.getAttribute('data-revenue') || '[]');
    const destinationData = JSON.parse(destCanvas.getAttribute('data-destinations') || '[]');

    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load!');
        return;
    }

    const revenueCtx = revenueCanvas.getContext('2d');
    const labels = revenueData.map(r => r.Month);
    const values = revenueData.map(r => r.Revenue);

    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita (R$)',
                data: values,
                borderColor: '#8DD3BB',
                backgroundColor: 'rgba(141, 211, 187, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#8DD3BB',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    const destCtx = destCanvas.getContext('2d');
    const dLabels = destinationData.map(d => d.Destination);
    const dValues = destinationData.map(d => d.Count);

    new Chart(destCtx, {
        type: 'doughnut',
        data: {
            labels: dLabels,
            datasets: [{
                data: dValues,
                backgroundColor: [
                    '#8DD3BB',
                    '#FF8682',
                    '#112211',
                    '#FFD700',
                    '#4169E1'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            cutout: '70%'
        }
    });
});
