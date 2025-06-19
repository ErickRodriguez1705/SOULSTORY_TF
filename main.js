//DANILO
// Utilidades de navegación
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
    screen.classList.add("hidden");
  });
  const newScreen = document.getElementById(id);
  newScreen.classList.add("active");
  newScreen.classList.remove("hidden");
}

function goTo(id) {
  showScreen(id);
}

function goToProfile() {
  showScreen("profile-screen");
}

function goToMainMenu() {
  showScreen("main-menu");
}

// Activación de asistencia (efecto visual)
function toggleAssistance() {
  const screen = document.getElementById("profile-screen");
  screen.style.transform = "scale(1.1)";
  setTimeout(() => (screen.style.transform = "scale(1)"), 300);
}

// Cambiar tamaño de letra (US12)
function cambiarLetra(value) {
  document.body.style.fontSize = value + "em";
}

// Datos simulados (reemplaza con JSON local/API en futuro)
let recuerdos = [];
let imagenes = [];

// US03: Guardar memoria escrita
function guardarEscrito() {
  const texto = document.getElementById("texto-memoria").value;
  if (texto.trim()) {
    recuerdos.push({
      tipo: "escrito",
      contenido: texto,
      fecha: new Date().toLocaleDateString(),
      comentarios: [],
      favorito: false,
    });
    alert("Recuerdo guardado.");
    document.getElementById("texto-memoria").value = "";
    goToMainMenu();
  } else {
    alert("Escribe algo para guardar.");
  }
}
// US05: Editar / Eliminar recuerdos
function editarRecuerdo(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  const nuevoTexto = prompt("Edita tu recuerdo:", recuerdos[index].contenido);
  if (nuevoTexto) {
    recuerdos[index].contenido = nuevoTexto;
    filtrarRecuerdos("todo");
  }
}

function eliminarRecuerdo(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  if (confirm("¿Estás seguro de eliminar este recuerdo?")) {
    recuerdos.splice(index, 1);
    filtrarRecuerdos("todo");
  }
}

function toggleFavorito(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  recuerdos[index].favorito = !recuerdos[index].favorito;
  filtrarRecuerdos("todo");
  if (document.getElementById("legacy-screen").classList.contains("active")) {
    filtrarLegado();
  }
}

// US04: Mostrar recuerdos con filtro
function filtrarRecuerdos(filtro) {
  const contenedor = document.getElementById("lista-recuerdos");
  contenedor.innerHTML = "";
  if (!recuerdos || !Array.isArray(recuerdos)) {
    contenedor.innerHTML = "<p>No hay recuerdos disponibles.</p>";
    return;
  }
  const filtrados =
    filtro === "todo"
      ? recuerdos
      : recuerdos.filter((r) => r && r.tipo === filtro);
  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay recuerdos en esta categoría.</p>";
  } else {
    filtrados.forEach((recuerdo, index) => {
      if (!recuerdo) return;
      const div = document.createElement("div");
      div.className = "recuerdo";
      div.innerHTML = `
        <p><strong>${recuerdo.tipo.toUpperCase()} - ${
        recuerdo.fecha
      }</strong></p>
        <p>${recuerdo.contenido}</p>
        <div class="acciones">
          <button onclick="compartirRecuerdo(${index})">Compartir</button>
          <button onclick="editarRecuerdo(${index})">Editar</button>
          <button onclick="eliminarRecuerdo(${index})">Eliminar</button>
          <button onclick="mostrarFormularioComentario(${index})">Comentar</button>
          <button onclick="toggleFavorito(${index})" class="favorito ${
        recuerdo.favorito ? "selected" : ""
      }">
            ${recuerdo.favorito ? "★ Quitar Favorito" : "☆ Añadir Favorito"}
          </button>
        </div>
        <div class="comentarios" id="comentarios-${index}" style="display: none;">
          <textarea id="texto-comentario-${index}" placeholder="Escribe un comentario..."></textarea>
          <select id="emoji-comentario-${index}">
            <option value="">Sin emoji</option>
            <option value="😊">😊</option>
            <option value="❤️">❤️</option>
            <option value="👍">👍</option>
            <option value="🎉">🎉</option>
          </select>
          <button onclick="agregarComentario(${index})">Enviar comentario</button>
        </div>
      `;
      contenedor.appendChild(div);
      actualizarComentarios(index);
    });
  }
}

