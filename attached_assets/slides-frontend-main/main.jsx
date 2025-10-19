import React from "react";
import { createRoot } from "react-dom/client";

// Ajuste o nome do import se você renomeou o arquivo SlidesList.example.jsx
import SlidesList from "./SlidesList.example.jsx";

// Importe seu CSS global (opcional)
import "./Slides.css";

function App() {
  return (
    <div className="app">
      <SlidesList />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
