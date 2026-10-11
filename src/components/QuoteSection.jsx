import { useState, useEffect } from 'react';

const phrases = [
  "El que esté libre de pecado, que tire la primera...",
  "Una mirada a Medusa, te convertirá en...",
  "Metiendo David su mano en la bolsa, tomó de allí una...",
  "Eternamente empujando la ladera, Sísifo volvió a caer con la...",
  "Quien logre sacarla del pedestal, reclamará la espada en la...",
  "Y Dios le ordenó a Moisés que subiera la montaña y tomara los mandamientos escritos en...",
  "Tranquilo, que nunca se tropieza dos veces con la misma..."
];

export default function QuoteSection({items}) {
  const [quote, setQuote] = useState('');
  const [stonedImage, setStonedImage] = useState('');

  useEffect(() => {
    if (items && items.length > 0) {
      setQuote(phrases[Math.floor(Math.random() * phrases.length)]);
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setStonedImage(randomItem.imgdir);
    }
  }, [items]);
  return (
    <section className="background-section text-center py-5">
      <div id="quote" className="mb-4 display-4 fade-in">
        {quote}
      </div>
      {stonedImage && (
        <img 
          id="stoned" 
          src={stonedImage} 
          alt="Stone" 
          className="img-fluid fade-in"
          style={{ width: '20%', maxWidth: '300px' }}
        />
      )}
    </section>
  );
}