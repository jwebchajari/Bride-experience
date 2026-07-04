"use client";

import { useState } from "react";
import { push, ref, serverTimestamp } from "firebase/database";
import { db } from "@/lib/firebase";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    try {
      await push(ref(db, "evento"), {
        nombre: String(data.get("nombre") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        telefono: String(data.get("telefono") ?? "").trim(),
        fechaCasamiento: String(data.get("fecha") ?? "").trim() || null,
        mensaje: String(data.get("mensaje") ?? "").trim() || null,
        creadoEn: serverTimestamp(),
      });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="form-success-diamond" aria-hidden="true">
          ✦
        </span>
        <h3>¡Gracias por tu reserva!</h3>
        <p>
          Recibimos tus datos correctamente. Muy pronto vamos a contactarte con
          todos los detalles del evento.
        </p>
        <button
          type="button"
          className="link-button"
          onClick={() => setStatus("idle")}
        >
          Enviar otra reserva
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="nombre">Nombre y apellido</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          placeholder="Ej.: María González"
          required
          minLength={3}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="telefono">Teléfono / WhatsApp</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            placeholder="Ej.: 3456 123456"
            required
            minLength={6}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="fecha">
          Fecha tentativa del casamiento <span className="optional">(opcional)</span>
        </label>
        <input id="fecha" name="fecha" type="date" />
      </div>

      <div className="field">
        <label htmlFor="mensaje">
          Contanos algo más <span className="optional">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          placeholder="Consultas, comentarios o lo que quieras contarnos…"
        />
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          No pudimos enviar tu reserva. Revisá tu conexión e intentá de nuevo.
        </p>
      )}

      <button type="submit" className="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar reserva"}
      </button>
    </form>
  );
}
