import React, { useEffect, useState } from "react";
import ExpandableText from "./ExpandableText.jsx";
import Pagination from "./Pagination.jsx";

/**
 * Exemplo de página que consome a API paginada no backend:
 * GET /api/slides?page=1&perPage=10
 * Resposta esperada: { data: [...], total: number, page: number, perPage: number }
 *
 * Adapte a importação/uso conforme sua arquitetura de rotas.
 */
export default function SlidesList() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/slides?page=${page}&perPage=${perPage}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erro na requisição");
        }
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        setItems(json.data || []);
        setTotal(json.total || 0);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Erro");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div>
      <h2>Slides</h2>

      {loading && <div>Carregando...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <ul style={{ padding: 0 }}>
        {items.map((item) => (
          <li key={item.id || item._id} style={{ marginBottom: 16, listStyle: "none" }}>
            <h3>{item.title}</h3>
            <ExpandableText text={item.description || item.text || ""} />
          </li>
        ))}
      </ul>

      <Pagination page={page} perPage={perPage} total={total} onChange={(p) => setPage(p)} />
    </div>
  );
}