function filtrarLegado() {
  const contenedor = document.getElementById("lista-legado");
  contenedor.innerHTML = "";
  if (!recuerdos || !Array.isArray(recuerdos)) {
    contenedor.innerHTML = "<p>No hay recuerdos disponibles.</p>";
    return;
  }
  const favoritos = recuerdos.filter((r) => r && r.favorito);
  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No hay recuerdos favoritos.</p>";
  } else {
    favoritos.forEach((recuerdo, index) => {
      if (!recuerdo) return;
      const originalIndex = recuerdos.findIndex((r) => r === recuerdo);
      const div = document.createElement("div");
      div.className = "recuerdo";
      div.innerHTML = `
        <p><strong>${recuerdo.tipo.toUpperCase()} - ${
        recuerdo.fecha
      }</strong></p>
        <p>${recuerdo.contenido}</p>
        <div class="acciones">
          <button onclick="compartirRecuerdo(${originalIndex})">Compartir</button>
          <button onclick="editarRecuerdo(${originalIndex})">Editar</button>
          <button onclick="eliminarRecuerdo(${originalIndex})">Eliminar</button>
          <button onclick="mostrarFormularioComentario(${originalIndex})">Comentar</button>
          <button onclick="toggleFavorito(${originalIndex})" class="favorito ${
        recuerdo.favorito ? "selected" : ""
      }">
            ${recuerdo.favorito ? "★ Quitar Favorito" : "☆ Añadir Favorito"}
          </button>
        </div>
        <div class="comentarios" id="comentarios-${originalIndex}" style="display: none;">
          <textarea id="texto-comentario-${originalIndex}" placeholder="Escribe un comentario..."></textarea>
          <select id="emoji-comentario-${originalIndex}">
            <option value="">Sin emoji</option>
            <option value="😊">😊</option>
            <option value="❤️">❤️</option>
            <option value="👍">👍</option>
            <option value="🎉">🎉</option>
          </select>
          <button onclick="agregarComentario(${originalIndex})">Enviar comentario</button>
        </div>
      `;
      contenedor.appendChild(div);
      actualizarComentarios(originalIndex);
    });
  }
}

function mostrarFormularioComentario(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  const comentariosDiv = document.getElementById(`comentarios-${index}`);
  comentariosDiv.style.display =
    comentariosDiv.style.display === "none" ? "block" : "none";
}

function agregarComentario(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  const texto = document.getElementById(`texto-comentario-${index}`).value;
  const emoji = document.getElementById(`emoji-comentario-${index}`).value;
  if (texto.trim() || emoji) {
    recuerdos[index].comentarios = recuerdos[index].comentarios || [];
    recuerdos[index].comentarios.push({
      texto: texto,
      emoji: emoji,
      likes: 0,
      liked: false,
    });
    document.getElementById(`texto-comentario-${index}`).value = "";
    document.getElementById(`emoji-comentario-${index}`).value = "";
    actualizarComentarios(index);
  } else {
    alert("Por favor, escribe un comentario o selecciona un emoji.");
  }
}

function actualizarComentarios(index) {
  if (!recuerdos[index]) return;
  const comentariosDiv = document.getElementById(`comentarios-${index}`);
  const comentarios = recuerdos[index].comentarios || [];
  comentariosDiv.innerHTML = `
    <textarea id="texto-comentario-${index}" placeholder="Escribe un comentario..."></textarea>
    <select id="emoji-comentario-${index}">
      <option value="">Sin emoji</option>
      <option value="😊">😊</option>
      <option value="❤️">❤️</option>
      <option value="👍">👍</option>
      <option value="🎉">🎉</option>
    </select>
    <button onclick="agregarComentario(${index})">Enviar comentario</button>
  `;
  comentarios.forEach((comentario, comentarioIndex) => {
    const comentarioDiv = document.createElement("div");
    comentarioDiv.className = "comentario";
    comentarioDiv.innerHTML = `
      <span>${comentario.texto} ${comentario.emoji}</span>
      <button onclick="darLikeComentario(${index}, ${comentarioIndex})" class="${
      comentario.liked ? "liked" : ""
    }">
        ${comentario.liked ? "❤️" : "Me gusta"} (${comentario.likes})
      </button>
    `;
    comentariosDiv.appendChild(comentarioDiv);
  });
  comentariosDiv.style.display = "none";
}

