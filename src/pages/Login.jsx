import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <div className="accountBox mx-auto">
          <h1 className="mb-4 text-black">Inicie Sesión</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-black">Correo Electrónico</label>
              <input id="email" type="email" className="form-control" value={email}
                     onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-black">Contraseña</label>
              <input id="password" type="password" className="form-control" value={password}
                     onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-light w-100" disabled={busy}>
              {busy ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <div className='center'>
            <p className="mt-3 text-black">
            ¿No tiene una cuenta? <Link to="/register" className='text-black'>Regístrese aquí</Link>
          </p>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}