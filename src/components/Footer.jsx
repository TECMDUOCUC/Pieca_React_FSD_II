import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="bg-black text-white py-2 px-4 mt-auto d-flex justify-content-between align-items-center" style={{ height: '70px' }}>
      
      <h2 className="m-0 h4">
        <Link to="/" className="text-white text-decoration-none"><b>Pieca&reg;</b></Link>
      </h2>

      <p className="m-0 d-md-block">&copy; 2026 Pieca&reg;. Todos los derechos reservados.</p>

      <div className="row">
        <Link to="/blog" className="text-white text-decoration-none">Blog</Link>
        <Link to="/contact" className="text-white text-decoration-none">Contáctanos</Link>
      </div>

    </footer>
  );
}

export default Footer;