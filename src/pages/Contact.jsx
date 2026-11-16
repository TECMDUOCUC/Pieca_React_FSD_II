import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: conectar a un endpoint /api/contact cuando exista en el backend
    console.log('Form submission payload:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="app-container">
      <Header />
      <main className="container py-5 flex-grow-1">
        <div className="accountBox mx-auto">
          

          {submitted ? (
            <div className="contact-success text-center">
              <h2 className="h4">¡Mensaje enviado!</h2>
              <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
              <button type="button" className="btn btn-outline-light" onClick={() => setSubmitted(false)}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (

            <div>
              <h1 className="mb-4">Contáctenos</h1>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input id="name" name="name" className="form-control"
                       value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input id="email" name="email" type="email" className="form-control"
                       value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Asunto</label>
                <input id="subject" name="subject" className="form-control"
                       value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Mensaje</label>
                <textarea id="message" name="message" rows={5} className="form-control"
                          value={formData.message} onChange={handleChange} required />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-light px-5">Enviar</button>
              </div>
            </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}