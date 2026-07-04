# Bride Experience — Formulario de contacto

Landing minimalista y elegante para el evento **Bride Experience**, construida con **Next.js (App Router)** y **Firebase Realtime Database**.

## Cómo funciona

- Las reservas del formulario se guardan en el nodo `evento` de la base:
  `https://savia-876cf-default-rtdb.firebaseio.com/evento`
- Cada registro incluye: `nombre`, `email`, `telefono`, `fechaCasamiento`, `mensaje` y `creadoEn` (timestamp del servidor).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## Deploy en Vercel

1. Subí el repositorio a GitHub y conectalo en Vercel (framework: Next.js, sin configuración extra).
2. En **Settings → Environment Variables** agregá:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | La URL final del sitio, ej. `https://bride-experience.vercel.app` |

   Esta variable se usa para que los metadatos Open Graph (imagen al compartir el link) apunten a la URL correcta.

3. Deploy. Al compartir el link en WhatsApp / Instagram / Facebook se va a ver el logo (`public/logo.jpg`) con título y descripción.

## Reglas de Firebase (importante)

Para que el formulario pueda escribir sin exponer la lectura de los datos, en la consola de Firebase → Realtime Database → Reglas, se recomienda:

```json
{
  "rules": {
    "evento": {
      ".read": false,
      ".write": true,
      "$reserva": {
        ".validate": "newData.hasChildren(['nombre', 'email', 'telefono'])"
      }
    }
  }
}
```

Así cualquiera puede enviar una reserva, pero nadie puede leer la lista de inscriptas desde afuera (solo vos desde la consola de Firebase).

## SEO incluido

- Metadatos completos (`title`, `description`, `keywords`, `canonical`)
- Open Graph + Twitter Card con el logo como imagen de vista previa
- `robots.txt` y `sitemap.xml` generados automáticamente
- HTML semántico en español (`lang="es"`), accesible y responsive
