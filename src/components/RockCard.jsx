import { Link } from 'react-router';
import { resolveImageUrl, clp } from '../lib/api';

export default function RockCard({ item, cardState = 'active' }) {
  const soldOut = item.stock != null && item.stock <= 0;

  return (
    <div className={`carousel-card d-flex flex-column ${cardState}`}>
      <div className="carousel-card-media">
        <img className="carousel-card-img" src={resolveImageUrl(item.imgdir)} alt={item.name} loading="lazy" />
      </div>
      <div className="text-center px-2">
        <div className="text-truncate fw-bold">{item.name}</div>
        <small>{clp.format(item.price)}</small>
        {soldOut && <div><span className="status-badge status-cancelled">Agotado</span></div>}
      </div>
      <div className="carousel-btn-wrapper">
        <Link className="btn btn-sm carousel-visit-btn" to={`/product/${item.id}`}>Visitar</Link>
      </div>
    </div>
  );
}