function darLikeComentario(recuerdoIndex, comentarioIndex) {
  if (
    !recuerdos[recuerdoIndex] ||
    !recuerdos[recuerdoIndex].comentarios[comentarioIndex]
  ) {
    alert("Error: Comentario no encontrado.");
    return;
  }
  const comentario = recuerdos[recuerdoIndex].comentarios[comentarioIndex];
  if (!comentario.liked) {
    comentario.likes += 1;
    comentario.liked = true;
  } else {
    comentario.likes -= 1;
    comentario.liked = false;
  }
  actualizarComentarios(recuerdoIndex);
}

// US06: Generar imagen simulada
function generarImagen() {
  const desc = document.getElementById("desc-imagen").value;
  if (!desc.trim()) {
    alert("Por favor, ingresa una descripción válida.");
    return;
  }
  const div = document.getElementById("imagen-generada");
  const url = `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(
    desc
  )}`;
  imagenes.push({ descripcion: desc, fecha: new Date(), url });
  div.innerHTML = `<img src="${url}" alt="${desc}" />`;
  actualizarGaleria();
}

function ordenarImagenes(orden) {
  imagenes.sort((a, b) => {
    return orden === "asc" ? a.fecha - b.fecha : b.fecha - a.fecha;
  });
  actualizarGaleria();
}

function actualizarGaleria() {
  const galeria = document.getElementById("galeria-imagenes");
  galeria.innerHTML = "";
  imagenes.forEach((img) => {
    const tag = document.createElement("img");
    tag.src = img.url;
    tag.alt = img.descripcion;
    galeria.appendChild(tag);
  });
}

// US:08 Compartir recuerdo
function compartirRecuerdo(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  alert("Llevando a pantalla de compartir...");
  goTo("share-screen");
}

function enviarCodigo() {
  alert(
    "Código de verificación enviado a tu correo. Usa '123456' para este demo."
  );
}
// US10: Verificar Código
function verificarCodigo() {
  const codigo = document.getElementById("codigo-verificacion").value;
  if (codigo === "123456") {
    alert("Código verificado correctamente.");
    document.getElementById("codigo-verificacion").value = "";
    goTo("legacy-screen");
    filtrarLegado();
  } else {
    alert("Código incorrecto. Intenta de nuevo o solicita un nuevo código.");
  }
}
// Update filtrarRecuerdos to include Reportar button
function filtrarRecuerdos(filtro) {
  const contenedor = document.getElementById("lista-recuerdos");
  contenedor.innerHTML = "";
  if (!recuerdos || !Array.isArray(recuerdos)) {
    contenedor.innerHTML = "<p>No hay recuerdos disponibles.</p>";
    return;
  }
  const filtrados =
    filtro === "todo"
      ? recuerdos
      : recuerdos.filter((r) => r && r.tipo === filtro);
  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay recuerdos en esta categoría.</p>";
  } else {
    filtrados.forEach((recuerdo, index) => {
      if (!recuerdo) return;
      const div = document.createElement("div");
      div.className = "recuerdo";
      div.innerHTML = `
        <p><strong>${recuerdo.tipo.toUpperCase()} - ${
        recuerdo.fecha
      }</strong></p>
        <p>${recuerdo.contenido}</p>
        <div class="acciones">
          <button onclick="compartirRecuerdo(${index})">Compartir</button>
          <button onclick="editarRecuerdo(${index})">Editar</button>
          <button onclick="eliminarRecuerdo(${index})">Eliminar</button>
          <button onclick="mostrarFormularioComentario(${index})">Comentar</button>
          <button onclick="toggleFavorito(${index})" class="favorito ${
        recuerdo.favorito ? "selected" : ""
      }">
            ${recuerdo.favorito ? "★ Quitar Favorito" : "☆ Añadir Favorito"}
          </button>
          <button onclick="iniciarReporte(${index})">Reportar</button>
        </div>
        <div class="comentarios" id="comentarios-${index}" style="display: none;">
          <textarea id="texto-comentario-${index}" placeholder="Escribe un comentario..."></textarea>
          <select id="emoji-comentario-${index}">
            <option value="">Sin emoji</option>
            <option value="😊">😊</option>
            <option value="❤️">❤️</option>
            <option value="👍">👍</option>
            <option value="🎉">🎉</option>
          </select>
          <button onclick="agregarComentario(${index})">Enviar comentario</button>
        </div>
      `;
      contenedor.appendChild(div);
      actualizarComentarios(index);
    });
  }
}

