import { useState } from 'react';
import { getStoredCustomRocks, saveCustomRocks } from '../../lib/adminData';

export default function AddRockForm({ onRockAdded }) {
  const [formData, setFormData] = useState({
    name: '', price: '', shippingFee: '', weight: '', height: '', width: '', length: '', volume: '', imgdir: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRock = {
      name: formData.name,
      price: Number(formData.price),
      'shipping-fee': Number(formData.shippingFee),
      weight: Number(formData.weight),
      height: Number(formData.height),
      width: Number(formData.width),
      length: Number(formData.length),
      volume: Number(formData.volume),
      imgdir: formData.imgdir || 'assets/images/attachment.gif'
    };

    const customRocks = getStoredCustomRocks();
    customRocks.push(newRock);
    saveCustomRocks(customRocks);
    
    onRockAdded(newRock);
    alert("¡Roca guardada exitosamente!");
    setFormData({ name: '', price: '', shippingFee: '', weight: '', height: '', width: '', length: '', volume: '', imgdir: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black p-4 rounded-4 text-white">
      <h4 className="mb-3">Añadir Nueva Roca</h4>
      <div className="row g-3">
        <div className="col-md-6"><input name="name" className="form-control bg-dark text-white border-secondary" placeholder="Nombre" value={formData.name} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="price" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Precio" value={formData.price} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="shippingFee" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Envío" value={formData.shippingFee} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="weight" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Peso (g)" value={formData.weight} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="height" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Altura (mm)" value={formData.height} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="width" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Anchura (mm)" value={formData.width} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="length" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Longitud (mm)" value={formData.length} onChange={handleChange} required /></div>
        <div className="col-md-3"><input name="volume" type="number" className="form-control bg-dark text-white border-secondary" placeholder="Volumen" value={formData.volume} onChange={handleChange} required /></div>
        <div className="col-12"><input name="imgdir" className="form-control bg-dark text-white border-secondary" placeholder="Ruta de imagen (ej: assets/1.png)" value={formData.imgdir} onChange={handleChange} /></div>
      </div>
      <button type="submit" className="btn btn-light mt-3 fw-bold">Guardar Roca en Inventario</button>
    </form>
  );
}