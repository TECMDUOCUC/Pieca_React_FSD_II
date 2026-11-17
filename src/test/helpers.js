import React from 'react';
import { AuthProvider } from '../lib/auth.jsx';
import { setToken, clearToken } from '../lib/api';

/**
 * Instala un mock de window.fetch.
 * routes: [{ method?, match: string|RegExp|fn, status?, body?, delay? }]
 * Devuelve { calls, restore }.
 */
export function mockFetch(routes = []) {
  const original = window.fetch;
  const calls = [];

  window.fetch = async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const path = String(url).replace('http://localhost:8080', '').replace('/api/v1/', '/api/');
    calls.push({ url: String(url), path, method, options });

    const route = routes.find((r) => {
      const methodOk = !r.method || r.method.toUpperCase() === method;
      const matchOk =
        typeof r.match === 'function' ? r.match(path, options)
        : r.match instanceof RegExp ? r.match.test(path)
        : path === r.match || path.startsWith(r.match + '?');
      return methodOk && matchOk;
    });

    if (!route) {
      throw new TypeError('Failed to fetch (sin ruta mockeada: ' + method + ' ' + path + ')');
    }
    if (route.delay) await new Promise((r) => setTimeout(r, route.delay));
    if (route.networkError) throw new TypeError('Failed to fetch');

    const status = route.status ?? 200;
    const body = typeof route.body === 'function' ? route.body(options) : route.body;
    return {
      ok: status >= 200 && status < 300,
      status,
      text: async () => (body == null ? '' : JSON.stringify(body)),
    };
  };

  return { calls, restore: () => { window.fetch = original; } };
}

/** Envuelve un componente con sesión iniciada (token + /api/auth/me mockeado). */
export function withAuth(ui, user, fetchMockRoutes = []) {
  setToken('test-token');
  return React.createElement(AuthProvider, null, ui);
}

export const ADMIN = { token: null, name: 'Admin Test', email: 'admin@pieca.cl', role: 'ROLE_ADMIN' };
export const SELLER = { token: null, name: 'Seller Test', email: 'seller@pieca.cl', role: 'ROLE_SELLER' };
export const CLIENT = { token: null, name: 'Client Test', email: 'client@duoc.cl', role: 'ROLE_CLIENT' };

export const meRoute = (user) => ({ match: '/api/auth/me', body: user });

/** Llena un input controlado de React de forma confiable. */
export function setInput(input, value) {
  const proto = input.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export const tick = (ms = 60) => new Promise((r) => setTimeout(r, ms));

export function findButton(container, text) {
  return Array.from(container.querySelectorAll('button'))
    .find((b) => b.textContent.trim().includes(text));
}

export const SAMPLE_ROCKS = [
  { id: 1, name: 'Piedra algo ovalada', price: 1299, stock: 10, weight: 98, height: 53, width: 65, length: 45, volume: 155122, imgdir: 'assets/1.png' },
  { id: 2, name: 'Piedra más ovalada', price: 1499, stock: 5, weight: 402, height: 37, width: 52, length: 6, volume: 11819, imgdir: 'assets/2.webp' },
  { id: 3, name: 'Piedra Sigma', price: 4206767, stock: 0, weight: 12000, height: 405, width: 154, length: 80, volume: 62370, imgdir: 'assets/19.png' },
];

export const SAMPLE_ORDER = {
  id: 7,
  orderdate: '2026-11-10T14:32:00',
  status: 'PROCESSING',
  total: 2598,
  user: { name: 'Client Test', email: 'client@duoc.cl' },
  items: [{ id: 11, rock: SAMPLE_ROCKS[0], quantity: 2, price: 1299, subtotal: 2598 }],
};

export function cleanStorage() {
  localStorage.clear();
  clearToken();
}