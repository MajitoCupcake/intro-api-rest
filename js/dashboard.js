const API_URL = "https://68bb0de584055bce63f104d5.mockapi.io/api/v1/dispositivos_IoT";
const table = document.getElementById("dashboardTable");
const lastStatusDashboard = document.getElementById("lastStatusDashboard");

// Cargar y mostrar últimos 10 registros
async function loadDashboard() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // ordenar por id desc
  const ordered = data.sort((a, b) => Number(b.id) - Number(a.id));
  const last10 = ordered.slice(0, 10);

  table.innerHTML = "";
  last10.forEach(item => {
    table.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.status}</td>
        <td>${item.ip}</td>
        <td>${item.date}</td>
      </tr>`;
  });

  if (ordered.length > 0) {
    lastStatusDashboard.textContent = ordered[0].status;
  }
}

// Polling cada 2 segundos
setInterval(loadDashboard, 2000);
loadDashboard();
