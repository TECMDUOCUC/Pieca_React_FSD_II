import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RECEIPT_KEY = 'pieca_receipt';
const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
});

export default function Receipt() {
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(RECEIPT_KEY);
    if (raw) {
      setReceipt(JSON.parse(raw));
    }
  }, []);

  if (!receipt) {
    return (
      <>
        <Header />
        <main className="flex-grow-1 d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center text-black">
            <h2>No hay pedidos recientes.</h2>
            <Link to="/" className="btn btn-dark mt-3">Volver al Inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow-1 container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="bg-black text-white rounded-4 p-5 text-center shadow-lg">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success fs-1"></i>
                <h2 className="text-success mt-2">¡Pedido Confirmado!</h2>
              </div>
              
              <p className="fs-5">Estado: <span className="fw-bold">{receipt.status}</span></p>
              <p className="text-secondary">Fecha: {new Date(receipt.date).toLocaleString()}</p>
              
              <hr className="border-secondary my-4" />
              
              <div className="text-start mb-4">
                <h4 className="mb-3">Resumen del Pedido:</h4>
                {receipt.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{priceFormatter.format(item.price * item.quantity)}</span>
                  </div>
                ))}
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total Pagado:</span>
                  <span className="text-warning">{priceFormatter.format(receipt.total)}</span>
                </div>
              </div>

              <p className="small text-secondary mb-4">
                El detalle del pedido ha sido guardado. Los productos llegarán pronto a su destino.
              </p>

              <Link to="/" className="btn btn-light rounded-pill fw-bold px-4">
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}