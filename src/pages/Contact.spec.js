import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Contact from './Contact';

describe('Pruebas de renderizado y lógica de Contacto', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
  });

  // Robust helper to set input values in React tests
  const setInputValue = (input, value) => {
    // For textarea and input elements, we can often just set .value directly 
    // if we dispatch the event afterwards, but React sometimes ignores it.
    // The most reliable way in Jasmine without @testing-library is:
    Object.defineProperty(input, 'value', {
      value: value,
      writable: true,
      configurable: true
    });
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  it('debe renderizar el formulario de contacto con todos los campos', async () => {
    root.render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Contáctenos');
    expect(container.querySelector('#name')).toBeTruthy();
    expect(container.querySelector('#email')).toBeTruthy();
    expect(container.querySelector('#subject')).toBeTruthy();
    expect(container.querySelector('#message')).toBeTruthy();
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('debe mostrar el mensaje de éxito al enviar el formulario', async () => {
    root.render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const form = container.querySelector('form');
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const subjectInput = form.querySelector('#subject');
    const messageInput = form.querySelector('#message');
    
    // Fill out the form using the safe helper
    setInputValue(nameInput, 'Test User');
    setInputValue(emailInput, 'test@duoc.cl');
    setInputValue(subjectInput, 'Test Subject');
    setInputValue(messageInput, 'Test Message');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('¡Mensaje enviado!');
    expect(container.textContent).toContain('Gracias por contactarnos.');
    expect(container.querySelector('form')).toBeNull(); // Form should be hidden
  });

  it('debe permitir enviar otro mensaje después del éxito', async () => {
    root.render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Submit once
    const form = container.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Click "Enviar otro mensaje"
    const resetBtn = container.querySelector('.btn-outline-light');
    resetBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.querySelector('form')).toBeTruthy(); // Form should be back
    expect(container.textContent).not.toContain('¡Mensaje enviado!');
  });
});