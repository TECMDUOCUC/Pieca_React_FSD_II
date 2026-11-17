import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import RequireRole from './RequireRole';
import { mockFetch, withAuth, meRoute, ADMIN, CLIENT, cleanStorage, tick } from '../test/helpers';

describe('RequireRole.jsx', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const renderGuarded = (roles) => root.render(withAuth(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/login" element={<div>PANTALLA LOGIN</div>} />
        <Route path="/" element={<div>PANTALLA HOME</div>} />
        <Route path="/admin" element={<RequireRole roles={roles}><div>CONTENIDO PROTEGIDO</div></RequireRole>} />
      </Routes>
    </MemoryRouter>, null));

  it('sin sesión redirige a /login', async () => {
    mock = mockFetch([]);
    renderGuarded(['ROLE_ADMIN']);
    await tick();
    expect(container.textContent).toContain('PANTALLA LOGIN');
  });

  it('cliente con rol incorrecto redirige a home', async () => {
    mock = mockFetch([meRoute(CLIENT)]);
    root.render(withAuth(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>PANTALLA HOME</div>} />
          <Route path="/admin" element={<RequireRole roles={['ROLE_ADMIN']}><div>CONTENIDO PROTEGIDO</div></RequireRole>} />
        </Routes>
      </MemoryRouter>, CLIENT));
    await tick();
    expect(container.textContent).toContain('PANTALLA HOME');
    expect(container.textContent).not.toContain('CONTENIDO PROTEGIDO');
  });

  it('admin ve el contenido protegido', async () => {
    mock = mockFetch([meRoute(ADMIN)]);
    root.render(withAuth(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<RequireRole roles={['ROLE_ADMIN']}><div>CONTENIDO PROTEGIDO</div></RequireRole>} />
        </Routes>
      </MemoryRouter>, ADMIN));
    await tick();
    expect(container.textContent).toContain('CONTENIDO PROTEGIDO');
  });
});