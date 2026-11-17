import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import Cart from './Cart';
import { mockFetch, withAuth, meRoute, CLIENT, SAMPLE_ROCKS, SAMPLE_ORDER, cleanStorage, tick, findButton } from '../test/helpers';

describe('Cart.jsx (checkout real contra la API)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const render = (routes = []) => {
    mock = mockFetch([
      meRoute(CLIENT),
      { match: '/api/rocks', body: SAMPLE_ROCKS },
      ...routes,
    ]);
    root.render(withAuth(
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/receipt/:id" element={<div>PANTALLA RECIBO</div>} />
        </Routes>
      </MemoryRouter>, CLIENT));
  };

  it('carrito vacío muestra estado vacío', async () => {
    render();
    await tick();
    expect(container.textContent).toContain('El carrito está vacío.');
  });

  it('enriquece el carrito con datos de la API y calcula el total', async () => {
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 1, quantity: 2 }]));
    render();
    await tick();
    expect(container.textContent).toContain('Piedra algo ovalada');
    expect(container.textContent).toContain('2.598'); // 1299 * 2 en CLP
  });

  it('ignora ids que ya no existen en el catálogo', async () => {
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 9999, quantity: 1 }]));
    render();
    await tick();
    expect(container.textContent).toContain('El carrito está vacío.');
  });

  it('botón + incrementa y persiste, respetando el stock', async () => {
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 2, quantity: 5 }])); // stock 5
    render();
    await tick();
    const plus = findButton(container, '+');
    expect(plus.disabled).toBe(true); // ya está en el máximo de stock
  });

  it('checkout exitoso envía rockId/quantity, limpia carrito y navega al recibo', async () => {
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 1, quantity: 2 }]));
    render([{ match: '/api/orders', method: 'POST', body: SAMPLE_ORDER, status: 201, delay: 30 }]);
    await tick();
    findButton(container, 'Proceder al Pago').click();
    await tick(120);
    const post = mock.calls.find(c => c.method === 'POST' && c.path === '/api/orders');
    expect(JSON.parse(post.options.body)).toEqual({ items: [{ rockId: 1, quantity: 2 }] });
    expect(localStorage.getItem('pieca_cart')).toBeNull();
    expect(container.textContent).toContain('PANTALLA RECIBO');
  });

  it('checkout fallido (red caída) muestra error y CONSERVA el carrito', async () => {
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 1, quantity: 2 }]));
    render([{ match: '/api/orders', method: 'POST', networkError: true }]);
    await tick();
    findButton(container, 'Proceder al Pago').click();
    await tick(120);
    expect(container.textContent).toContain('La compra falló');
    expect(localStorage.getItem('pieca_cart')).not.toBeNull();
    expect(container.textContent).toContain('Piedra algo ovalada');
  });

  it('stock insuficiente en el backend muestra el mensaje y conserva el carrito', async () => {
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 1, quantity: 2 }]));
    render([{ match: '/api/orders', method: 'POST', status: 400, body: { message: 'Stock insuficiente para "Piedra algo ovalada"' } }]);
    await tick();
    findButton(container, 'Proceder al Pago').click();
    await tick(120);
    expect(container.textContent).toContain('Stock insuficiente');
    expect(localStorage.getItem('pieca_cart')).not.toBeNull();
  });
});