function filtrarLegado() {
  const contenedor = document.getElementById("lista-legado");
  contenedor.innerHTML = "";
  if (!recuerdos || !Array.isArray(recuerdos)) {
    contenedor.innerHTML = "<p>No hay recuerdos disponibles.</p>";
    return;
  }
  const favoritos = recuerdos.filter((r) => r && r.favorito);
  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No hay recuerdos favoritos.</p>";
  } else {
    favoritos.forEach((recuerdo, index) => {
      if (!recuerdo) return;
      const originalIndex = recuerdos.findIndex((r) => r === recuerdo);
      const div = document.createElement("div");
      div.className = "recuerdo";
      div.innerHTML = `
        <p><strong>${recuerdo.tipo.toUpperCase()} - ${
        recuerdo.fecha
      }</strong></p>
        <p>${recuerdo.contenido}</p>
        <div class="acciones">
          <button onclick="compartirRecuerdo(${originalIndex})">Compartir</button>
          <button onclick="editarRecuerdo(${originalIndex})">Editar</button>
          <button onclick="eliminarRecuerdo(${originalIndex})">Eliminar</button>
          <button onclick="mostrarFormularioComentario(${originalIndex})">Comentar</button>
          <button onclick="toggleFavorito(${originalIndex})" class="favorito ${
        recuerdo.favorito ? "selected" : ""
      }">
            ${recuerdo.favorito ? "★ Quitar Favorito" : "☆ Añadir Favorito"}
          </button>
          <button onclick="iniciarReporte(${originalIndex})">Reportar</button>
        </div>
        <div class="comentarios" id="comentarios-${originalIndex}" style="display: none;">
          <textarea id="texto-comentario-${originalIndex}" placeholder="Escribe un comentario..."></textarea>
          <select id="emoji-comentario-${originalIndex}">
            <option value="">Sin emoji</option>
            <option value="😊">😊</option>
            <option value="❤️">❤️</option>
            <option value="👍">👍</option>
            <option value="🎉">🎉</option>
          </select>
          <button onclick="agregarComentario(${originalIndex})">Enviar comentario</button>
        </div>
      `;
      contenedor.appendChild(div);
      actualizarComentarios(originalIndex);
    });
  }
}

function iniciarReporte(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  window.currentReportIndex = index;
  goTo("report-screen");
}

function enviarReporte() {
  const email = document.getElementById("report-email").value;
  const subject = document.getElementById("report-subject").value;
  const index = window.currentReportIndex;

  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }

  if (!email.trim() || !subject.trim()) {
    alert("Por favor, completa ambos campos.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
  }

  alert(`Reporte enviado para el recuerdo: "${recuerdos[
    index
  ].contenido.substring(0, 20)}..." 
Correo: ${email}
Asunto: ${subject}`);

  document.getElementById("report-email").value = "";
  document.getElementById("report-subject").value = "";
  delete window.currentReportIndex;
  goToMainMenu();
}
let failedAttempts = 0;
const maxAttempts = 5;

function enviarCodigo() {
  failedAttempts = 0;
  alert(
    "Código de verificación enviado a tu correo. Usa '123456' para este demo."
  );
}

function verificarCodigo() {
  if (failedAttempts >= maxAttempts) {
    alert(
      "Has alcanzado el límite de intentos. Por favor, intenta de nuevo más tarde."
    );
    goToMainMenu();
    return;
  }

  const codigo = document.getElementById("codigo-verificacion").value;
  if (codigo === "123456") {
    failedAttempts = 0;
    alert("Código verificado correctamente.");
    document.getElementById("codigo-verificacion").value = "";
    goTo("legacy-screen");
    filtrarLegado();
  } else {
    failedAttempts++;
    const attemptsLeft = maxAttempts - failedAttempts;
    if (attemptsLeft > 0) {
      alert(
        `Código incorrecto. Te quedan ${attemptsLeft} intento${
          attemptsLeft === 1 ? "" : "s"
        }.`
      );
    } else {
      alert(
        "Has alcanzado el límite de intentos. Por favor, intenta de nuevo más tarde."
      );
      goToMainMenu();
    }
  }
}

