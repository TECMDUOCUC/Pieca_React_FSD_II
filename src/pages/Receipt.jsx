import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { apiFetch, clp } from '../lib/api';

export default function Receipt() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    apiFetch(`/api/orders/${id}`)
      .then((data) => { if (alive) setReceipt(data); })
      .catch((e) => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        {loading && <div className="page-center"><div className="pieca-spinner" /></div>}
        {error && (
          <div className="text-center py-5 text-black">
            <div className="alert alert-danger text-black">{error}</div>
            <Link className="btn btn-light" to="/orders">Ver mis pedidos</Link>
          </div>
        )}
        {!loading && !error && receipt && (
          <div className="accountBox mx-auto text-black">
            <h1 className="mb-3 text-black">¡Pedido Confirmado!</h1>
            <p className="mb-1 text-black">Boleta: <strong>BOL-{receipt.id}</strong></p>
            <p className="mb-1 text-black">Estado: <StatusBadge status={receipt.status} /></p>
            <p className='text-black'>Fecha: {new Date(receipt.orderdate).toLocaleString('es-CL')}</p>

            <h2 className="h5 mt-4 text-black">Resumen del Pedido:</h2>
            <ul className="list-unstyled text-black">
              {receipt.items.map((item) => (
                <li key={item.id} className="d-flex justify-content-between py-1 text-black">
                  <span className='text-black'>{item.rock?.name ?? 'Producto'} (x{item.quantity})</span>
                  <span className='text-black'>{clp.format(item.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between border-top border-secondary pt-2 text-black">
              <strong>Total Pagado:</strong>
              <strong>{clp.format(receipt.total)}</strong>
            </div>

            <p className="text-secondary mt-3 text-black">
              El detalle del pedido ha sido guardado en tu cuenta. Puedes seguir su estado en "Mis Pedidos".
            </p>
            <div className="d-flex gap-2 mt-3">
              <Link className="btn btn-light" to="/">Volver al Inicio</Link>
              <Link className="btn btn-outline-light" to="/orders">Mis Pedidos</Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}