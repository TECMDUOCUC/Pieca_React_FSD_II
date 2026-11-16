import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiFetch, resolveImageUrl, clp } from '../lib/api';
import { addToCart } from '../lib/cart';
import { useAuth } from '../lib/auth.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rock, setRock] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let alive = true;
    setRock(null); setNotFound(false); setError('');
    apiFetch(`/api/rocks/${id}`, { auth: false })
      .then((data) => { if (alive) setRock(data); })
      .catch((e) => {
        if (!alive) return;
        if (e.status === 404) setNotFound(true);
        else setError(e.message);
      });
    return () => { alive = false; };
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Debe iniciar sesión para añadir productos al carrito.');
      navigate('/login');
      return;
    }
    addToCart(rock.id, quantity);
    setFeedback('¡Añadido al carrito!');
    setTimeout(() => setFeedback(''), 2000);
  };

  if (error) {
    return (
      <div className="app-container"><Header />
        <main className="container py-5"><div className="alert alert-danger">{error}</div></main>
        <Footer /></div>
    );
  }

  if (notFound) {
    return (
      <div className="app-container"><Header />
        <main className="container py-5 text-center text-black">
          <h1>Not Found</h1>
          <p>Esta roca no existe (o fue eliminada del catálogo).</p>
        </main>
        <Footer /></div>
    );
  }

  if (!rock) {
    return (
      <div className="app-container"><Header />
        <main className="page-center flex-grow-1"><div className="pieca-spinner" /></main>
        <Footer /></div>
    );
  }

  const soldOut = rock.stock <= 0;
  const specs = [
    { label: 'Peso', value: `${rock.weight ?? 'N/A'} g` },
    { label: 'Altura', value: `${rock.height ?? 'N/A'} mm` },
    { label: 'Anchura', value: `${rock.width ?? 'N/A'} mm` },
    { label: 'Longitud', value: `${rock.length ?? 'N/A'} mm` },
    { label: 'Volumen', value: `${rock.volume ?? 'N/A'} mm³` },
    { label: 'Stock disponible', value: rock.stock },
  ];

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <div className="productAlign flex-wrap">
          <div className="productSquare">
            <img src={resolveImageUrl(rock.imgdir)} alt={rock.name} />
          </div>
          <div className="productDetails">
            <h1 className='text-black'>{rock.name}</h1>
            <h2 className="mb-4 text-black">{clp.format(rock.price)}</h2>
            <table className="table table-dark">
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.label}><td>{spec.label}</td><td>{spec.value}</td></tr>
                ))}
              </tbody>
            </table>

            {!soldOut && (
              <div className="d-flex align-items-center gap-3 mb-3">
                <label htmlFor="qty" className="form-label mb-0 text-black">Cantidad:</label>
                <input id="qty" type="number" className="form-control qty-input" min={1} max={rock.stock}
                       value={quantity}
                       onChange={(e) => setQuantity(Math.max(1, Math.min(rock.stock, Number(e.target.value) || 1)))} />
              </div>
            )}

            <button className="btn btn-light px-4" onClick={handleAddToCart} disabled={soldOut}>
              {soldOut ? 'Agotado' : 'Añadir a carrito'}
            </button>
            {feedback && <div className="alert alert-success mt-3 py-2">{feedback}</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}