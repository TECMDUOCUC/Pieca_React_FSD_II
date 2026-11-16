import { useState } from 'react';
import { apiFetch, resolveImageUrl, clp } from '../../lib/api';
import RockForm from './RockForm';

export default function RocksTable({ rocks, canEdit, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const handleDelete = async (rock) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar la roca "${rock.name}"?`)) return;
    setError('');
    try {
      await apiFetch(`/api/rocks/${rock.id}`, { method: 'DELETE' });
      onChanged();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-dark align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Vista</th><th>Nombre</th><th>Precio</th><th>Stock</th>
              <th>Peso (g)</th><th>Dimensiones</th><th>Volumen</th>
              {canEdit && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {rocks.length === 0 ? (
              <tr><td colSpan={canEdit ? 9 : 8}>No hay rocas disponibles.</td></tr>
            ) : rocks.map((rock) => (
              <tr key={rock.id}>
                <td>#{rock.id}</td>
                <td><img className="admin-thumb" src={resolveImageUrl(rock.imgdir)} alt={rock.name} /></td>
                <td>{rock.name}</td>
                <td>{clp.format(rock.price)}</td>
                <td>{rock.stock <= 0 ? <span className="status-badge status-cancelled">Agotado</span> : rock.stock}</td>
                <td>{rock.weight ?? '—'} g</td>
                <td>{rock.height ?? '—'} × {rock.width ?? '—'} × {rock.length ?? '—'} mm</td>
                <td>{rock.volume ?? '—'} mm³</td>
                {canEdit && (
                  <td>
                    <button className="btn btn-outline-light btn-sm me-2" onClick={() => setEditing(rock)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rock)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="crop-modal">
          <div className="crop-dialog crop-dialog-wide">
            <RockForm initial={editing} onSaved={() => { setEditing(null); onChanged(); }} />
            <button className="btn btn-link text-secondary mt-2" onClick={() => setEditing(null)}>Cerrar sin guardar</button>
          </div>
        </div>
      )}
    </div>
  );
}