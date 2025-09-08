const API_URL = "https://68bb0de584055bce63f104d5.mockapi.io/api/v1/dispositivos_IoT";
const recordsTable10 = document.querySelector("#recordsTable10 tbody");
const lastStatus10 = document.querySelector("#lastStatus10 strong");

async function loadLastTen() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const sorted = data.sort((a,b) => new Date(b.date)-new Date(a.date));
    const lastTen = sorted.slice(0,10);

    recordsTable10.innerHTML = "";
    lastTen.forEach(item => {
      recordsTable10.innerHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.status}</td>
          <td>${item.ip}</td>
          <td>${item.date}</td>
        </tr>
      `;
    });

    if (lastTen.length>0) lastStatus10.textContent = lastTen[0].status;
  } catch (err) {
    console.error("Error cargando últimos 10:", err);
  }
}

// Inicializar y refrescar cada 2 segundos
loadLastTen();
setInterval(loadLastTen,2000);
