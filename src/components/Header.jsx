import { Link } from 'react-router';

export default function Header() {
  return (
    <header className="bg-black text-white py-2 px-4 mt-auto d-flex justify-content-between align-items-center text-align-right" style={{ height: '90px' }}>
      <Link to="/" className="text-white text-decoration-none h3"><b>Pieca&reg;</b></Link>
      <p className="m-0 d-md-block">&copy; 2026 Pieca&reg;. Todos los derechos reservados.</p>
      <div className='row'>
        <Link to="/catalog" className="text-white text-decoration-none">Nuestras Piedras</Link>
        <Link to="/#about" className="text-white text-decoration-none">Sobre nosotros</Link>
      </div>
    </header>
  );
}
