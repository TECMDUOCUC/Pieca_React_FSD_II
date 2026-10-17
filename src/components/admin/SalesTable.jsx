import { MOCK_SALES } from '../../lib/adminData';

export default function SalesTable() {
  const storedReceipt = localStorage.getItem('pieca_receipt');
  let salesList = [...MOCK_SALES];

  if (storedReceipt) {
    try {
      const parsed = JSON.parse(storedReceipt);
      salesList.unshift({
        id: "BOL-" + Math.floor(10000 + Math.random() * 90000),
        date: new Date(parsed.date).toLocaleString('es-CL'),
        customer: "Cliente Actual (Sesión)",
        items: `${parsed.items.length} tipo(s) de roca`,
        total: parsed.total,
        status: parsed.status || "Pendiente"
      });
    } catch (e) { console.error(e); }
  }

  const priceFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr><th>Nº Boleta</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {salesList.map((sale, i) => (
            <tr key={i}>
              <td><code>{sale.id}</code></td>
              <td>{sale.date}</td>
              <td>{sale.customer}</td>
              <td>{sale.items}</td>
              <td>{priceFormatter.format(sale.total)}</td>
              <td><span className={`badge ${sale.status === 'Completado' ? 'bg-success' : 'bg-warning text-dark'}`}>{sale.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}