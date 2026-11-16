import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiFetch, clp } from '../lib/api';
import { getCart, setQuantity, clearCart } from '../lib/cart';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rocks = await apiFetch('/api/rocks', { auth: false });
        const byId = new Map(rocks.map((r) => [r.id, r]));
        const enriched = getCart()
          .map((item) => {
            const product = byId.get(item.id);
            return product ? { ...product, quantity: item.quantity } : null;
          })
          .filter(Boolean);
        if (alive) setCartItems(enriched);
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const updateQuantity = (id, amount) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const next = Math.max(0, Math.min(item.stock, item.quantity + amount));
    setQuantity(id, next);
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: next } : i)).filter((i) => i.quantity > 0));
  };

  const removeItem = (id) => {
    setQuantity(id, 0);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || processing) return;
    setProcessing(true);
    setError('');
    try {
      // El backend simula ~5 s de procesamiento de pago. Timeout amplio (20 s).
      const order = await apiFetch('/api/orders', {
        method: 'POST',
        body: { items: cartItems.map((i) => ({ rockId: i.id, quantity: i.quantity })) },
        timeout: 20000,
      });
      clearCart();
      navigate(`/receipt/${order.id}`);
    } catch (e) {
      // Wifi cortado, timeout, stock insuficiente, sesión expirada... todo cae aquí.
      setError(`La compra falló: ${e.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1 text-black">
        <h1 className="mb-4">Carrito de Compras</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="page-center"><div className="pieca-spinner" /></div>}

        {!loading && cartItems.length === 0 ? (
          <div className="text-center py-5">
            <p>El carrito está vacío.</p>
            <button className="btn btn-light" onClick={() => navigate('/catalog')}>Volver al Catálogo</button>
          </div>
        ) : (
          !loading && (
            <div className="accountBox mx-auto ">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-row d-flex justify-content-between align-items-center py-3 text-black">
                  <div>
                    <strong>{item.name}</strong>
                    <div><small>{clp.format(item.price)} c/u</small></div>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-black">
                    <button className="btn btn-outline-light btn-sm" disabled={processing}
                            onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-outline-light btn-sm" disabled={processing || item.quantity >= item.stock}
                            onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="btn btn-link text-danger btn-sm" disabled={processing}
                            onClick={() => removeItem(item.id)}>Eliminar</button>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between align-items-center py-3 border-top border-secondary text-black">
                <strong>Total:</strong>
                <strong>{clp.format(total)}</strong>
              </div>

              <div className="text-center mt-3">
                <button className="btn btn-light px-5" onClick={handleCheckout} disabled={processing}>
                  {processing ? 'Procesando pago...' : 'Proceder al Pago'}
                </button>
                {processing && (
                  <div className="mt-3 text-black">
                    <div className="pieca-spinner mx-auto" />
                    <p className="mt-2 text-secondary">
                      Procesando el pago. No cierres esta ventana.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}