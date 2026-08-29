document.addEventListener("DOMContentLoaded", () => {
  const revenueCanvas = document.getElementById("revenueChart");
  const destCanvas = document.getElementById("destinationChart");

  if (!revenueCanvas || !destCanvas) return;

  if (typeof Chart === "undefined") {
    console.error("Chart.js failed to load!");
    return;
  }

  const parseDataset = (canvas, attributeName) => {
    try {
      return JSON.parse(canvas.getAttribute(attributeName) || "[]");
    } catch (error) {
      console.error(`Error parsing dataset from ${attributeName}:`, error);
      return [];
    }
  };

  const revenueData = parseDataset(revenueCanvas, "data-revenue");
  const destinationData = parseDataset(destCanvas, "data-destinations");

  const renderRevenueChart = (canvas, data) => {
    const ctx = canvas.getContext("2d");
    const labels = data.map((item) => item.Month);
    const values = data.map((item) => item.Revenue);

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Receita (R$)",
            data: values,
            borderColor: "#8DD3BB",
            backgroundColor: "rgba(141, 211, 187, 0.2)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: "#8DD3BB",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: {
              callback: (value) => `R$ ${value.toLocaleString("pt-BR")}`,
            },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  };

  const renderDestinationChart = (canvas, data) => {
    const ctx = canvas.getContext("2d");
    const labels = data.map((item) => item.Destination);
    const values = data.map((item) => item.Count);

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "#8DD3BB",
              "#FF8682",
              "#112211",
              "#FFD700",
              "#4169E1",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        cutout: "70%",
      },
    });
  };

  renderRevenueChart(revenueCanvas, revenueData);
  renderDestinationChart(destCanvas, destinationData);
});
