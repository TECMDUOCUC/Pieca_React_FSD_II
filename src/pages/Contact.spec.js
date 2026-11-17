import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Contact from './Contact';
import { AuthProvider } from '../lib/auth.jsx';
import { setInput, tick, cleanStorage } from '../test/helpers';

describe('Pruebas de renderizado y lógica de Contacto', () => {
  let container, root;

  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    cleanStorage();
  });

  const render = () => root.render(
    <AuthProvider>
      <BrowserRouter><Contact /></BrowserRouter>
    </AuthProvider>
  );

  it('debe renderizar el formulario de contacto con todos los campos', async () => {
    render();
    await tick();
    expect(container.textContent).toContain('Contáctenos');
    expect(container.querySelector('#name')).toBeTruthy();
    expect(container.querySelector('#email')).toBeTruthy();
    expect(container.querySelector('#subject')).toBeTruthy();
    expect(container.querySelector('#message')).toBeTruthy();
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('debe mostrar el mensaje de éxito al enviar el formulario', async () => {
    render();
    await tick();
    const form = container.querySelector('form');
    setInput(form.querySelector('#name'), 'Test User');
    setInput(form.querySelector('#email'), 'test@duoc.cl');
    setInput(form.querySelector('#subject'), 'Test Subject');
    setInput(form.querySelector('#message'), 'Test Message');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    expect(container.textContent).toContain('¡Mensaje enviado!');
    expect(container.textContent).toContain('Gracias por contactarnos.');
    expect(container.querySelector('form')).toBeNull();
  });

  it('debe permitir enviar otro mensaje después del éxito', async () => {
    render();
    await tick();
    container.querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    const resetBtn = Array.from(container.querySelectorAll('button'))
      .find((b) => b.textContent.includes('Enviar otro mensaje'));
    resetBtn.click();
    await tick();
    expect(container.querySelector('form')).toBeTruthy();
    expect(container.textContent).not.toContain('¡Mensaje enviado!');
  });
});