function filtrarRecuerdos(filtro) {
  const contenedor = document.getElementById("lista-recuerdos");
  contenedor.innerHTML = "";
  if (!recuerdos || !Array.isArray(recuerdos)) {
    contenedor.innerHTML = "<p>No hay recuerdos disponibles.</p>";
    return;
  }
  const filtrados =
    filtro === "todo"
      ? recuerdos
      : recuerdos.filter((r) => r && r.tipo === filtro);
  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay recuerdos en esta categoría.</p>";
  } else {
    filtrados.forEach((recuerdo, index) => {
      if (!recuerdo) return;
      const div = document.createElement("div");
      div.className = "recuerdo";
      div.innerHTML = `
        <p><strong>${recuerdo.tipo.toUpperCase()} - ${
        recuerdo.fecha
      }</strong></p>
        <p>${recuerdo.contenido}</p>
        <div class="acciones">
          <button onclick="compartirRecuerdo(${index})">Compartir</button>
          <button onclick="editarRecuerdo(${index})">Editar</button>
          <button onclick="eliminarRecuerdo(${index})">Eliminar</button>
          <button onclick="mostrarFormularioComentario(${index})">Comentar</button>
          <button onclick="toggleFavorito(${index})" class="favorito ${
        recuerdo.favorito ? "selected" : ""
      }">
            ${recuerdo.favorito ? "★ Quitar Favorito" : "☆ Añadir Favorito"}
          </button>
          <button onclick="iniciarReporte(${index})">Reportar</button>
          <button onclick="iniciarDescarga(${index})">Descargar</button>
        </div>
        <div class="comentarios" id="comentarios-${index}" style="display: none;">
          <textarea id="texto-comentario-${index}" placeholder="Escribe un comentario..."></textarea>
          <select id="emoji-comentario-${index}">
            <option value="">Sin emoji</option>
            <option value="😊">😊</option>
            <option value="❤️">❤️</option>
            <option value="👍">👍</option>
            <option value="🎉">🎉</option>
          </select>
          <button onclick="agregarComentario(${index})">Enviar comentario</button>
        </div>
      `;
      contenedor.appendChild(div);
      actualizarComentarios(index);
    });
  }
}

function filtrarLegado() {
  const contenedor = document.getElementById("lista-legado");
  contenedor.innerHTML = "";
  if (!recuerdos || !Array.isArray(recuerdos)) {
    contenedor.innerHTML = "<p>No hay recuerdos disponibles.</p>";
    return;
  }
  const favoritos = recuerdos.filter((r) => r && r.favorito);
  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No hay recuerdos favoritos.</p>";
  } else {
    favoritos.forEach((recuerdo, index) => {
      if (!recuerdo) return;
      const originalIndex = recuerdos.findIndex((r) => r === recuerdo);
      const div = document.createElement("div");
      div.className = "recuerdo";
      div.innerHTML = `
        <p><strong>${recuerdo.tipo.toUpperCase()} - ${
        recuerdo.fecha
      }</strong></p>
        <p>${recuerdo.contenido}</p>
        <div class="acciones">
          <button onclick="compartirRecuerdo(${originalIndex})">Compartir</button>
          <button onclick="editarRecuerdo(${originalIndex})">Editar</button>
          <button onclick="eliminarRecuerdo(${originalIndex})">Eliminar</button>
          <button onclick="mostrarFormularioComentario(${originalIndex})">Comentar</button>
          <button onclick="toggleFavorito(${originalIndex})" class="favorito ${
        recuerdo.favorito ? "selected" : ""
      }">
            ${recuerdo.favorito ? "★ Quitar Favorito" : "☆ Añadir Favorito"}
          </button>
          <button onclick="iniciarReporte(${originalIndex})">Reportar</button>
          <button onclick="iniciarDescarga(${originalIndex})">Descargar</button>
        </div>
        <div class="comentarios" id="comentarios-${originalIndex}" style="display: none;">
          <textarea id="texto-comentario-${originalIndex}" placeholder="Escribe un comentario..."></textarea>
          <select id="emoji-comentario-${originalIndex}">
            <option value="">Sin emoji</option>
            <option value="😊">😊</option>
            <option value="❤️">❤️</option>
            <option value="👍">👍</option>
            <option value="🎉">🎉</option>
          </select>
          <button onclick="agregarComentario(${originalIndex})">Enviar comentario</button>
        </div>
      `;
      contenedor.appendChild(div);
      actualizarComentarios(originalIndex);
    });
  }
}

function iniciarDescarga(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  window.currentDownloadIndex = index;
  goTo("download-screen");
}

