import "../css/App.css";
import QuoteSection from "../components/QuoteSection";
import Home from "../components/Home";
import Footer from "../components/Footer";
import { useState, useEffect } from 'react';
import Carousel from "../components/Carousel";
import rocksData from '../data/rocks.json';

export default function Index() {
  const items = rocksData;

  return (
    <>
      <QuoteSection items={items}/>

      <main className="flex-grow-1">
        <Carousel items={items}/>
        <Home items={items} loading={false}/>
      </main>

      <Footer/>
    </>
  );
}
