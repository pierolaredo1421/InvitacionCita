// ================== CONFIGURA AQUÍ ==================
const CONFIG = {
  nombre: "Aracely",
  telefono: "51904157671",
  horas: ["12:00 p. m.", "1:00 p. m.", "3:00 p. m.", "5:00 p. m.", "7:00 p. m.", "8:30 p. m."],
  comidas: [
    { emoji: "🍝", nombre: "Pastas" },
    { emoji: "🍔", nombre: "Hamburguesas" },
    { emoji: "🍲", nombre: "Comida criolla" },
    { emoji: "🍗", nombre: "Pollo a la brasa" },
    { emoji: "🍣", nombre: "Sushi" },
    { emoji: "🥡", nombre: "Chifa" },
    { emoji: "🍕", nombre: "Pizza" },
    { emoji: "🍰", nombre: "Postres y café" },
  ],
};
// ====================================================

const $ = (id) => document.getElementById(id);

const eleccion = { fecha: null, hora: null, comida: null, nota: "" };

// ---------- Corazones de fondo ----------
const emojisCorazon = ["💗", "💕", "💖", "🌸", "💞"];
for (let i = 0; i < 18; i++) {
  const c = document.createElement("span");
  c.className = "corazon";
  c.textContent = emojisCorazon[Math.floor(Math.random() * emojisCorazon.length)];
  c.style.left = Math.random() * 100 + "vw";
  c.style.fontSize = 16 + Math.random() * 20 + "px";
  c.style.animationDuration = 9 + Math.random() * 9 + "s";
  c.style.animationDelay = -Math.random() * 15 + "s";
  $("corazones").appendChild(c);
}

// ---------- Saludo ----------
if (CONFIG.nombre) $("saludo").textContent = CONFIG.nombre;

// ---------- Cambiar de paso ----------
function irAPaso(n) {
  document.querySelectorAll(".paso").forEach((p) => p.classList.remove("activo"));
  $("paso" + n).classList.add("activo");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-atras]").forEach((b) => {
  b.addEventListener("click", () => irAPaso(Number(b.dataset.atras)));
});

// ---------- Botón "No" que se escapa ----------
const btnNo = $("btnNo");
const btnSi = $("btnSi");
const frases = ["No", "¿Segura?", "Piénsalo 🤔", "Por aquí no 😅", "¡Atrápame!", "Casi...", "Dale al Sí 💕"];
let intentos = 0;
let ultimoEscape = 0;

function escapar(e) {
  if (e) e.preventDefault();

  const ahora = Date.now();
  if (ahora - ultimoEscape < 200) return;
  ultimoEscape = ahora;

  if (!btnNo.classList.contains("suelto")) {
    const r = btnNo.getBoundingClientRect();
    document.body.appendChild(btnNo);
    btnNo.classList.add("suelto");
    btnNo.style.left = r.left + "px";
    btnNo.style.top = r.top + "px";
  }

  intentos++;
  btnNo.textContent = frases[intentos % frases.length];
  btnSi.style.setProperty("--escala", 1 + Math.min(intentos, 8) * 0.06);

  const margen = 16;
  const maxX = window.innerWidth - btnNo.offsetWidth - margen;
  const maxY = window.innerHeight - btnNo.offsetHeight - margen;
  const actual = btnNo.getBoundingClientRect();

  let x, y, vueltas = 0;
  do {
    x = margen + Math.random() * Math.max(0, maxX - margen);
    y = margen + Math.random() * Math.max(0, maxY - margen);
    vueltas++;
  } while (Math.hypot(x - actual.left, y - actual.top) < 160 && vueltas < 30);

  btnNo.style.left = x + "px";
  btnNo.style.top = y + "px";
}

btnNo.addEventListener("mouseenter", escapar);
btnNo.addEventListener("pointerdown", escapar);
btnNo.addEventListener("touchstart", escapar, { passive: false });
btnNo.addEventListener("focus", escapar);
btnNo.addEventListener("click", escapar);

btnSi.addEventListener("click", () => {
  btnNo.style.display = "none";
  irAPaso(1);
});

// ---------- Calendario ----------
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);
let mesVista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

