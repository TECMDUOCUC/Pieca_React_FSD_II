import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../lib/auth.jsx';
import { isValidDomain, validateRUT } from '../lib/validation';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({ name: '', rut: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateRUT(formData.rut)) return setError('El RUT ingresado no es válido.');
    if (!isValidDomain(formData.email)) return setError('Solo se permiten correos de @duoc.cl, @profesor.duoc.cl o @gmail.com');
    if (formData.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (formData.password !== formData.confirm) return setError('Las contraseñas no coinciden.');

    setBusy(true);
    try {
      await register({
        name: formData.name,
        rut: formData.rut,
        email: formData.email,
        password: formData.password,
      });
      alert('¡Registro exitoso!');
      navigate('/');
    } catch (err) {
      setError(err.message); // el backend también valida RUT/dominio/email duplicado
      setBusy(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <div className="accountBox mx-auto">
          <h1 className="mb-4 text-black">Regístrese</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-black">Nombre Completo</label>
              <input id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="rut" className="form-label text-black">RUT</label>
              <input id="rut" name="rut" className="form-control" placeholder="12.345.678-5"
                     value={formData.rut} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-black">Correo Electrónico</label>
              <input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-black">Contraseña</label>
              <input id="password" name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirm" className="form-label text-black">Confirmar Contraseña</label>
              <input id="confirm" name="confirm" type="password" className="form-control" value={formData.confirm} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-light w-100 text-white" disabled={busy}>
              {busy ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
          <div className='center'>
            <p className="mt-3 text-black">
            ¿Ya tiene una cuenta? <Link to="/login" className='text-black'>Inicie sesión</Link>
          </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}