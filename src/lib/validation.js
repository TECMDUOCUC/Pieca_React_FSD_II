const ALLOWED_DOMAINS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

export function isValidDomain(email) {
  const lowerEmail = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some(domain => lowerEmail.endsWith(domain));
}

export function validateRUT(rut) {
  // Clean formatting dots and hyphens
  const cleanRUT = rut.replace(/[.-]/g, '').trim().toUpperCase();
  
  // Minimum valid RUT format: 7 numbers + 1 digit/K
  if (cleanRUT.length < 8) return false;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1);
  
  // Body must contain digits only
  if (!/^\d+$/.test(body)) return false;
  
  // Modulo 11 calculation
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = 11 - (sum % 11);
  let expectedDV;
  
  if (remainder === 11) {
    expectedDV = '0';
  } else if (remainder === 10) {
    expectedDV = 'K';
  } else {
    expectedDV = remainder.toString();
  }
  
  return dv === expectedDV;
}