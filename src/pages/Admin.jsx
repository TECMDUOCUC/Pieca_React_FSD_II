import { useState, useEffect } from 'react';
import rocksData from '../data/rocks.json';
import { getStoredCustomRocks, getDeletedRockNames } from '../lib/adminData';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RocksTable from '../components/admin/RocksTable';
import AddRockForm from '../components/admin/AddRockForm';
import UsersTable from '../components/admin/UsersTable';
import SalesTable from '../components/admin/SalesTable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('rocks');
  const [allRocks, setAllRocks] = useState([]);

  useEffect(() => {
    const customRocks = getStoredCustomRocks();
    const deletedNames = new Set(getDeletedRockNames());
    const baseMerged = [...rocksData, ...customRocks];
    const filtered = baseMerged.filter(rock => !deletedNames.has(rock.name));
    setAllRocks(filtered);
  }, []);

  const handleRockAdded = (newRock) => {
    setAllRocks([...allRocks, newRock]);
  };

  return (
    <>
      <Header />
      <main className="flex-grow-1 container py-5">
        <h1 className="text-black mb-4 text-center">Panel de Administración</h1>
        
        <div className="d-flex justify-content-center gap-2 mb-4">
          {['rocks', 'add', 'users', 'sales'].map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-light' : 'btn-outline-light'} rounded-pill px-4`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'rocks' ? 'Inventario' : tab === 'add' ? 'Añadir Roca' : tab === 'users' ? 'Usuarios' : 'Ventas'}
            </button>
          ))}
        </div>

        <div className="bg-black rounded-4 p-4 min-vh-50">
          {activeTab === 'rocks' && <RocksTable allRocks={allRocks} setAllRocks={setAllRocks} />}
          {activeTab === 'add' && <AddRockForm onRockAdded={handleRockAdded} />}
          {activeTab === 'users' && <UsersTable />}
          {activeTab === 'sales' && <SalesTable />}
        </div>
      </main>
      <Footer />
    </>
  );
}