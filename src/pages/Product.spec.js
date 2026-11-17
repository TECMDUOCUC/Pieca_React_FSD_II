import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import ProductDetail from './Product';
import { mockFetch, withAuth, meRoute, CLIENT, SAMPLE_ROCKS, cleanStorage, tick, findButton } from '../test/helpers';

describe('Product.jsx (conectado al backend)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    spyOn(window, 'alert').and.callFake(() => {});
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const renderAt = (id, user = null, extraRoutes = []) => {
    mock = mockFetch([
      { match: `/api/rocks/${id}`, body: SAMPLE_ROCKS.find(r => r.id === Number(id)) ?? undefined,
        status: SAMPLE_ROCKS.some(r => r.id === Number(id)) ? 200 : 404 },
      ...(user ? [meRoute(user)] : []),
      ...extraRoutes,
    ]);
    root.render(withAuth(
      <MemoryRouter initialEntries={[`/product/${id}`]}>
        <Routes>
          <Route path="/login" element={<div>PANTALLA LOGIN</div>} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>, user));
  };

  it('renderiza nombre, precio y especificaciones desde la API', async () => {
    renderAt(1);
    await tick();
    const rock = SAMPLE_ROCKS[0];
    expect(container.textContent).toContain(rock.name);
    expect(container.textContent).toContain('1.299');
    expect(container.textContent).toContain(`${rock.weight} g`);
    expect(container.textContent).toContain('Stock disponible');
    expect(container.textContent).toContain('10');
  });

  it('id inexistente muestra Not Found', async () => {
    renderAt(9999);
    await tick();
    expect(container.textContent).toContain('Not Found');
  });

  it('roca agotada deshabilita el botón de compra', async () => {
    renderAt(3);
    await tick();
    const btn = findButton(container, 'Agotado');
    expect(btn.disabled).toBe(true);
  });

  it('sin sesión alerta y redirige a login al añadir', async () => {
    renderAt(1);
    await tick();
    findButton(container, 'Añadir a carrito').click();
    await tick();
    expect(window.alert).toHaveBeenCalledWith('Debe iniciar sesión para añadir productos al carrito.');
    expect(container.textContent).toContain('PANTALLA LOGIN');
    expect(localStorage.getItem('pieca_cart')).toBeNull();
  });

  it('con sesión añade al carrito usando el id de BD y la cantidad elegida', async () => {
    renderAt(1, CLIENT);
    await tick();
    const qty = container.querySelector('#qty');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(qty, '3');
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    await tick();
    findButton(container, 'Añadir a carrito').click();
    await tick();
    expect(JSON.parse(localStorage.getItem('pieca_cart'))).toEqual([{ id: 1, quantity: 3 }]);
    expect(container.textContent).toContain('¡Añadido al carrito!');
  });
});