export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const TOKEN_KEY = 'pieca_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch(path, { method = 'GET', body, auth = true, timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const headers = {};
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let payload;
  if (body instanceof FormData) {
    payload = body; // el browser pone el Content-Type multipart con boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_URL}${path}`, { method, headers, body: payload, signal: controller.signal });

    // Token expirado/inválido en cualquier endpoint -> cerrar sesión globalmente.
    if (res.status === 401 && auth) {
      clearToken();
      window.dispatchEvent(new Event('pieca:unauthorized'));
    }

    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* respuesta no-JSON */ }

    if (!res.ok) {
      const err = new Error(data?.message || `Error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('La conexión se perdió o la solicitud tardó demasiado. Revisa tu red e intenta de nuevo.');
    }
    if (e instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor. ¿Está el backend encendido?');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * imgdir = "assets/1.png"        -> servido por el frontend (public/)
 * imgdir = "/uploads/rocks/x.png"-> servido por el backend
 * imgdir = "https://..."         -> URL externa
 */
export function resolveImageUrl(imgdir) {
  if (!imgdir) return `${import.meta.env.BASE_URL}assets/attachment.gif`;
  if (/^https?:\/\//i.test(imgdir)) return imgdir;
  if (imgdir.startsWith('/uploads')) return `${API_URL}${imgdir}`;
  return `${import.meta.env.BASE_URL}${imgdir.replace(/^\//, '')}`;
}

export const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });