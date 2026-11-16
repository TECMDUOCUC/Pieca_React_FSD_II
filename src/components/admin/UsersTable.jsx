import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../lib/auth.jsx';

const ROLES = ['ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CLIENT'];

export default function UsersTable() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch('/api/admin/users')
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeRole = async (user, role) => {
    setError('');
    try {
      await apiFetch(`/api/admin/users/${user.id}/role`, { method: 'PUT', body: { role } });
      load();
    } catch (e) {
      setError(e.message);
      load(); // revierte el select visualmente
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div className="page-center"><div className="pieca-spinner" /></div> : (
        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr><th>ID</th><th>RUT</th><th>Nombre</th><th>Email</th><th>Rol</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.rut ?? 'Sin RUT'}</td>
                  <td>{u.name}{u.email === me?.email && ' (tú)'}</td>
                  <td>{u.email}</td>
                  <td>
                    <select className="form-select form-select-sm role-select" value={u.role?.name ?? u.role}
                            disabled={u.email === me?.email}
                            onChange={(e) => changeRole(u, e.target.value)}>
                      {ROLES.map((r) => <option key={r} value={r}>{r.replace('ROLE_', '')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}