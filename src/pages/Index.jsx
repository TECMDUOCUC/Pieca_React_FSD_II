import "../css/App.css";
import QuoteSection from "../components/QuoteSection";
import Home from "../components/Home";
import Footer from "../components/Footer";
import { useState, useEffect } from 'react';
import Carousel from "../components/Carousel";

export default function Index() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/rocks.json`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load items:', err);
        setLoading(false);
      });
  }, []);


  return (
    <>
      <QuoteSection items={items}/>

      <main className="flex-grow-1">
        <Carousel items={items}/>
        <Home items={items} loading={loading}/>
      </main>

      <Footer/>
    </>
  );
}
