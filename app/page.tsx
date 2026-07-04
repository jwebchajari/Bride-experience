import ContactForm from "@/components/ContactForm";

function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <span className="divider-diamond">✦</span>
      <span className="divider-line" />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Evento Exclusivo para Novias</p>
        <h1 className="hero-title">
          Bride
          <br />
          Experience
        </h1>
        <Divider />
        <p className="hero-sub">
          Una experiencia creada para inspirarte en uno de los momentos más
          especiales de tu vida.
        </p>
        <a href="#reserva" className="hero-cta">
          Reservar mi lugar
        </a>
      </section>

      <section className="intro" aria-labelledby="intro-title">
        <h2 id="intro-title" className="section-title">
          El encuentro
        </h2>
        <p>
          Este encuentro nace con el deseo de crear un espacio de inspiración
          para futuras novias. Una tarde pensada para disfrutar, conectar y
          vivir experiencias únicas junto a diferentes profesionales del rubro.
        </p>
        <p>
          Habrá propuestas, detalles, ideas, algo rico para compartir y la
          posibilidad de probarte distintos estilos de vestidos junto a{" "}
          <em>Atelier Privé</em>.
        </p>
      </section>

      <section className="form-section" id="reserva" aria-labelledby="form-title">
        <Divider />
        <h2 id="form-title" className="section-title">
          Reservá tu lugar
        </h2>
        <p className="form-lead">
          Dejanos tus datos y te contactamos con todos los detalles del evento.
        </p>
        <ContactForm />
      </section>

      <footer className="footer">
        <p className="footer-mark">Bride Experience</p>
        <p className="footer-note">Evento Exclusivo para Novias</p>
      </footer>
    </main>
  );
}
