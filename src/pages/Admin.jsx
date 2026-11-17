import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RocksTable from '../components/admin/RocksTable';
import RockForm from '../components/admin/RockForm';
import UsersTable from '../components/admin/UsersTable';
import SalesTable from '../components/admin/SalesTable';
import { apiFetch } from '../lib/api';
import { useAuth } from '../lib/auth.jsx';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('rocks');
  const [rocks, setRocks] = useState([]);
  const [error, setError] = useState('');

  const tabs = isAdmin
    ? [['rocks', 'Inventario'], ['add', 'Añadir Roca'], ['users', 'Usuarios'], ['sales', 'Ventas']]
    : [['rocks', 'Inventario'], ['sales', 'Ventas']]; // SELLER: inventario de solo lectura + ventas

  const loadRocks = useCallback(() => {
    apiFetch('/api/rocks', { auth: false })
      .then(setRocks)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(loadRocks, [loadRocks]);

  return (
    <div className="app-container">
      <Header />
      <main className="container-fluid px-4 py-5 flex-grow-1">
        <h1 className="mb-4">
          {isAdmin ? 'Panel de Administración' : 'Panel de Vendedor'}
          <span className="role-chip ms-3 align-middle">{isAdmin ? 'ADMIN' : 'VENDEDOR'}</span>
        </h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-4 d-flex gap-2 flex-wrap">
          {tabs.map(([key, label]) => (
            <button key={key}
                    className={`btn ${activeTab === key ? 'btn-light' : 'btn-outline-light'}`}
                    onClick={() => setActiveTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'rocks' && <RocksTable rocks={rocks} canEdit={isAdmin} onChanged={loadRocks} />}
        {activeTab === 'add' && isAdmin && (
          <div className="accountBox">
            <RockForm onSaved={() => { loadRocks(); setActiveTab('rocks'); alert('¡Roca guardada exitosamente!'); }} />
          </div>
        )}
        {activeTab === 'users' && isAdmin && <UsersTable />}
        {activeTab === 'sales' && <SalesTable />}
      </main>
      <Footer />
    </div>
  );
}