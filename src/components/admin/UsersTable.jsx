import { MOCK_USERS } from '../../lib/adminData';

export default function UsersTable() {
  const storedUser = localStorage.getItem('pieca_user');
  let usersList = [...MOCK_USERS];

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.email && !usersList.some(u => u.email === parsed.email)) {
        usersList.unshift({
          rut: parsed.rut || "Sin RUT",
          name: parsed.name || "Usuario Activo",
          username: parsed.username || "usuario_demo",
          email: parsed.email,
          role: "Cliente"
        });
      }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr><th>RUT</th><th>Nombre Completo</th><th>Usuario</th><th>Email</th><th>Rol</th></tr>
        </thead>
        <tbody>
          {usersList.map((user, i) => (
            <tr key={i}>
              <td><code>{user.rut}</code></td>
              <td>{user.name}</td>
              <td>@{user.username}</td>
              <td>{user.email}</td>
              <td><span className={`badge ${user.role === 'Administrador' ? 'bg-success' : 'bg-warning text-dark'}`}>{user.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}