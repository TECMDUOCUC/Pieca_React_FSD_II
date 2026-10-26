// src/pages/ProductDetail.spec.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import ProductDetail from './Product';
import rocksData from '../data/rocks.json';

const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
});

describe('Pruebas de renderizado de Detalle de Producto usando datos JSON', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
    spyOn(window, 'alert').and.callFake(() => {});
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('debe renderizar los datos de la primera piedra cuando id=0', async () => {
    window.history.pushState({}, '', '/product?id=0');

    root.render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const rock = rocksData[0];
    expect(container.textContent).toContain(rock.name);
    expect(container.textContent).toContain(priceFormatter.format(rock.price));
    expect(container.textContent).toContain(`${rock.weight} g`);
    expect(container.textContent).toContain(`${rock.height} mm`);
    expect(container.textContent).toContain(`${rock.width} mm`);
    expect(container.textContent).toContain(`${rock.length} mm`);
    expect(container.textContent).toContain(`${rock.volume} mm³`);
  });

  it('debe mostrar estado Not Found para un id inválido', async () => {
    window.history.pushState({}, '', '/product?id=9999');

    root.render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Not Found');
    expect(container.textContent).toContain('N/A');
  });

  it('debe formatear el precio en CLP correctamente', async () => {
    window.history.pushState({}, '', '/product?id=0');

    root.render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const expectedPrice = priceFormatter.format(rocksData[0].price);
    expect(container.textContent).toContain(expectedPrice);
  });

  it('debe renderizar el botón Añadir a carrito', async () => {
    window.history.pushState({}, '', '/product?id=0');

    root.render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Añadir a carrito');
  });

  it('debe renderizar todas las filas de especificaciones', async () => {
    window.history.pushState({}, '', '/product?id=0');

    root.render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Peso');
    expect(container.textContent).toContain('Altura');
    expect(container.textContent).toContain('Anchura');
    expect(container.textContent).toContain('Longitud');
    expect(container.textContent).toContain('Volumen');
    expect(container.textContent).toContain('Costo de envío');
  });

  it('debe deshabilitar el botón si la piedra no se encuentra', async () => {
    window.history.pushState({}, '', '/product?id=9999');

    root.render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const button = container.querySelector('button');
    expect(button.disabled).toBe(true);
  });


  it('debe alertar y redirigir si no hay usuario al añadir', async () => {
    window.history.pushState({}, '', '/product?id=0');
    root.render(<BrowserRouter><ProductDetail /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const btn = Array.from(container.querySelectorAll('button'))
      .find(b => b.textContent.includes('Añadir a carrito'));
    btn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(window.alert).toHaveBeenCalledWith(
      'Debe iniciar sesión para añadir productos al carrito.'
    );
    expect(localStorage.getItem('pieca_cart')).toBeNull();
  });

  it('debe añadir producto nuevo al carrito si hay usuario', async () => {
    localStorage.setItem('pieca_user', JSON.stringify({ email: 'a@duoc.cl' }));
    window.history.pushState({}, '', '/product?id=0');
    root.render(<BrowserRouter><ProductDetail /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const btn = Array.from(container.querySelectorAll('button'))
      .find(b => b.textContent.includes('Añadir a carrito'));
    btn.click();
    await new Promise(r => setTimeout(r, 50));
    const cart = JSON.parse(localStorage.getItem('pieca_cart'));
    expect(cart).toEqual([{ id: 0, quantity: 1 }]);
    expect(container.textContent).toContain('¡Añadido al carrito!');
  });

  it('debe incrementar cantidad si el producto ya está en el carrito', async () => {
    localStorage.setItem('pieca_user', JSON.stringify({ email: 'a@duoc.cl' }));
    localStorage.setItem('pieca_cart', JSON.stringify([{ id: 0, quantity: 1 }]));
    window.history.pushState({}, '', '/product?id=0');
    root.render(<BrowserRouter><ProductDetail /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const btn = Array.from(container.querySelectorAll('button'))
      .find(b => b.textContent.includes('Añadir a carrito'));
    btn.click();
    await new Promise(r => setTimeout(r, 50));
    const cart = JSON.parse(localStorage.getItem('pieca_cart'));
    expect(cart[0].quantity).toBe(2);
  });

});