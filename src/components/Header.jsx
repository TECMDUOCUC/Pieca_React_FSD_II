import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

const USER_KEY = 'pieca_user';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status on mount and listen for storage changes
    const checkUser = () => {
      setIsLoggedIn(!!localStorage.getItem(USER_KEY));
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    
    // Cleanup listener
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-black text-white py-2 px-4 mt-auto d-flex justify-content-between align-items-center py-2">
      <Link to="/" className="text-white text-decoration-none h3"><b>Pieca&reg;</b></Link>
      
      <p className="m-0 d-none d-md-block">&copy; 2026 Pieca&reg;. Todos los derechos reservados.</p>

      <div className='row text-align-right'>
        {!isLoggedIn ? (
          // Layout for Non-Logged In Users
          <>
            <Link to="/register" className="text-white text-decoration-none">Registrarse</Link>
            <Link to="/login" className="text-white text-decoration-none">Iniciar Sesión</Link>
          </>
        ) : (
          // Layout for Logged In Users
          <>
            <Link to="/cart" className="text-white text-decoration-none">Carrito</Link>
            <Link to="/admin" className="text-white text-decoration-none">Admin</Link>
            <button 
              onClick={handleLogout} 
              className="light-button text-align-right"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}