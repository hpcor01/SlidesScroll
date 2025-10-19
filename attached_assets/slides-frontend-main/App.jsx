import React, { useState, useEffect } from "react";
import "./Slides.css";

const API_URL = "https://slides-backend-hu6m.onrender.com";

export default function App() {
  const [assunto, setAssunto] = useState("");
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [slides, setSlides] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [expandidos, setExpandidos] = useState({}); // controla expandido por id

  useEffect(() => {
    carregarSlides();
  }, []);

  async function carregarSlides() {
    setCarregando(true);
    setMensagem("");
    try {
      const res = await fetch(`${API_URL}/`);
      if (!res.ok) throw new Error("Erro ao buscar slides");
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      setMensagem("Erro ao carregar dados.");
      setSlides([]);
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarSlide(e) {
    e.preventDefault();
    if (!assunto || !texto) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    setMensagem("Cadastrando...");
    const novoSlide = {
      data: new Date().toISOString(),
      assunto,
      texto,
      autor: autor || "Autor Teste"
    };

    try {
      const res = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoSlide)
      });

      if (!res.ok) throw new Error("Erro ao cadastrar slide");

      setAssunto("");
      setTexto("");
      setAutor("");
      setMensagem("Slide cadastrado com sucesso!");
      await carregarSlides();
    } catch (err) {
      setMensagem("Erro ao cadastrar slide.");
    }
  }

  const slidesExibidos = mostrarTodos ? slides : slides.slice(0, 5);

  // Funções para expandir/recolher textos
  function isTextoLongo(texto) {
    return texto.split('\n').length > 5;
  }
  function getTextoResumido(texto) {
    return texto.split('\n').slice(0, 5).join('\n');
  }
  function toggleExpand(id) {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Cadastro de Slides</h1>
        <span>{new Date().toLocaleDateString("pt-BR")}</span>
      </nav>

      <form className="formulario" onSubmit={cadastrarSlide}>
        <input
          type="text"
          placeholder="Assunto"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
        <textarea
          placeholder="Texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>

      {mensagem && <div className="msg">{mensagem}</div>}

      <h2>Slides Cadastrados</h2>
      <ul className="lista-slides">
        {carregando ? (
          <li className="empty">Carregando dados...</li>
        ) : slidesExibidos.length === 0 ? (
          <li className="empty">Nenhum slide cadastrado.</li>
        ) : (
          slidesExibidos.map((item) => (
            <li key={item._id}>
              <strong>{item.slide.assunto}</strong> <br />
              {isTextoLongo(item.slide.texto) ? (
                expandidos[item._id] ? (
                  <>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{item.slide.texto}</pre>
                    <a href="#" style={{color:'#1976d2'}} onClick={e => {e.preventDefault(); toggleExpand(item._id);}}>Ver menos</a>
                  </>
                ) : (
                  <>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{getTextoResumido(item.slide.texto)}</pre>
                    <a href="#" style={{color:'#1976d2'}} onClick={e => {e.preventDefault(); toggleExpand(item._id);}}>Ver mais</a>
                  </>
                )
              ) : (
                <pre style={{ whiteSpace: "pre-wrap" }}>{item.slide.texto}</pre>
              )}
              <small>
                Autor: {item.slide.autor} | Data:{" "}
                {item.slide.data
                  ? new Date(item.slide.data).toLocaleString("pt-BR")
                  : ""}
              </small>
            </li>
          ))
        )}
      </ul>

      {!carregando && slides.length > 5 && (
        <button onClick={() => setMostrarTodos(!mostrarTodos)}>
          {mostrarTodos ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </div>
  );
}
