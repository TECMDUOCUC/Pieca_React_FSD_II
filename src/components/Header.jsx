import { Link } from 'react-router';

export default function Header() {
  return (
    <header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center" style={{ height: '100px' }}>
      <h2 className="m-0">Pieca</h2>
      <nav>
        <Link to="/" className="text-white text-decoration-none me-3">Nuestras Piedras</Link>
        <Link to="/catalog" className="text-white text-decoration-none me-3">Ver Todo</Link>
        <a href="#" className="text-white text-decoration-none">Sobre nosotros</a>
      </nav>
    </header>
  );
}