function descargarRecuerdo() {
  const index = window.currentDownloadIndex;
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  const format = document.getElementById("download-format").value;
  const recuerdo = recuerdos[index];
  const filename = `recuerdo_${recuerdo.fecha.replace(/\//g, "-")}.${format}`;
  let content;
  let type;

  switch (format) {
    case "txt":
      content = `Tipo: ${recuerdo.tipo}\nFecha: ${recuerdo.fecha}\nContenido: ${
        recuerdo.contenido
      }\nComentarios: ${
        recuerdo.comentarios.length > 0
          ? recuerdo.comentarios
              .map(
                (c, i) => `${i + 1}. ${c.texto} ${c.emoji} (Likes: ${c.likes})`
              )
              .join("\n")
          : "Sin comentarios"
      }`;
      type = "text/plain";
      downloadFile(content, filename, type);
      break;
    case "json":
      content = JSON.stringify(recuerdo, null, 2);
      type = "application/json";
      downloadFile(content, filename, type);
      break;
    case "pdf":
      generatePDF(recuerdo, filename);
      break;
    default:
      alert("Formato no soportado.");
      return;
  }

  document.getElementById("download-format").value = "txt";
  delete window.currentDownloadIndex;
  goToMainMenu();
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generatePDF(recuerdo, filename) {
  const content = `
    Tipo: ${recuerdo.tipo}
    Fecha: ${recuerdo.fecha}
    Contenido: ${recuerdo.contenido}
    Comentarios:
    ${
      recuerdo.comentarios.length > 0
        ? recuerdo.comentarios
            .map(
              (c, i) => `${i + 1}. ${c.texto} ${c.emoji} (Likes: ${c.likes})`
            )
            .join("\n")
        : "Sin comentarios"
    }
  `;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert(
    "PDF generado como texto plano. Para un PDF real, se requiere una biblioteca como jsPDF."
  );
}
function mostrarVistaPrevia() {
  const index = window.currentDownloadIndex;
  const format = document.getElementById("download-format").value;
  const previewArea = document.getElementById("preview-area");
  const previewContent = document.getElementById("preview-content");

  if (!recuerdos[index]) {
    previewArea.style.display = "none";
    alert("Error: Recuerdo no encontrado.");
    return;
  }

  const recuerdo = recuerdos[index];
  let content;

  content = `Tipo: ${recuerdo.tipo}
Fecha: ${recuerdo.fecha}
Contenido: ${recuerdo.contenido}
Comentarios:
${
  recuerdo.comentarios.length > 0
    ? recuerdo.comentarios
        .map((c, i) => `${i + 1}. ${c.texto} ${c.emoji} (Likes: ${c.likes})`)
        .join("\n")
    : "Sin comentarios"
}`;

  switch (format) {
    case "txt":
      previewContent.textContent = content;
      break;
    case "pdf":
      previewContent.textContent = `[Vista previa del PDF]\n${content}\n(Nota: El PDF real se generará como texto plano. Usa jsPDF para un formato PDF verdadero.)`;
      break;
    case "docx":
      previewContent.textContent = `[Vista previa del Word]\n${content}\n(Nota: El archivo .docx real se generará como texto plano. Usa una biblioteca como docx para un formato .docx verdadero.)`;
      break;
    default:
      previewContent.textContent = "Selecciona un formato válido.";
      return;
  }

  previewArea.style.display = "block";
}

function descargarRecuerdo() {
  const index = window.currentDownloadIndex;
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  const format = document.getElementById("download-format").value;
  const recuerdo = recuerdos[index];
  const filename = `recuerdo_${recuerdo.fecha.replace(/\//g, "-")}.${format}`;
  let content;
  let type;

  content = `Tipo: ${recuerdo.tipo}
Fecha: ${recuerdo.fecha}
Contenido: ${recuerdo.contenido}
Comentarios:
${
  recuerdo.comentarios.length > 0
    ? recuerdo.comentarios
        .map((c, i) => `${i + 1}. ${c.texto} ${c.emoji} (Likes: ${c.likes})`)
        .join("\n")
    : "Sin comentarios"
}`;

  switch (format) {
    case "txt":
      type = "text/plain";
      downloadFile(content, filename, type);
      break;
    case "pdf":
      generatePDF(content, filename);
      break;
    case "docx":
      type =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      downloadFile(content, filename, type);
      alert(
        "Docx generado como texto plano. Para un formato .docx real, se requiere una biblioteca como docx o un servidor."
      );
      break;
    default:
      alert("Formato no soportado.");
      return;
  }

  document.getElementById("download-format").value = "txt";
  document.getElementById("preview-area").style.display = "none";
  delete window.currentDownloadIndex;
  goToMainMenu();
}

function generatePDF(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert(
    "PDF generado como texto plano. Para un PDF real, se requiere una biblioteca como jsPDF."
  );
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function iniciarDescarga(index) {
  if (!recuerdos[index]) {
    alert("Error: Recuerdo no encontrado.");
    return;
  }
  window.currentDownloadIndex = index;
  goTo("download-screen");
  mostrarVistaPrevia();
}
//DANILO ACABA

// FORMULARIO DE CONTACTO - ENVÍO SIMULADO
document
  .querySelector(".formulario-contacto")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const mensaje = document.querySelector(".mensaje-enviado");
    mensaje.style.display = "block";

    setTimeout(() => {
      h;
      mensaje.style.display = "none";
    }, 5000);

    this.reset();
  });

