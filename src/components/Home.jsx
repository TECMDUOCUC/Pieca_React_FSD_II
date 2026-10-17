import { Link} from "react-router";

export default function Home({items, loading}) {
  

  if (loading) {
    return <main className="flex-grow-1 d-flex justify-content-center align-items-center">Cargando...</main>;
  }

  return (
    <section className="container my-5" id="about">

        <div className="row">
          
          <div className="col-md-4 mb-4 text-black">
            <h3>&bull; Sobre nosotros.</h3>
            <p>Piedras. Están en todas partes y han tenido una gran importancia histórica. Pero ahora, las piedras llegan a ti. Somos una compañía que se dedica a recolectar una gran variedad de piedras, catalogándolas por peso, tamaño, color, forma y brillo, todo para vendértelas al mejor precio.</p>
          </div>
          <div className="col-md-4 mb-4 text-black">
            <h3>&bull; Nuestro origen.</h3>
            <p>Nuestro negocio ha existido desde hace milenios. Desde el primer cavernícola que utilizó una piedra para crear fuego, hasta hoy. Hemos estado presentes desde siempre, para siempre, buscando las mejores piedras para ti.</p>
          </div>
          <div className="col-md-4 mb-4 text-black">
            <h3>&bull; ¿Cómo conseguimos tantas piedras?</h3>
            <p>Tenemos muchísimos trabajadores, los cuales pasan tardes enteras caminando por distintos lugares del mundo, ya sean playas, bosques, parques y hasta buceando. Nos aseguramos de encontrar las piedras más exóticas e interesantes para usted.</p>
          </div>
          <div className="col-md-4 mb-4 text-black">
            <h3>&bull; ¿Es legal vender Moáis reales?</h3>
            <Link to="https://es.wikipedia.org/wiki/No" className="text-black">Sí</Link>
          </div>

          <div className="text-black embed-responsive embed-responsive-1by1">
            <h3>&bull; A word from our sponsors:</h3>
            <video controls>
              <source src={`${import.meta.env.BASE_URL}media/YEAH.mp4`} type="video/mp4"/>
            Tu navegador no soporta la genialidad de PIECA&reg;
            </video>
          </div>

          <div className="col-md-4 mb-4 text-black">
            <h3>&bull; ¿Quieres más de PIECA&reg;?</h3>
            <Link to="/blog" className="text-black">Ir al BLOG</Link>
          </div>
        </div>
      </section>
  );
}