import { apiFetch, resolveImageUrl, getToken, setToken, clearToken } from './api';
import { mockFetch, cleanStorage } from '../test/helpers';

describe('api.js', () => {
  let mock;
  beforeEach(() => { cleanStorage(); });
  afterEach(() => { mock?.restore(); cleanStorage(); });

  it('adjunta el header Authorization cuando hay token', async () => {
    setToken('abc123');
    mock = mockFetch([{ match: '/api/orders/me', body: [] }]);
    await apiFetch('/api/orders/me');
    expect(mock.calls[0].options.headers.Authorization).toBe('Bearer abc123');
  });

  it('no adjunta Authorization con auth:false', async () => {
    setToken('abc123');
    mock = mockFetch([{ match: '/api/rocks', body: [] }]);
    await apiFetch('/api/rocks', { auth: false });
    expect(mock.calls[0].options.headers.Authorization).toBeUndefined();
  });

  it('lanza Error con el message del backend y el status', async () => {
    mock = mockFetch([{ match: '/api/orders', method: 'POST', status: 400, body: { message: 'Stock insuficiente' } }]);
    try {
      await apiFetch('/api/orders', { method: 'POST', body: {} });
      fail('debió lanzar');
    } catch (e) {
      expect(e.message).toBe('Stock insuficiente');
      expect(e.status).toBe(400);
    }
  });

  it('en 401 limpia el token y dispara pieca:unauthorized', async () => {
    setToken('expirado');
    let fired = false;
    const listener = () => { fired = true; };
    window.addEventListener('pieca:unauthorized', listener);
    mock = mockFetch([{ match: '/api/orders/me', status: 401, body: { message: 'No autenticado' } }]);
    try { await apiFetch('/api/orders/me'); } catch { /* esperado */ }
    window.removeEventListener('pieca:unauthorized', listener);
    expect(getToken()).toBeNull();
    expect(fired).toBe(true);
  });

  it('error de red se traduce a mensaje legible', async () => {
    mock = mockFetch([{ match: '/api/rocks', networkError: true }]);
    try {
      await apiFetch('/api/rocks', { auth: false });
      fail('debió lanzar');
    } catch (e) {
      expect(e.message).toContain('No se pudo conectar');
    }
  });

  it('FormData no fuerza Content-Type JSON', async () => {
    setToken('t');
    mock = mockFetch([{ match: '/api/admin/uploads', method: 'POST', body: { url: '/uploads/rocks/x.webp' } }]);
    const fd = new FormData();
    fd.append('file', new Blob(['x'], { type: 'image/webp' }), 'x.webp');
    await apiFetch('/api/admin/uploads', { method: 'POST', body: fd });
    expect(mock.calls[0].options.headers['Content-Type']).toBeUndefined();
  });

  it('resolveImageUrl enruta assets al frontend y uploads al backend', () => {
    expect(resolveImageUrl('assets/1.png')).toBe('/assets/1.png');
    expect(resolveImageUrl('/uploads/rocks/x.webp')).toBe('http://localhost:8080/uploads/rocks/x.webp');
    expect(resolveImageUrl('https://x.com/a.png')).toBe('https://x.com/a.png');
    expect(resolveImageUrl(null)).toContain('attachment.gif');
  });
});