import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import rocksData from '../data/rocks.json';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CART_KEY = 'pieca_cart';
const RECEIPT_KEY = 'pieca_receipt';

const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
});

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

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cart = getCart();
    // Enrich cart with product data from rocks.json
    const enriched = cart.map(item => {
      const product = rocksData[item.id];
      return product ? { ...product, quantity: item.quantity, id: item.id } : null;
    }).filter(Boolean);
    
    setCartItems(enriched);
    
    // Calculate total
    const newTotal = enriched.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, []);

  const updateQuantity = (id, amount) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + amount) };
      }
      return item;
    }).filter(item => item.quantity > 0);

    // Update local state and localStorage
    const storageCart = updatedCart.map(({ id, quantity }) => ({ id, quantity }));
    saveCart(storageCart);
    setCartItems(updatedCart);
    
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const removeItem = (id) => {
    updateQuantity(id, -1000); // Effectively removes it
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const receipt = {
      date: new Date().toISOString(),
      items: cartItems.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
      total: total,
      status: "Procesando - Preparando Envío",
      saleID: "PLACEHOLDERUNIQUEID"
    };

    localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
    localStorage.removeItem(CART_KEY);
    
    // Refresh cart state to empty before navigating
    setCartItems([]);
    setTotal(0);
    
    navigate('/receipt');
  };

  return (
    <>
      <Header />
      <main className="flex-grow-1 container py-5">
        <h1 className="text-black mb-4 text-center">Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-black rounded-4 text-white">
            <p className="fs-4">El carrito está vacío.</p>
            <button 
              className="btn btn-light mt-3" 
              onClick={() => navigate('/catalog')}
            >
              Volver al Catálogo
            </button>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-black rounded-4 p-4 text-white">
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom border-secondary py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.imgdir} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <h5 className="m-0">{item.name}</h5>
                        <small className="text-secondary">{priceFormatter.format(item.price)} c/u</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-3">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-light" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className="btn btn-sm btn-dark disabled text-white">{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-light" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => removeItem(item.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                  <h3>Total:</h3>
                  <h2 className="text-warning">{priceFormatter.format(total)}</h2>
                </div>

                <div className="text-center mt-4">
                  <button 
                    className="btn btn-light fw-bold px-5 py-2 rounded-pill"
                    onClick={handleCheckout}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}