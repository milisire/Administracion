
const materias = [
    { id: "S0107", nombre: "Matemática I", year: 1, correlativas: { regularizar: [], aprobar: [] } },
    { id: "S0112", nombre: "Matemática II", year: 1, correlativas: { regularizar: ["S0107"], aprobar: ["S0107"] } },
    { id: "S0115", nombre: "Cálculo Financiero", year: 2, correlativas: { regularizar: ["S0107","S0112"], aprobar: ["S0107","S0112"] } },
    // ... Continuar agregando todas las materias según la info que diste ...
];

const container = document.getElementById("malla-container");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const resetBtn = document.getElementById("reset-progress");

let estados = JSON.parse(localStorage.getItem("estadosMaterias")) || {};

function renderMaterias() {
    container.innerHTML = "";
    for (let year = 1; year <= 5; year++) {
        const yearDiv = document.createElement("div");
        yearDiv.classList.add("year", `year-${year}`);
        const yearTitle = document.createElement("h2");
        yearTitle.textContent = `${year}° Año`;
        yearDiv.appendChild(yearTitle);
        materias.filter(m => m.year === year).forEach(m => {
            const div = document.createElement("div");
            div.classList.add("materia");
            div.classList.add(estados[m.id] || "pendiente");
            div.textContent = m.nombre;
            div.addEventListener("click", () => openModal(m));
            yearDiv.appendChild(div);
        });
        container.appendChild(yearDiv);
    }
    updateProgress();
}

function updateProgress() {
    const total = materias.length;
    const aprobadas = Object.values(estados).filter(s => s === "aprobada").length;
    const porcentaje = total ? Math.round((aprobadas / total) * 100) : 0;
    progressText.textContent = `Progreso: ${aprobadas}/${total} (${porcentaje}%)`;
    progressFill.style.width = porcentaje + "%";
}

function openModal(materia) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-title").textContent = materia.nombre;
    document.getElementById("modal-correlativas").textContent = "Regularizar: " + materia.correlativas.regularizar.join(", ") + " | Aprobar: " + materia.correlativas.aprobar.join(", ");
    document.getElementById("regularizar-btn").onclick = () => setEstado(materia.id, "regularizada");
    document.getElementById("aprobar-btn").onclick = () => setEstado(materia.id, "aprobada");
    modal.style.display = "block";
}

function setEstado(id, estado) {
    estados[id] = estado;
    localStorage.setItem("estadosMaterias", JSON.stringify(estados));
    closeModal();
    renderMaterias();
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

document.getElementById("close-modal").onclick = closeModal;
window.onclick = function(event) {
    if (event.target == document.getElementById("modal")) closeModal();
}

resetBtn.addEventListener("click", () => {
    if (confirm("¿Seguro que quieres reiniciar el progreso?")) {
        estados = {};
        localStorage.removeItem("estadosMaterias");
        renderMaterias();
    }
});

renderMaterias();
