import { Link } from 'react-router';

export default function RockCard({ item, index, cardState = 'active' }) {
  return (
    <div className={`card carousel-card h-100 ${cardState}`}>
      <div className="card-body d-flex flex-column align-items-center justify-content-between p-3 text-center text-white h-100 overflow-hidden">
        <h5 className="card-title m-0 fs-6">{item.name}</h5>

        <div className="carousel-card-media my-3">
          <img
            src={item.imgdir}
            alt={item.name}
            className="carousel-card-img"
          />
        </div>

        <div className="carousel-btn-wrapper mt-auto">
          <Link
            to={`/product?id=${index}`}
            className="btn btn-light rounded-pill fw-bold px-4 py-1 carousel-visit-btn text-decoration-none"
          >
            Visitar
          </Link>
        </div>
      </div>
    </div>
  );
}