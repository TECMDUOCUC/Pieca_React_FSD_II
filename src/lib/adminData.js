export const MOCK_USERS = [
  { rut: "18.452.123-4", name: "Carlos Mendoza Silva", username: "cmendoza", email: "carlos.mendoza@duoc.cl", role: "Administrador" },
  { rut: "20.123.987-K", name: "Valentina Rojas Castro", username: "vrojas", email: "valentina.rojas@profesor.duoc.cl", role: "Cliente" },
  { rut: "19.876.543-2", name: "Matías Herrera Peña", username: "mherrera", email: "matias.herrera@gmail.com", role: "Cliente" },
  { rut: "16.789.012-3", name: "Javiera Paz Contreras", username: "jpaz", email: "javiera.contreras@gmail.com", role: "Cliente" },
  { rut: "21.345.678-9", name: "Ignacio Soto Morales", username: "isoto", email: "ignacio.soto@duoc.cl", role: "Cliente" }
];

export const MOCK_SALES = [
  { id: "BOL-10492", date: "2026-09-06 14:32", customer: "Carlos Mendoza Silva", items: "Piedra Sigma (x1)", total: 4207767, status: "Completado" },
  { id: "BOL-10491", date: "2026-09-05 18:10", customer: "Valentina Rojas Castro", items: "Piedra algo ovalada (x2)", total: 3598, status: "Completado" },
  { id: "BOL-10490", date: "2026-09-04 11:45", customer: "Matías Herrera Peña", items: "Piedra (x1), Piedra rocosa (x1)", total: 10298, status: "Completado" },
  { id: "BOL-10489", date: "2026-09-03 09:20", customer: "Javiera Paz Contreras", items: "Piedra bipolar (x1)", total: 4199, status: "Pendiente" },
  { id: "BOL-10488", date: "2026-09-01 16:04", customer: "Ignacio Soto Morales", items: "Piedra porosa (x3)", total: 4897, status: "Completado" }
];

const ROCKS_STORAGE_KEY = "pieca_custom_rocks";
const DELETED_ROCKS_KEY = "pieca_deleted_rocks";

export function getStoredCustomRocks() {
  try {
    const raw = localStorage.getItem(ROCKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getDeletedRockNames() {
  try {
    const raw = localStorage.getItem(DELETED_ROCKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomRocks(list) {
  localStorage.setItem(ROCKS_STORAGE_KEY, JSON.stringify(list));
}

export function saveDeletedRockNames(list) {
  localStorage.setItem(DELETED_ROCKS_KEY, JSON.stringify(list));
}