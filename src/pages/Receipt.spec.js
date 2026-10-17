import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Receipt from './Receipt';
import rocksData from '../data/rocks.json';

describe('Pruebas de renderizado del Recibo', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    localStorage.clear();
  });

  it('debe mostrar mensaje de no pedidos si no hay receipt en localStorage', async () => {
    root.render(
      <BrowserRouter>
        <Receipt />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('No hay pedidos recientes.');
  });

  it('debe renderizar los detalles del último pedido realizado', async () => {
    const mockReceipt = {
      date: new Date().toISOString(),
      items: [{ id: 0, name: rocksData[0].name, quantity: 2, price: rocksData[0].price }],
      total: rocksData[0].price * 2,
      status: 'Procesando - Preparando Envío'
    };
    localStorage.setItem('pieca_receipt', JSON.stringify(mockReceipt));

    root.render(
      <BrowserRouter>
        <Receipt />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('¡Pedido Confirmado!');
    expect(container.textContent).toContain(mockReceipt.status);
    expect(container.textContent).toContain(rocksData[0].name);
    expect(container.textContent).toContain('(x2)');
  });

  it('debe formatear el total pagado en CLP', async () => {
    const mockReceipt = {
      date: new Date().toISOString(),
      items: [{ id: 0, name: 'Test', quantity: 1, price: 1000 }],
      total: 1000,
      status: 'Completado'
    };
    localStorage.setItem('pieca_receipt', JSON.stringify(mockReceipt));

    root.render(
      <BrowserRouter>
        <Receipt />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
    expect(container.textContent).toContain(formatter.format(1000));
  });

  it('debe mostrar la fecha del pedido formateada', async () => {
    const mockReceipt = {
      date: '2026-10-17T10:00:00.000Z',
      items: [],
      total: 0,
      status: 'Test'
    };
    localStorage.setItem('pieca_receipt', JSON.stringify(mockReceipt));

    root.render(
      <BrowserRouter>
        <Receipt />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check if some part of the date string appears
    expect(container.textContent).toContain('2026');
  });
});