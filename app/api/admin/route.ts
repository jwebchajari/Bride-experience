import { NextResponse } from "next/server";

const DB_URL = "https://savia-876cf-default-rtdb.firebaseio.com";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Falta configurar ADMIN_PASSWORD en las variables de entorno." },
      { status: 500 }
    );
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const secret = process.env.FIREBASE_DB_SECRET;
  const url = `${DB_URL}/evento.json${secret ? `?auth=${encodeURIComponent(secret)}` : ""}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            "No se pudo leer la base de datos. Revisá las reglas de Firebase o la variable FIREBASE_DB_SECRET.",
        },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json({ registros: data ?? {} });
  } catch {
    return NextResponse.json(
      { error: "Error de conexión con Firebase. Intentá de nuevo." },
      { status: 502 }
    );
  }
}
