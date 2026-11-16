import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth.jsx';

const ROLE_LABEL = { ROLE_ADMIN: 'ADMIN', ROLE_SELLER: 'VENDEDOR', ROLE_CLIENT: 'CLIENTE' };

export default function Header() {
  const { user, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    logout();
    navigate('/');
  };

  return (
    <header className="pieca-header">
      <div className="pieca-nav">
        <Link className="pieca-brand" to="/" onClick={close}>Pieca®</Link>

        {/* Botón hamburguesa 100% propio: mismo look en todos los navegadores */}
        <button
          type="button"
          className={`pieca-burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <nav className={`pieca-menu ${open ? 'is-open' : ''}`}>
          <Link className="pieca-link" to="/catalog" onClick={close}>Catálogo</Link>
          <Link className="pieca-link" to="/blogs" onClick={close}>Blog</Link>
          <Link className="pieca-link" to="/contact" onClick={close}>Contáctanos</Link>

          {!user ? (
            <>
              <Link className="pieca-link" to="/register" onClick={close}>Registrarse</Link>
              <Link className="btn btn-light btn-sm" to="/login" onClick={close}>Iniciar Sesión</Link>
            </>
          ) : (
            <>
              <Link className="pieca-link" to="/cart" onClick={close}>Carrito</Link>
              <Link className="pieca-link" to="/orders" onClick={close}>Mis Pedidos</Link>
              {isStaff && (
                <Link className="pieca-link" to="/admin" onClick={close}>Panel</Link>
              )}
              <span className="pieca-user">
                {user.name}
                <span className="role-chip">{ROLE_LABEL[user.role] ?? 'CLIENTE'}</span>
              </span>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}