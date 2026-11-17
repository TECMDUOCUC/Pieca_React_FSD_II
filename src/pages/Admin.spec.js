import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import Admin from './Admin';
import { mockFetch, withAuth, meRoute, ADMIN, SELLER, SAMPLE_ROCKS, SAMPLE_ORDER, cleanStorage, tick, findButton, setSelect } from '../test/helpers';
describe('Admin.jsx (panel por rol contra la API)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    spyOn(window, 'alert').and.callFake(() => {});
    spyOn(window, 'confirm').and.returnValue(true);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const baseRoutes = (user) => [
    meRoute(user),
    { match: '/api/rocks', body: SAMPLE_ROCKS },
    { match: '/api/admin/users', body: [
      { id: 1, name: 'Admin Test', email: 'admin@pieca.cl', rut: null, role: { id: 1, name: 'ROLE_ADMIN' } },
      { id: 2, name: 'Juan Perez', email: 'juan@duoc.cl', rut: '12.345.678-5', role: { id: 3, name: 'ROLE_CLIENT' } },
    ]},
    { match: '/api/admin/sales', body: [SAMPLE_ORDER] },
  ];

  const render = (user, extra = []) => {
    mock = mockFetch([...baseRoutes(user), ...extra]);
    root.render(withAuth(<MemoryRouter><Admin /></MemoryRouter>, user));
  };

  it('ADMIN ve las 4 pestañas y el inventario por defecto', async () => {
    render(ADMIN);
    await tick();
    expect(container.textContent).toContain('Panel de Administración');
    ['Inventario', 'Añadir Roca', 'Usuarios', 'Ventas'].forEach(t =>
      expect(container.textContent).toContain(t));
    expect(container.textContent).toContain('Piedra algo ovalada');
    expect(container.textContent).toContain('Agotado'); // Sigma stock 0
  });

  it('SELLER solo ve Inventario y Ventas, sin botones de edición', async () => {
    render(SELLER);
    await tick();
    expect(container.textContent).toContain('Panel de Vendedor');
    expect(container.textContent).toContain('Ventas');
    expect(container.textContent).not.toContain('Añadir Roca');
    expect(container.textContent).not.toContain('Usuarios');
    expect(findButton(container, 'Editar')).toBeUndefined();
    expect(findButton(container, 'Eliminar')).toBeUndefined();
  });

  it('ADMIN elimina una roca llamando DELETE /api/rocks/:id', async () => {
    render(ADMIN, [{ match: '/api/rocks/1', method: 'DELETE', status: 204, body: null }]);
    await tick();
    const deletes = Array.from(container.querySelectorAll('.btn-danger'));
    deletes[0].click();
    await tick(80);
    expect(mock.calls.some(c => c.method === 'DELETE' && c.path === '/api/rocks/1')).toBe(true);
  });

    it('pestaña Usuarios lista usuarios y permite cambiar rol', async () => {
    render(ADMIN, [{ match: '/api/admin/users/2/role', method: 'PUT',
      body: { id: 2, name: 'Juan Perez', email: 'juan@duoc.cl', role: { id: 2, name: 'ROLE_SELLER' } } }]);
    await tick();
    findButton(container, 'Usuarios').click();
    await tick();
    expect(container.textContent).toContain('Juan Perez');

    const selects = container.querySelectorAll('select');
    // El primer select es el del propio admin y está deshabilitado (no puedes degradarte).
    expect(selects[0].disabled).toBe(true);
    // Cambiamos el rol de OTRO usuario (Juan Perez, fila 2).
    setSelect(selects[1], 'ROLE_SELLER');
    await tick(80);

    const put = mock.calls.find(c => c.method === 'PUT' && c.path === '/api/admin/users/2/role');
    expect(put).toBeTruthy();
    expect(JSON.parse(put.options.body)).toEqual({ role: 'ROLE_SELLER' });
  });

  it('SELLER cambia el estado de una venta vía PUT', async () => {
    render(SELLER, [{ match: '/api/admin/sales/7/status', method: 'PUT',
      body: { ...SAMPLE_ORDER, status: 'SHIPPING' } }]);
    await tick();
    findButton(container, 'Ventas').click();
    await tick();
    expect(container.textContent).toContain('BOL-7');
    const select = container.querySelector('select');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    setter.call(select, 'SHIPPING');
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await tick(80);
    const put = mock.calls.find(c => c.method === 'PUT' && c.path === '/api/admin/sales/7/status');
    expect(JSON.parse(put.options.body)).toEqual({ status: 'SHIPPING' });
  });

  it('estados terminales deshabilitan el select de estado', async () => {
    mock = mockFetch([
      meRoute(SELLER),
      { match: '/api/rocks', body: SAMPLE_ROCKS },
      { match: '/api/admin/sales', body: [{ ...SAMPLE_ORDER, status: 'DELIVERED' }] },
    ]);
    root.render(withAuth(<MemoryRouter><Admin /></MemoryRouter>, SELLER));
    await tick();
    findButton(container, 'Ventas').click();
    await tick();
    expect(container.querySelector('select').disabled).toBe(true);
  });
});