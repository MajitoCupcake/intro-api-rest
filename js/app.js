const API_URL = "https://68bb0de584055bce63f104d5.mockapi.io/api/v1/dispositivos_IoT";
const form = document.getElementById("statusForm");
const recordsTable = document.querySelector("#recordsTable tbody");
const lastStatus = document.querySelector("#lastStatus strong");
const submitBtn = form.querySelector("button[type='submit']");

let editId = null; // Para saber si estamos en modo edición

// Obtener IP pública
async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "Desconocida";
  }
}

// Leer registros y actualizar tabla + último status
async function loadRecords() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Ordenar por fecha descendente
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Tomar los últimos 5
    const lastFive = sorted.slice(0, 5);

    // Renderizar tabla
    recordsTable.innerHTML = "";
    lastFive.forEach(item => {
      recordsTable.innerHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.status}</td>
          <td>${item.ip}</td>
          <td>${item.date}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editRecord('${item.id}', '${item.status}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteRecord('${item.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });

    // Actualizar último status
    if (lastFive.length > 0) {
      lastStatus.textContent = lastFive[0].status;
    }

  } catch (err) {
    console.error("Error cargando registros:", err);
  }
}

// Crear o actualizar registro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status").value;
  const ip = await getPublicIP();
  const date = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  // Nombre único para cada registro, para que MockAPI no bloquee el POST
  const record = { 
    name: `Dispositivo IoT ${Date.now()}`,
    status,
    ip,
    date
  };

  try {
    if (editId) {
      // Actualizar registro existente
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });
      editId = null;
      submitBtn.textContent = "Guardar"; // volver al modo normal
    } else {
      // Crear nuevo registro
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });
    }

    form.reset();
    loadRecords(); // refrescar tabla

  } catch (err) {
    console.error("Error guardando registro:", err);
  }
});

// Editar registro
window.editRecord = (id, status) => {
  document.getElementById("status").value = status;
  editId = id;
  submitBtn.textContent = "Actualizar";
};

// Eliminar registro
window.deleteRecord = async (id) => {
  if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadRecords();
  } catch (err) {
    console.error("Error eliminando registro:", err);
  }
};

// Cancelar edición
form.addEventListener("reset", () => {
  editId = null;
  submitBtn.textContent = "Guardar";
});

// Inicializar tabla al cargar la página
loadRecords();
