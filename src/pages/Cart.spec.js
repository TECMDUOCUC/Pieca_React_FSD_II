import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Cart from './Cart';
import rocksData from '../data/rocks.json';

describe('Pruebas de renderizado y lógica del Carrito', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
    // Mock alert to prevent blocking tests during checkout
    spyOn(window, 'alert').and.callFake(() => {});
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    localStorage.clear();
  });

  it('debe mostrar estado vacío cuando no hay items en el carrito', async () => {
    root.render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('El carrito está vacío.');
    expect(container.querySelector('.btn-light')).toBeTruthy(); // "Volver al Catálogo" button
  });

  it('debe renderizar los productos agregados al carrito desde localStorage', async () => {
    // Add first rock to cart
    const mockCart = [{ id: 0, quantity: 1 }];
    localStorage.setItem('pieca_cart', JSON.stringify(mockCart));

    root.render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain(rocksData[0].name);
    expect(container.textContent).toContain('Total:');
  });

  it('debe calcular el total correctamente en CLP', async () => {
    const mockCart = [{ id: 0, quantity: 2 }]; // 2 units of first rock
    localStorage.setItem('pieca_cart', JSON.stringify(mockCart));

    root.render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const expectedTotal = rocksData[0].price * 2;
    const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
    expect(container.textContent).toContain(formatter.format(expectedTotal));
  });

  it('debe eliminar un item del carrito al hacer click en Eliminar', async () => {
    const mockCart = [{ id: 0, quantity: 1 }, { id: 1, quantity: 1 }];
    localStorage.setItem('pieca_cart', JSON.stringify(mockCart));

    root.render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Find and click the delete button for the first item
    const deleteButtons = container.querySelectorAll('.text-danger');
    if (deleteButtons.length > 0) {
      deleteButtons[0].click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      
      // Check if the first item is gone but the second remains
      expect(container.textContent).not.toContain(rocksData[0].name);
      expect(container.textContent).toContain(rocksData[1].name);
    }
  });

  it('debe procesar el checkout y mover datos a receipt', async () => {
    const mockCart = [{ id: 0, quantity: 1 }];
    localStorage.setItem('pieca_cart', JSON.stringify(mockCart));

    root.render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const checkoutBtn = container.querySelector('.btn-light.px-5'); // "Proceder al Pago"
    if (checkoutBtn) {
      checkoutBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(localStorage.getItem('pieca_receipt')).toBeTruthy();
      expect(localStorage.getItem('pieca_cart')).toBeNull();
      
      const receipt = JSON.parse(localStorage.getItem('pieca_receipt'));
      expect(receipt.items.length).toBe(1);
      expect(receipt.status).toBe('Procesando - Preparando Envío');
    }
  });
});