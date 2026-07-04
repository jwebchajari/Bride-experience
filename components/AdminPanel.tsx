"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Registro = {
	nombre?: string;
	email?: string;
	telefono?: string;
	fechaCasamiento?: string | null;
	mensaje?: string | null;
	creadoEn?: number;
};

type Entrada = Registro & { id: string };

const SESSION_KEY = "be-admin-pass";

function formatearFecha(ms?: number) {
	if (!ms) return "—";
	return new Intl.DateTimeFormat("es-AR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(ms));
}

function formatearCasamiento(iso?: string | null) {
	if (!iso) return null;
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	return new Intl.DateTimeFormat("es-AR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date(y, m - 1, d));
}

function soloDigitos(tel?: string) {
	return (tel ?? "").replace(/\D/g, "");
}

export default function AdminPanel() {
	const [password, setPassword] = useState("");
	const [autenticada, setAutenticada] = useState(false);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [registros, setRegistros] = useState<Entrada[]>([]);
	const [busqueda, setBusqueda] = useState("");

	const cargar = useCallback(async (pass: string) => {
		setCargando(true);
		setError(null);
		try {
			const res = await fetch("/api/admin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password: pass }),
			});
			const data = await res.json();

			if (!res.ok) {
				if (res.status === 401) sessionStorage.removeItem(SESSION_KEY);
				setAutenticada(false);
				setError(data?.error ?? "No se pudo cargar la información.");
				return;
			}

			const lista: Entrada[] = Object.entries(
				(data.registros ?? {}) as Record<string, Registro>,
			)
				.map(([id, r]) => ({ id, ...r }))
				.sort((a, b) => (b.creadoEn ?? 0) - (a.creadoEn ?? 0));

			setRegistros(lista);
			setAutenticada(true);
			sessionStorage.setItem(SESSION_KEY, pass);
		} catch {
			setError("Error de conexión. Intentá de nuevo.");
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		const guardada = sessionStorage.getItem(SESSION_KEY);
		if (guardada) {
			setPassword(guardada);
			cargar(guardada);
		}
	}, [cargar]);

	function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (password.trim()) cargar(password.trim());
	}

	function cerrarSesion() {
		sessionStorage.removeItem(SESSION_KEY);
		setAutenticada(false);
		setPassword("");
		setRegistros([]);
		setBusqueda("");
	}

	const filtradas = useMemo(() => {
		const q = busqueda.trim().toLowerCase();
		if (!q) return registros;
		return registros.filter((r) =>
			[r.nombre, r.email, r.telefono]
				.filter(Boolean)
				.some((v) => String(v).toLowerCase().includes(q)),
		);
	}, [registros, busqueda]);

	/* ---------- Login ---------- */

	if (!autenticada) {
		return (
			<main className="admin admin-login">
				<div className="login-ambient" aria-hidden="true">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div className="login-wrap">
					<p className="eyebrow">Bride Experience</p>
					<h1 className="admin-login-title">Panel de reservas</h1>
					<p className="admin-login-copy">
						Gestioná tus reservas con una vista clara y cómoda desde
						tu iPhone.
					</p>
					<form className="login-card" onSubmit={handleLogin}>
						<label htmlFor="admin-pass">Contraseña de acceso</label>
						<input
							id="admin-pass"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							autoComplete="current-password"
							required
							autoFocus
						/>
						{error && (
							<p className="form-error" role="alert">
								{error}
							</p>
						)}
						<button
							type="submit"
							className="submit"
							disabled={cargando}
						>
							{cargando ? "Verificando…" : "Ingresar"}
						</button>
					</form>
					<a href="/" className="admin-back">
						← Volver al sitio
					</a>
				</div>
			</main>
		);
	}

	/* ---------- Listado ---------- */

	return (
		<main className="admin">
			<section className="admin-shell">
				<header className="admin-header">
					<div className="admin-heading">
						<p className="eyebrow">Bride Experience</p>
						<h1 className="admin-title">Reservas</h1>
						<p className="admin-subtitle">
							Gestión rápida, elegante y pensada para pantallas
							pequeñas.
						</p>
					</div>
					<button
						type="button"
						className="ghost-button"
						onClick={cerrarSesion}
					>
						Salir
					</button>
				</header>

				<div className="admin-toolbar">
					<div className="admin-toolbar-copy">
						<p className="admin-count">
							{registros.length === 1
								? "1 reserva recibida"
								: `${registros.length} reservas recibidas`}
						</p>
						<p className="admin-hint">Actualizá en un toque</p>
					</div>
					<div className="admin-toolbar-actions">
						<button
							type="button"
							className="ghost-button"
							onClick={() => cargar(password)}
							disabled={cargando}
						>
							{cargando ? "Actualizando…" : "Actualizar"}
						</button>
						<button
							type="button"
							className="ghost-button"
							onClick={() => {
								if (!registros.length) {
									alert("No hay reservas para descargar.");
									return;
								}

								const headers = [
									"Nombre",
									"Email",
									"Teléfono",
									"Fecha Casamiento",
									"Mensaje",
									"Recibida",
								];

								const rows = registros.map((registro) => [
									registro.nombre ?? "",
									registro.email ?? "",
									registro.telefono ?? "",
									registro.fechaCasamiento ?? "",
									registro.mensaje ?? "",
									formatearFecha(registro.creadoEn),
								]);

								const csvContent = [headers, ...rows]
									.map((row) =>
										row
											.map(
												(cell) =>
													`"${String(cell).replace(/"/g, '""')}"`,
											)
											.join(","),
									)
									.join("\r\n");

								const blob = new Blob(["\uFEFF" + csvContent], {
									type: "text/csv;charset=utf-8;",
								});
								const url = URL.createObjectURL(blob);
								const link = document.createElement("a");
								link.href = url;
								link.download = `reservas-bride-experience-${new Date()
									.toISOString()
									.slice(0, 10)}.csv`;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
								URL.revokeObjectURL(url);
							}}
						>
							Descargar Excel
						</button>
					</div>
				</div>

				{registros.length > 3 && (
					<input
						type="search"
						className="admin-search"
						placeholder="Buscar por nombre, email o teléfono…"
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						aria-label="Buscar reservas"
					/>
				)}

				{error && (
					<p className="form-error" role="alert">
						{error}
					</p>
				)}

				{registros.length === 0 && !cargando && (
					<div className="admin-empty">
						<span aria-hidden="true">✦</span>
						<p>
							Todavía no hay reservas. Cuando alguien complete el
							formulario, va a aparecer acá.
						</p>
					</div>
				)}

				{filtradas.length === 0 && registros.length > 0 && (
					<p className="admin-empty-search">
						Sin resultados para esa búsqueda.
					</p>
				)}

				<ul className="admin-list">
					{filtradas.map((r) => {
						const casamiento = formatearCasamiento(
							r.fechaCasamiento,
						);
						const tel = soloDigitos(r.telefono);
						return (
							<li key={r.id} className="reserva-card">
								<div className="reserva-top">
									<h2 className="reserva-nombre">
										{r.nombre || "Sin nombre"}
									</h2>
									<time className="reserva-fecha">
										{formatearFecha(r.creadoEn)}
									</time>
								</div>

								<div className="reserva-contacto">
									{r.email && (
										<a
											href={`mailto:${r.email}`}
											className="reserva-link"
										>
											✉ {r.email}
										</a>
									)}
									{r.telefono && (
										<a
											href={
												tel
													? `https://wa.me/${tel}`
													: undefined
											}
											target="_blank"
											rel="noopener noreferrer"
											className="reserva-link"
										>
											☎ {r.telefono}
										</a>
									)}
								</div>

								{casamiento && (
									<p className="reserva-detalle">
										<span>Casamiento:</span> {casamiento}
									</p>
								)}
								{r.mensaje && (
									<p className="reserva-mensaje">
										“{r.mensaje}”
									</p>
								)}
							</li>
						);
					})}
				</ul>
			</section>
		</main>
	);
}
