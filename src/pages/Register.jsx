import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { isValidDomain, validateRUT } from '../lib/validation';

const USER_KEY = 'pieca_user';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateRUT(formData.rut)) {
      setError('El RUT ingresado no es válido.');
      return;
    }

    if (!isValidDomain(formData.email)) {
      setError('Solo se permiten correos de @duoc.cl, @profesor.duoc.cl o @gmail.com');
      return;
    }

    // Store user data as per legacy logic
    localStorage.setItem(USER_KEY, JSON.stringify(formData));
    
    alert('¡Registro exitoso!');
    navigate('/');
  };

  return (
    <>
      <Header />
      <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="card p-4 shadow-lg accountBox">
          <h2 className="text-center mb-4">Regístrese</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control bg-dark text-white border-secondary"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rut" className="form-label">RUT</label>
              <input
                type="text"
                id="rut"
                name="rut"
                className="form-control bg-dark text-white border-secondary"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control bg-dark text-white border-secondary"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control bg-dark text-white border-secondary"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-light w-100 fw-bold">
              Registrar
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">¿Ya tiene una cuenta? <Link to="/login" className="text-decoration-none">Inicie sesión</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}