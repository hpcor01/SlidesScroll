const API = "https://slides-backend-hu6m.onrender.com";

const form = document.getElementById("formSlide");
const lista = document.getElementById("listaSlides");
const verMaisBtn = document.getElementById("verMais");
const navbarData = document.getElementById("navbar-data");
const msg = document.getElementById("msg");

let slides = [];
let exibidos = 5;

function atualizarData() {
  navbarData.textContent = new Date().toLocaleString("pt-BR");
}
setInterval(atualizarData, 1000);
atualizarData();

async function carregarSlides() {
  msg.textContent = "";
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Resposta inválida: " + res.status);
    slides = await res.json();
    renderizarSlides();
  } catch (err) {
    msg.textContent = "Erro ao carregar slides.";
  }
}

function renderizarSlides() {
  lista.innerHTML = "";
  if (!slides.length) {
    lista.innerHTML = "<li class='empty'>Nenhum slide cadastrado.</li>";
    verMaisBtn.style.display = "none";
    return;
  }
  slides.slice(0, exibidos).forEach(s => {
    const li = document.createElement("li");
    li.className = "slide-item";
    li.innerHTML = `
      <div><strong>${s.assunto}</strong></div>
      <div>${s.texto}</div>
      <div class="slide-meta">${s.autor} • ${new Date(s.dataHora).toLocaleString()}</div>
    `;
    lista.appendChild(li);
  });
  verMaisBtn.style.display = slides.length > exibidos ? "block" : "none";
}

verMaisBtn.addEventListener("click", () => {
  exibidos += 5;
  renderizarSlides();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const assunto = document.getElementById("assunto").value.trim();
  const texto = document.getElementById("texto").value.trim();
  if (!assunto || !texto) {
    msg.textContent = "Preencha assunto e texto.";
    return;
  }
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assunto, texto })
    });
    if (!res.ok) throw new Error("Erro ao cadastrar");
    form.reset();
    carregarSlides();
  } catch (err) {
    msg.textContent = "Erro ao cadastrar slide.";
  }
});

document.addEventListener("DOMContentLoaded", carregarSlides);


