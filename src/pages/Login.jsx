import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { isValidDomain } from '../lib/validation';

const USER_KEY = 'pieca_user';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidDomain(email)) {
      setError('Solo se permiten correos de @duoc.cl, @profesor.duoc.cl o @gmail.com');
      return;
    }

    // Simulating login by storing user data (as per legacy logic)
    const user = { email, role: 'client' };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Redirect to home or previous page
    navigate('/');
  };

  return (
    <>
      <Header />
      <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="card p-4 shadow-lg accountBox">
          <h2 className="text-center mb-4">Inicie Sesión</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="form-control bg-dark text-white border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control bg-dark text-white border-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-light w-100 fw-bold">
              Iniciar Sesión
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">¿No tiene una cuenta? <Link to="/register" className="text-decoration-none">Regístrese aquí</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}