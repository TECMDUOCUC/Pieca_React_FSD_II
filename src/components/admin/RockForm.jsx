import { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { apiFetch, resolveImageUrl } from '../../lib/api';
import { getCroppedBlob } from '../../lib/cropImage';

const EMPTY = { name: '', price: '', stock: '', weight: '', height: '', width: '', length: '', volume: '' };

const NUMERIC_FIELDS = [
  { key: 'price', label: 'Precio (CLP)', required: true, integer: true, min: 1 },
  { key: 'stock', label: 'Stock', required: true, integer: true, min: 0 },
  { key: 'weight', label: 'Peso (g)', min: 0 },
  { key: 'height', label: 'Altura (mm)', min: 0 },
  { key: 'width', label: 'Anchura (mm)', min: 0 },
  { key: 'length', label: 'Longitud (mm)', min: 0 },
  { key: 'volume', label: 'Volumen (mm³)', min: 0 },
];

export default function RockForm({ initial = null, onSaved }) {
  const isEdit = initial != null;
  const [fields, setFields] = useState(() => {
    if (!isEdit) return { ...EMPTY };
    const f = { ...EMPTY };
    Object.keys(f).forEach((k) => { f[k] = initial[k] != null ? String(initial[k]) : ''; });
    return f;
  });

  const [rawSrc, setRawSrc] = useState(null);       // objectURL de la imagen original
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [blob, setBlob] = useState(null);           // imagen final recortada
  const [previewUrl, setPreviewUrl] = useState(isEdit ? resolveImageUrl(initial.imgdir) : null);

  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => () => {
    if (rawSrc) URL.revokeObjectURL(rawSrc);
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [rawSrc, previewUrl]);

  const setField = (key, value) => setFields((f) => ({ ...f, [key]: value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite re-seleccionar el mismo archivo
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      setErrors(['Formato no permitido. Usa PNG, JPEG, WEBP o GIF.']);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(['La imagen supera 5 MB.']);
      return;
    }
    setErrors([]);
    if (rawSrc) URL.revokeObjectURL(rawSrc);
    setRawSrc(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropping(true);
  };

  const applyCrop = async () => {
    try {
      const cropped = await getCroppedBlob(rawSrc, croppedArea);
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setBlob(cropped);
      setPreviewUrl(URL.createObjectURL(cropped));
      setCropping(false);
    } catch (err) {
      setErrors([err.message]);
    }
  };

  const removeImage = () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setBlob(null);
    setPreviewUrl(isEdit ? resolveImageUrl(initial.imgdir) : null);
  };

  const validate = () => {
    const errs = [];
    if (!fields.name.trim()) errs.push('El nombre es obligatorio.');
    for (const f of NUMERIC_FIELDS) {
      const raw = fields[f.key];
      if (f.required && raw === '') { errs.push(`${f.label} es obligatorio.`); continue; }
      if (raw === '') continue;
      const n = Number(raw);
      if (Number.isNaN(n)) errs.push(`${f.label} debe ser un número.`);
      else if (n < f.min) errs.push(`${f.label} debe ser ≥ ${f.min}.`);
      else if (f.integer && !Number.isInteger(n)) errs.push(`${f.label} debe ser un entero.`);
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length) return;

    setBusy(true);
    try {
      let imgdir = isEdit ? initial.imgdir : undefined;
      if (blob) {
        const form = new FormData();
        form.append('file', blob, 'rock.webp');
        const { url } = await apiFetch('/api/admin/uploads', { method: 'POST', body: form });
        imgdir = url;
      }

      const body = {
        name: fields.name.trim(),
        price: Number(fields.price),
        stock: Number(fields.stock),
        weight: fields.weight === '' ? null : Number(fields.weight),
        height: fields.height === '' ? null : Number(fields.height),
        width: fields.width === '' ? null : Number(fields.width),
        length: fields.length === '' ? null : Number(fields.length),
        volume: fields.volume === '' ? null : Number(fields.volume),
        imgdir,
      };

      const saved = isEdit
        ? await apiFetch(`/api/rocks/${initial.id}`, { method: 'PUT', body })
        : await apiFetch('/api/rocks', { method: 'POST', body });

      onSaved?.(saved);
      if (!isEdit) {
        setFields({ ...EMPTY });
        setBlob(null);
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rock-form">
      <h2 className="h4 mb-3">{isEdit ? `Editar: ${initial.name}` : 'Añadir Nueva Roca'}</h2>

      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="mb-3 text-white">
        <label className="form-label text-white" htmlFor="rock-name">Nombre</label>
        <input id="rock-name" className="form-control text-white" value={fields.name}
               onChange={(e) => setField('name', e.target.value)} maxLength={150} required />
      </div>

      <div className="row g-3 mb-3">
        {NUMERIC_FIELDS.map((f) => (
          <div className="col-6 col-md-3" key={f.key}>
            <label className="form-label text-white" htmlFor={`rock-${f.key}`}>{f.label}</label>
            <input id={`rock-${f.key}`} type="number" className="form-control text-white"
                   min={f.min} step={f.integer ? 1 : 'any'}
                   value={fields[f.key]} onChange={(e) => setField(f.key, e.target.value)}
                   required={f.required} />
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Imagen</label>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="rock-preview">
            {previewUrl
              ? <img src={previewUrl} alt="Vista previa de la roca" />
              : <span className="text-secondary">Sin imagen</span>}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
                   className="d-none" onChange={handleFile} />
            <button type="button" className="btn btn-outline-light btn-sm me-2"
                    onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {blob && (
              <button type="button" className="btn btn-link text-danger btn-sm" onClick={removeImage}>
                Quitar recorte
              </button>
            )}
            <div><small className="text-secondary">PNG / JPEG / WEBP / GIF · máx 5 MB · recorte cuadrado</small></div>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-light" disabled={busy}>
        {busy ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Guardar Roca en Inventario'}
      </button>

      {cropping && (
        <div className="crop-modal">
          <div className="crop-dialog">
            <h3 className="h5 mb-3">Recortar imagen</h3>
            <div className="crop-area">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
              />
            </div>
            <label className="form-label mt-3" htmlFor="crop-zoom">Zoom</label>
            <input id="crop-zoom" type="range" min={1} max={3} step={0.05}
                   value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="form-range" />
            <div className="d-flex gap-2 mt-3 justify-content-end">
              <button type="button" className="btn btn-outline-light" onClick={() => setCropping(false)}>Cancelar</button>
              <button type="button" className="btn btn-light" onClick={applyCrop} disabled={!croppedArea}>Aplicar recorte</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}