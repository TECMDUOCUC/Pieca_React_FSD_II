import { useState } from 'react';
import RockCard from '../components/RockCard.jsx';
import rocksData from '../data/rocks.json';
import Header from '../components/Header';
import Footer from '../components/Footer.jsx';
export default function CatalogPage() {

  const [query, setQuery] = useState('');
  const rocks = rocksData;

  const filtered = rocks.filter((rock) =>
    rock.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <Header/>
        <div className="container py-5">
          <h1 className="mb-4 text-black">Catálogo Pieca</h1>

          <div className="row g-4">
            <div className="col-lg-3">
              <div className="bg-black text-white rounded-4 p-3 sticky-lg-top">
                <label className="form-label fw-bold" htmlFor="catalog-search">
                  Buscar:
                </label>
                <input
                  id="catalog-search"
                  className="form-control form-control-lg"
                  type="search"
                  placeholder="Escriba el nombre de una piedra..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <p className="text-secondary mt-3 mb-0">
                  {filtered.length} producto(s) encontrados.
                </p>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="bg-black rounded-4 p-3 p-md-4">
                {filtered.length === 0 ? (
                  <div className="text-white py-5 text-center">
                    No se encontraron productos.
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 justify-content-center">
                  {filtered.map((rock, index) => (
                  <RockCard 
                    key={`${rock.name}-${index}`} 
                    item={rock} 
                    index={index} 
                    cardState="active" 
                  />
                ))}
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

      <Footer/>
    </>
    
  );
}



