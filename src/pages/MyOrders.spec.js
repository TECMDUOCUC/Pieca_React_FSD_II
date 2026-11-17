import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import MyOrders from './MyOrders';
import { mockFetch, withAuth, meRoute, CLIENT, SAMPLE_ORDER, cleanStorage, tick } from '../test/helpers';

describe('MyOrders.jsx', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const render = (orders) => {
    mock = mockFetch([meRoute(CLIENT), { match: '/api/orders/me', body: orders }]);
    root.render(withAuth(<MemoryRouter><MyOrders /></MemoryRouter>, CLIENT));
  };

  it('lista pedidos con estado traducido y link al recibo', async () => {
    render([SAMPLE_ORDER]);
    await tick();
    expect(container.textContent).toContain('Mis Pedidos');
    expect(container.textContent).toContain('BOL-7');
    expect(container.textContent).toContain('Procesando');
    expect(container.querySelector('a[href="/receipt/7"]')).toBeTruthy();
  });

  it('sin pedidos muestra estado vacío con link al catálogo', async () => {
    render([]);
    await tick();
    expect(container.textContent).toContain('Aún no tienes pedidos.');
    expect(container.querySelector('a[href="/catalog"]')).toBeTruthy();
  });
});