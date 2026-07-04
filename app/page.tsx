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
					Un encuentro diseñado para inspirarte, descubrir tendencias
					y sentir la magia de tu próximo gran día.
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
					Un espacio exclusivo en Chajarí, Entre Ríos, para futuras
					novias que quieren vivir una tarde con inspiración, consejos
					y profesionales del mundo nupcial.
				</p>
				<p>
					El evento se realizará el 8 de agosto de 15 a 18 hs. Será
					una experiencia con ideas de estilo, propuestas de
					ambientación, asesoramiento y la posibilidad de probarte
					vestidos junto a<em>Atelier Privé</em>.
				</p>
				<p>
					Plazas limitadas. Una vez inscriptas, nuestro equipo se
					contactará para confirmar tu lugar y compartir todos los
					detalles.
				</p>
				<p className="intro-price">Inversión: $50.000</p>
			</section>

			<section
				className="form-section"
				id="reserva"
				aria-labelledby="form-title"
			>
				<Divider />
				<h2 id="form-title" className="section-title">
					Reservá tu lugar
				</h2>
				<p className="form-lead">
					Dejanos tus datos y te contactaremos en breve con la
					confirmación y toda la información del evento.
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
