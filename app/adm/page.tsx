"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import styles from "./admin.module.css";

type Reserva = {
	id: string;
	nombre?: string | null;
	email?: string | null;
	telefono?: string | null;
	fechaCasamiento?: string | null;
	mensaje?: string | null;
	creadoEn?: number | string | null;
};

function toTimestamp(value?: number | string | null) {
	if (typeof value === "number") return value;
	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? 0 : parsed;
	}
	return 0;
}

function formatDate(value?: string | null) {
	if (!value) return "Sin fecha";

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;

	return parsed.toLocaleDateString("es-AR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function formatDateTime(value?: number | string | null) {
	const timestamp = toTimestamp(value);
	if (!timestamp) return "Recibida recientemente";

	return new Date(timestamp).toLocaleString("es-AR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function buildWhatsAppLink(telefono?: string | null) {
	const digits = (telefono ?? "").replace(/\D/g, "");
	const message = encodeURIComponent(
		"Hola, te contacto desde Bride Experience para seguir con tu reserva.",
	);

	return digits ? `https://wa.me/${digits}?text=${message}` : "#";
}

export default function AdminPage() {
	const [reservas, setReservas] = useState<Reserva[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const reservasRef = ref(db, "evento");

		const unsubscribe = onValue(
			reservasRef,
			(snapshot) => {
				const data = snapshot.val();

				if (!data) {
					setReservas([]);
					setLoading(false);
					return;
				}

				const items = Object.entries(data).map(([id, value]) => ({
					id,
					...(value as Record<string, unknown>),
				})) as Reserva[];

				items.sort(
					(a, b) => toTimestamp(b.creadoEn) - toTimestamp(a.creadoEn),
				);
				setReservas(items);
				setLoading(false);
			},
			() => {
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, []);

	return (
		<main className={styles.adminPage}>
			<section
				className={styles.adminShell}
				aria-labelledby="admin-title"
			>
				<header className={styles.adminHeader}>
					<div>
						<p className={styles.eyebrow}>Panel de inscripciones</p>
						<h1 id="admin-title">Reservas recibidas</h1>
						<p className={styles.adminIntro}>
							Acá podés revisar todas las personas interesadas y
							contactarlas directo desde la plataforma.
						</p>
					</div>

					<div className={styles.adminContactCard}>
						<p>Contactar rápido</p>
						<a
							href="https://wa.me/5491123456789?text=Hola%2C%20quiero%20consultar%20por%20Bride%20Experience"
							target="_blank"
							rel="noreferrer"
							className={`${styles.adminCta} ${styles.adminCtaWhatsapp}`}
						>
							WhatsApp
						</a>
						<a
							href="mailto:hola@brideexperience.com?subject=Consulta%20Bride%20Experience"
							className={`${styles.adminCta} ${styles.adminCtaMail}`}
						>
							Enviar mail
						</a>
					</div>
				</header>

				{loading ? (
					<div className={styles.adminState}>
						Cargando inscripciones…
					</div>
				) : reservas.length === 0 ? (
					<div className={`${styles.adminState} ${styles.empty}`}>
						Todavía no hay inscripciones registradas.
					</div>
				) : (
					<div className={styles.adminList}>
						{reservas.map((reserva) => (
							<article
								className={styles.reservationCard}
								key={reserva.id}
							>
								<div className={styles.reservationTop}>
									<div>
										<h2>
											{reserva.nombre || "Sin nombre"}
										</h2>
										<p className={styles.reservationDate}>
											{formatDateTime(reserva.creadoEn)}
										</p>
									</div>
									<span className={styles.reservationBadge}>
										Reserva
									</span>
								</div>

								<div className={styles.reservationBody}>
									<p>
										<strong>Email:</strong>{" "}
										{reserva.email ? (
											<a href={`mailto:${reserva.email}`}>
												{reserva.email}
											</a>
										) : (
											"No informado"
										)}
									</p>
									<p>
										<strong>Teléfono:</strong>{" "}
										{reserva.telefono || "No informado"}
									</p>
									<p>
										<strong>Fecha tentativa:</strong>{" "}
										{formatDate(reserva.fechaCasamiento)}
									</p>
									<p>
										<strong>Mensaje:</strong>{" "}
										{reserva.mensaje || "Sin observaciones"}
									</p>
								</div>

								<div className={styles.reservationActions}>
									{reserva.telefono ? (
										<a
											href={buildWhatsAppLink(
												reserva.telefono,
											)}
											target="_blank"
											rel="noreferrer"
											className={`${styles.actionLink} ${styles.whatsapp}`}
										>
											WhatsApp
										</a>
									) : null}
									{reserva.email ? (
										<a
											href={`mailto:${reserva.email}?subject=Consulta%20Bride%20Experience`}
											className={`${styles.actionLink} ${styles.mail}`}
										>
											Mail
										</a>
									) : null}
								</div>
							</article>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