function dibujarCalendario() {
  const grid = $("calGrid");
  grid.innerHTML = "";
  $("mesActual").textContent = `${MESES[mesVista.getMonth()]} ${mesVista.getFullYear()}`;

  // Casillas vacías antes del día 1 (la semana empieza en lunes)
  const primerDia = new Date(mesVista.getFullYear(), mesVista.getMonth(), 1);
  const desfase = (primerDia.getDay() + 6) % 7;
  for (let i = 0; i < desfase; i++) {
    const v = document.createElement("div");
    v.className = "dia vacio";
    grid.appendChild(v);
  }

  const totalDias = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= totalDias; d++) {
    const fecha = new Date(mesVista.getFullYear(), mesVista.getMonth(), d);
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "dia";
    boton.textContent = d;

    if (fecha < hoy) boton.disabled = true;
    if (fecha.getTime() === hoy.getTime()) boton.classList.add("hoy");
    if (eleccion.fecha && fecha.getTime() === eleccion.fecha.getTime()) boton.classList.add("elegido");

    boton.addEventListener("click", () => {
      eleccion.fecha = fecha;
      $("sigueFecha").disabled = false;
      dibujarCalendario();
    });

    grid.appendChild(boton);
  }

  // No dejar retroceder antes del mes actual
  $("mesAnterior").disabled =
    mesVista.getFullYear() === hoy.getFullYear() && mesVista.getMonth() === hoy.getMonth();
}

$("mesAnterior").addEventListener("click", () => {
  mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1);
  dibujarCalendario();
});
$("mesSiguiente").addEventListener("click", () => {
  mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1);
  dibujarCalendario();
});

dibujarCalendario();

function fechaBonita(f) {
  return `${DIAS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
}

$("sigueFecha").addEventListener("click", () => {
  $("resumenFecha").textContent = `El ${fechaBonita(eleccion.fecha)} 💗`;
  irAPaso(2);
});

// ---------- Horas ----------
CONFIG.horas.forEach((h) => {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = h;
  chip.addEventListener("click", () => {
    eleccion.hora = h;
    document.querySelectorAll("#horas .chip").forEach((c) => c.classList.remove("elegido"));
    chip.classList.add("elegido");
    $("sigueHora").disabled = false;
  });
  $("horas").appendChild(chip);
});

$("sigueHora").addEventListener("click", () => irAPaso(3));

// ---------- Comidas ----------
CONFIG.comidas.forEach((c) => {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "comida";
  boton.innerHTML = `<span>${c.emoji}</span>${c.nombre}`;
  boton.addEventListener("click", () => {
    eleccion.comida = `${c.emoji} ${c.nombre}`;
    document.querySelectorAll(".comida").forEach((x) => x.classList.remove("elegido"));
    boton.classList.add("elegido");
    $("sigueComida").disabled = false;
  });
  $("comidas").appendChild(boton);
});

// ---------- Resumen final ----------
function diasQueFaltan() {
  const dias = Math.round((eleccion.fecha - hoy) / 86400000);
  if (dias === 0) return "¡es hoy! 😍";
  if (dias === 1) return "falta 1 día 🥰";
  return `faltan ${dias} días 🥰`;
}

function textoResumen() {
  let t = `¡Dije que sí! 💕\n\n`;
  t += `📅 Día: ${fechaBonita(eleccion.fecha)}\n`;
  t += `⏰ Hora: ${eleccion.hora}\n`;
  t += `🍽️ Comida: ${eleccion.comida}\n`;
  if (eleccion.nota) t += `💬 Nota: ${eleccion.nota}\n`;
  return t;
}

$("sigueComida").addEventListener("click", () => {
  eleccion.nota = $("notita").value.trim();

  $("tFecha").textContent = fechaBonita(eleccion.fecha);
  $("tHora").textContent = eleccion.hora;
  $("tComida").textContent = eleccion.comida;
  $("cuenta").textContent = diasQueFaltan();

  if (eleccion.nota) {
    $("tNota").textContent = eleccion.nota;
    $("lineaNota").hidden = false;
  }

  $("btnWhatsapp").href =
    `https://wa.me/${CONFIG.telefono}?text=${encodeURIComponent(textoResumen())}`;

  irAPaso(4);
});

$("btnCopiar").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(textoResumen());
    $("btnCopiar").textContent = "¡Copiado! ✅";
  } catch {
    $("btnCopiar").textContent = "Copia el texto de arriba 💕";
  }
  setTimeout(() => ($("btnCopiar").textContent = "Copiar"), 2500);
});