// MENÚ HAMBURGUESA - Mostrar/Ocultar en móvil
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".menu").classList.toggle("active");
});

// OPCIONAL: Cerrar el menú al hacer clic en una opción (para móviles)
document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".menu").classList.remove("active");
  });
});

//SOULSTORY
// Cargar datos al iniciar
window.onload = function () {
  const fields = ["name", "email", "phone", "address", "birth"];
  fields.forEach((field) => {
    const saved = localStorage.getItem(field);
    if (saved) {
      document.getElementById(field).value = saved;
    }
  });

  const nameSaved = localStorage.getItem("name");
  if (nameSaved) {
    document.getElementById("user-name-display").innerText = nameSaved;
  }
};

// Activar botón si checkbox está marcado
const checkbox = document.getElementById("agree");
const submitBtn = document.getElementById("submitBtn");

checkbox.addEventListener("change", () => {
  submitBtn.disabled = !checkbox.checked;
});

// Guardar datos al enviar formulario
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Verificación adicional (por si eliminan disabled manualmente desde el navegador)
  if (!checkbox.checked) {
    alert("Debes aceptar los términos y condiciones antes de continuar.");
    return;
  }

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const birth = document.getElementById("birth").value;

  localStorage.setItem("name", name);
  localStorage.setItem("email", email);
  localStorage.setItem("phone", phone);
  localStorage.setItem("address", address);
  localStorage.setItem("birth", birth);

  document.getElementById("user-name-display").innerText = name;

  const msg = document.getElementById("success-message");
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
});
const from = document.getElementById("languageForm");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const selected = form.language.value;

  confirmation.textContent = `✅ Idioma cambiado correctamente a ${selected}`;
  confirmation.classList.remove("hidden");

  // Guardar en localStorage si quieres recordar la selección
  localStorage.setItem("idioma", selected);
});

// Restaurar idioma guardado (opcional)
window.onload = () => {
  const saved = localStorage.getItem("idioma");
  if (saved) {
    const options = document.querySelectorAll("input[name='language']");
    options.forEach((option) => {
      if (option.value === saved) {
        option.checked = true;
      }
    });
  }
};

const datos = [
  {
    fecha: "05/06/2025",
    duracion: "2 horas",
    causa: "Actualización de parches de seguridad",
    componentes: "Servidor principal, API pública",
  },
  {
    fecha: "26/05/2025",
    duracion: "3 horas",
    causa: "Actualización de políticas internas",
    componentes: "Base de datos, API de autenticación",
  },
  {
    fecha: "12/05/2025",
    duracion: "1.5 horas",
    causa: "Mejora de tiempos de respuesta",
    componentes: "Servidor de rendimiento",
  },
];

function mostrarDetalle(index) {
  const mantenimiento = datos[index];
  document.getElementById("fecha").textContent = mantenimiento.fecha;
  document.getElementById("duracion").textContent = mantenimiento.duracion;
  document.getElementById("causa").textContent = mantenimiento.causa;
  document.getElementById("componentes").textContent =
    mantenimiento.componentes;
  document.getElementById("mensajeDescarga").classList.add("hidden");
}

function descargarPDF() {
  document.getElementById("mensajeDescarga").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("mensajeDescarga").classList.add("hidden");
  }, 4000);
}

// Mostrar primero por defecto
mostrarDetalle(0);

function toggleEjemplo(mostrar) {
  const div = document.getElementById("ejemploUso");
  if (mostrar) {
    div.classList.remove("hidden");
  } else {
    div.classList.add("hidden");
  }
}
