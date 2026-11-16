import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import { apiFetch, clp } from '../lib/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    apiFetch('/api/orders/me')
      .then((data) => { if (alive) setOrders(data ?? []); })
      .catch((e) => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <h1 className="mb-4">Mis Pedidos</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="page-center"><div className="pieca-spinner" /></div>}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-5">
            <p>Aún no tienes pedidos.</p>
            <Link className="btn btn-light" to="/catalog">Ir al Catálogo</Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="table-responsive">
            <table className="table table-dark align-middle">
              <thead>
                <tr><th>Boleta</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>BOL-{o.id}</td>
                    <td>{new Date(o.orderdate).toLocaleString('es-CL')}</td>
                    <td>{o.items.map((i) => `${i.rock?.name ?? '?'} (x${i.quantity})`).join(', ')}</td>
                    <td>{clp.format(o.total)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td><Link className="btn btn-outline-light btn-sm" to={`/receipt/${o.id}`}>Ver recibo</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}