function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Contáctanos</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form className="contact-form bg-dark p-4 rounded text-white" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control bg-dark text-white border-secondary" 
                placeholder="Nombre"
                required
              />
            </div>
            <div className="mb-3">
              <input 
                type="email" 
                className="form-control bg-dark text-white border-secondary" 
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <textarea 
                className="form-control bg-dark text-white border-secondary" 
                rows="4" 
                placeholder="Mensaje"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-light w-100">Enviar</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;