// Datos ficticios para demostrar la consulta de membresías.
const members = {
  "1002345678": { name: "Laura Gómez", document: "1002345678", status: "Activa" },
  "1023456789": { name: "Andrés Pérez", document: "1023456789", status: "Vencida" }
};

const form = document.querySelector("#search-form");
const documentInput = document.querySelector("#documento");
const result = document.querySelector("#result");
const recordsBody = document.querySelector("#records-body");
const recordCount = document.querySelector("#record-count");
let records = [];
let currentMember = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchMember(documentInput.value.trim());
});

document.querySelectorAll(".demo-button").forEach((button) => {
  button.addEventListener("click", () => {
    documentInput.value = button.dataset.document;
    searchMember(button.dataset.document);
  });
});

function searchMember(documentNumber) {
  currentMember = members[documentNumber] || null;

  if (!currentMember) {
    result.classList.remove("hidden");
    result.innerHTML = `
      <div class="result-top">
        <div><p class="member-name">Miembro no encontrado</p>
        <span class="member-doc">Documento: ${escapeHTML(documentNumber)}</span></div>
      </div>
      <p class="result-message">Revisa el número ingresado o confirma que el miembro esté registrado.</p>`;
    return;
  }

  const isActive = currentMember.status === "Activa";
  result.classList.remove("hidden");
  result.innerHTML = `
    <div class="result-top">
      <div><p class="member-name">${escapeHTML(currentMember.name)}</p>
      <span class="member-doc">Documento: ${escapeHTML(currentMember.document)}</span></div>
      <span class="pill ${isActive ? "active" : "expired"}">${currentMember.status}</span>
    </div>
    <p class="result-message">${isActive
      ? "La membresía está activa. Se puede registrar la entrada o salida."
      : "La membresía está vencida. No se puede registrar el ingreso."}</p>
    <div class="result-actions">
      <button class="action-button" id="entry-button" ${!isActive ? "disabled" : ""}>Registrar entrada</button>
      <button class="action-button secondary" id="exit-button" ${!isActive ? "disabled" : ""}>Registrar salida</button>
    </div>`;

  document.querySelector("#entry-button").addEventListener("click", () => addRecord("Entrada"));
  document.querySelector("#exit-button").addEventListener("click", () => addRecord("Salida"));
}

function addRecord(movement) {
  if (!currentMember || currentMember.status !== "Activa") return;

  records.unshift({
    name: currentMember.name,
    movement,
    time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
  });
  records = records.slice(0, 8);
  renderRecords();
}

function renderRecords() {
  recordCount.textContent = `${records.length} ${records.length === 1 ? "registro" : "registros"}`;
  if (records.length === 0) {
    recordsBody.innerHTML = '<tr class="empty-row"><td colspan="3">Todavía no hay movimientos registrados.</td></tr>';
    return;
  }

  recordsBody.innerHTML = records.map((record) => `
    <tr>
      <td>${escapeHTML(record.name)}</td>
      <td><span class="movement ${record.movement === "Entrada" ? "entry" : "exit"}">${record.movement}</span></td>
      <td>${record.time}</td>
    </tr>`).join("");
}

// Evita interpretar los datos ingresados como código HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}
