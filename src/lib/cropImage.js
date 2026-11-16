function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () => reject(new Error('No se pudo cargar la imagen')));
    img.src = src;
  });
}

export async function getCroppedBlob(src, pixelCrop, { mime = 'image/webp', maxSide = 1024, quality = 0.9 } = {}) {
  const img = await loadImage(src);
  const scale = Math.min(1, maxSide / Math.max(pixelCrop.width, pixelCrop.height));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(pixelCrop.width * scale);
  canvas.height = Math.round(pixelCrop.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, canvas.width, canvas.height,
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo procesar la imagen'))), mime, quality),
  );
}