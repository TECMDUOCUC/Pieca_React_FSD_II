const MAP = {
  PROCESSING: { label: 'Procesando', cls: 'status-processing' },
  SHIPPING:   { label: 'En envío',   cls: 'status-shipping' },
  DELIVERED:  { label: 'Entregado',  cls: 'status-delivered' },
  CANCELLED:  { label: 'Cancelado',  cls: 'status-cancelled' },
  FAILED:     { label: 'Fallido',    cls: 'status-failed' },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] ?? { label: status ?? '—', cls: 'status-processing' };
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
}

export const STATUS_OPTIONS = Object.entries(MAP).map(([value, { label }]) => ({ value, label }));