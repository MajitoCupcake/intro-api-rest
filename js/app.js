const API_URL = "https://68bb0de584055bce63f104d5.mockapi.io/api/v1/dispositivos_IoT";

const form = document.getElementById("statusForm");
const statusInput = document.getElementById("status");
const recordsTable = document.getElementById("recordsTable");
const lastStatusDiv = document.getElementById("lastStatus");

// Agregar nuevo registro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = statusInput.value;
  if (!status) return alert("Selecciona un status");

  const ip = "127.0.0.1"; // demo
  const date = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  const record = {
    name: `Dispositivo IoT ${Date.now()}`, // único
    status,
    ip,
    date
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });

  form.reset();
  loadRecords();
});

// Cargar y mostrar últimos 5 registros
async function loadRecords() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // ordenar por id desc
  const ordered = data.sort((a, b) => Number(b.id) - Number(a.id));
  const last5 = ordered.slice(0, 5);

  recordsTable.innerHTML = "";
  last5.forEach(item => {
    recordsTable.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.status}</td>
        <td>${item.ip}</td>
        <td>${item.date}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editRecord('${item.id}','${item.status}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRecord('${item.id}')">Eliminar</button>
        </td>
      </tr>`;
  });

  if (ordered.length > 0) {
    lastStatusDiv.textContent = ordered[0].status;
  }
}

// Editar registro
async function editRecord(id, oldStatus) {
  const newStatus = prompt("Editar status:", oldStatus);
  if (!newStatus) return;

  const date = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus, date })
  });

  loadRecords();
}

// Eliminar registro
async function deleteRecord(id) {
  if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadRecords();
}

// inicial
loadRecords();
