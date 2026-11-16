import { useEffect, useState } from 'react';
import { apiFetch, clp } from '../../lib/api';
import StatusBadge, { STATUS_OPTIONS } from '../StatusBadge';
import { useAuth } from '../../lib/auth.jsx';

export default function SalesTable() {
  const { isAdmin } = useAuth();
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch('/api/admin/sales')
      .then(setSales)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async (sale, status) => {
    setError('');
    try {
      await apiFetch(`/api/admin/sales/${sale.id}/status`, { method: 'PUT', body: { status } });
      load();
    } catch (e) {
      setError(e.message);
      load();
    }
  };

  const handleDelete = async (sale) => {
    if (!window.confirm(`¿Eliminar la venta BOL-${sale.id}? Si está activa, el stock será devuelto.`)) return;
    setError('');
    try {
      await apiFetch(`/api/admin/sales/${sale.id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div className="page-center"><div className="pieca-spinner" /></div> : (
        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr><th>Nº Boleta</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Cambiar estado</th>{isAdmin && <th></th>}</tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7}>No hay ventas registradas.</td></tr>
              ) : sales.map((sale) => (
                <tr key={sale.id}>
                  <td>BOL-{sale.id}</td>
                  <td>{new Date(sale.orderdate).toLocaleString('es-CL')}</td>
                  <td>{sale.user?.name}<br /><small className="text-secondary">{sale.user?.email}</small></td>
                  <td>{sale.items.map((i) => `${i.rock?.name ?? '?'} (x${i.quantity})`).join(', ')}</td>
                  <td>{clp.format(sale.total)}</td>
                  <td><StatusBadge status={sale.status} /></td>
                  <td>
                    <select className="form-select form-select-sm" value={sale.status}
                            disabled={['DELIVERED', 'CANCELLED', 'FAILED'].includes(sale.status)}
                            onChange={(e) => changeStatus(sale, e.target.value)}>
                      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  {isAdmin && (
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(sale)}>Eliminar</button></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}