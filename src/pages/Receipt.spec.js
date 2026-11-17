import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import Receipt from './Receipt';
import { mockFetch, withAuth, meRoute, CLIENT, SAMPLE_ORDER, cleanStorage, tick } from '../test/helpers';

describe('Receipt.jsx (recibo desde la BD)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const renderAt = (id, routes) => {
    mock = mockFetch([meRoute(CLIENT), ...routes]);
    root.render(withAuth(
      <MemoryRouter initialEntries={[`/receipt/${id}`]}>
        <Routes><Route path="/receipt/:id" element={<Receipt />} /></Routes>
      </MemoryRouter>, CLIENT));
  };

  it('renderiza boleta, estado, items y total desde la API', async () => {
    renderAt(7, [{ match: '/api/orders/7', body: SAMPLE_ORDER }]);
    await tick();
    expect(container.textContent).toContain('¡Pedido Confirmado!');
    expect(container.textContent).toContain('BOL-7');
    expect(container.textContent).toContain('Procesando');
    expect(container.textContent).toContain('Piedra algo ovalada (x2)');
    expect(container.textContent).toContain('2.598');
    expect(container.textContent).toContain('2026');
  });

  it('pedido ajeno (403) muestra el error del backend', async () => {
    renderAt(8, [{ match: '/api/orders/8', status: 403, body: { message: 'No puedes ver pedidos de otros usuarios' } }]);
    await tick();
    expect(container.textContent).toContain('No puedes ver pedidos de otros usuarios');
  });

  it('pedido inexistente (404) muestra error', async () => {
    renderAt(99, [{ match: '/api/orders/99', status: 404, body: { message: 'Pedido no encontrado con id 99' } }]);
    await tick();
    expect(container.textContent).toContain('Pedido no encontrado');
  });
});