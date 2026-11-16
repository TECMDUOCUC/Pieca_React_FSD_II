import { useEffect, useState } from 'react';
import RockCard from '../components/RockCard.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx';
import { apiFetch } from '../lib/api';

export default function CatalogPage() {
  const [rocks, setRocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;
    apiFetch('/api/rocks', { auth: false })
      .then((data) => { if (alive) setRocks(data ?? []); })
      .catch((e) => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = rocks.filter((rock) =>
    rock.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <h1 className="mb-4">Catálogo Pieca</h1>

        <div className="mb-4">
          <label htmlFor="catalog-search" className="form-label">Buscar:</label>
          <input id="catalog-search" className="form-control" type="search"
                 value={query} onChange={(e) => setQuery(e.target.value)}
                 placeholder="Nombre de la piedra..." />
          <small className="text-secondary">{filtered.length} producto(s) encontrados.</small>
        </div>

        {loading && <div className="page-center"><div className="pieca-spinner" /></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          filtered.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <div className="d-flex flex-wrap gap-4 justify-content-center">
              {filtered.map((rock) => (
                <RockCard key={rock.id} item={rock} cardState="active" />
              ))}
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}