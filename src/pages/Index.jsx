import { useEffect, useState } from 'react';
import QuoteSection from '../components/QuoteSection';
import Home from '../components/Home';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import { apiFetch } from '../lib/api';

export default function Index() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    apiFetch('/api/rocks', { auth: false })
      .then((rocks) => { if (alive) setItems(rocks ?? []); })
      .catch(() => { if (alive) setItems([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="app-container">
      <QuoteSection items={items} />
      <Carousel items={items} />
      <Home items={items} loading={loading} />
      <Footer />
    </div>
  );
}