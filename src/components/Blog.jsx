import { Row } from 'react-bootstrap';
import { Link } from 'react-router';

export default function Blog({ title, date, description, uri }) {
  return (
    <Row className="blog mx-auto mb-4">
      <article className="blog-card">
        <h2 className="h4 mb-1">{title}</h2>
        <p className="blog-date mb-2">Publicado el {date}</p>
        <p className="mb-2">{description}</p>
        <div className="text-align-right">
          <Link className="blog-more" to={uri}>Ver más...</Link>
        </div>
      </article>
    </Row>
  );
}