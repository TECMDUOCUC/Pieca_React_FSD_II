import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import rocksData from '../data/rocks.json';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CART_KEY = 'pieca_cart';
const USER_KEY = 'pieca_user';

const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
});

const emptyData = {
  name: 'Not Found',
  price: 'N/A',
  'shipping-fee': 'N/A',
  weight: 'N/A',
  height: 'N/A',
  width: 'N/A',
  length: 'N/A',
  volume: 'N/A',
  imgdir: 'assets/attachment.gif',
};

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rock, setRock] = useState(null);
  const [addedFeedback, setAddedFeedback] = useState('');

  const id = parseInt(searchParams.get('id'), 10);

  useEffect(() => {
    if (!isNaN(id) && id >= 0 && id < rocksData.length) {
      setRock(rocksData[id]);
    } else {
      setRock(emptyData);
    }
  }, [id]);

  const handleAddToCart = () => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) {
      alert('Debe iniciar sesión para añadir productos al carrito.');
      navigate('/login');
      return;
    }

    if (isNaN(id) || id < 0 || id >= rocksData.length) {
      /* istanbul ignore next */
      alert('Error! ID Inexistente');
      return;
    }

    const cart = getCart();
    const existing = cart.find((entry) => entry.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, quantity: 1 });
    }
    saveCart(cart);
    setAddedFeedback('¡Añadido al carrito!');
    setTimeout(() => setAddedFeedback(''), 2000);
  };

  if (!rock) {
    return (
      <>
        <Header />
        <main className="flex-grow-1 d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const formatPrice = (value) => {
    const numeric = Number(value);
    return isNaN(numeric) ? 'N/A' : priceFormatter.format(numeric);
  };

  const specs = [
    { label: 'Peso', value: `${rock.weight} g` },
    { label: 'Altura', value: `${rock.height} mm` },
    { label: 'Anchura', value: `${rock.width} mm` },
    { label: 'Longitud', value: `${rock.length} mm` },
    { label: 'Volumen', value: `${rock.volume} mm³` },
    { label: 'Costo de envío', value: formatPrice(rock['shipping-fee']) },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow-1 container py-5">
        <div className="productAlign">
            <div className="productSquare">
                <img
                    src={rock.imgdir}
                    alt={rock.name}
                />
            </div>

            <div className="text-black">
                <h1 className="mb-3 fw-bold">{rock.name}</h1>
                <h2 className="mb-4 text-dark fw-semibold">{formatPrice(rock.price)}</h2>

                <table className="table table-bordered table-striped mb-4">
                <tbody>
                    {specs.map((spec) => (
                    <tr key={spec.label}>
                        <th className="ps-3 bg-light" style={{ width: '40%' }}>{spec.label}</th>
                        <td>{spec.value}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

                <div className="text-center mt-4">
                <button
                    className="btn btn-dark rounded-pill fw-bold px-5 py-2 fs-5"
                    onClick={handleAddToCart}
                    disabled={rock.name === 'Not Found'}
                >
                    Añadir a carrito
                </button>
                {addedFeedback && (
                    <p className="text-success fw-bold mt-3 fade-in">{addedFeedback}</p>
                )}
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}