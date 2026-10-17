import { getStoredCustomRocks, getDeletedRockNames, saveCustomRocks, saveDeletedRockNames } from '../../lib/adminData';

export default function RocksTable({ allRocks, setAllRocks }) {
  const handleDelete = (index) => {
    const targetRock = allRocks[index];
    if (!targetRock) return;

    if (window.confirm(`¿Está seguro de que desea eliminar la roca "${targetRock.name}"?`)) {
      // Check if it's a custom rock or a default one
      const customRocks = getStoredCustomRocks();
      const isCustom = customRocks.some(r => r.name === targetRock.name);

      if (isCustom) {
        const updatedCustom = customRocks.filter(r => r.name !== targetRock.name);
        saveCustomRocks(updatedCustom);
      } else {
        const deletedNames = getDeletedRockNames();
        deletedNames.push(targetRock.name);
        saveDeletedRockNames(deletedNames);
      }

      // Update local state
      const newRocks = [...allRocks];
      newRocks.splice(index, 1);
      setAllRocks(newRocks);
    }
  };

  const priceFormatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th><th>Vista</th><th>Nombre</th><th>Precio</th><th>Peso (g)</th><th>Dimensiones</th><th>Volumen</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allRocks.length === 0 ? (
            <tr><td colSpan="8" className="text-center text-muted">No hay rocas disponibles.</td></tr>
          ) : (
            allRocks.map((rock, index) => (
              <tr key={`${rock.name}-${index}`}>
                <td><code>#{index}</code></td>
                <td><img src={rock.imgdir} alt={rock.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} /></td>
                <td><strong>{rock.name}</strong></td>
                <td>{priceFormatter.format(rock.price)}</td>
                <td>{rock.weight} g</td>
                <td>{rock.height} × {rock.width} × {rock.length} mm</td>
                <td>{rock.volume} mm³</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}