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
   | `ADMIN_PASSWORD` | La contraseña para entrar al panel `/admin` |
   | `FIREBASE_DB_SECRET` | (Recomendado) Secreto de la base de datos, para que el panel pueda leer aunque la lectura pública esté bloqueada. Se obtiene en Firebase: **Configuración del proyecto → Cuentas de servicio → Secretos de bases de datos** |

   `NEXT_PUBLIC_SITE_URL` se usa para que los metadatos Open Graph (imagen al compartir el link) apunten a la URL correcta. Para desarrollo local, creá un archivo `.env.local` con esas mismas variables.

## Panel de administración

En `/admin` hay un panel protegido por contraseña (la de `ADMIN_PASSWORD`) para ver todas las reservas: cantidad total, búsqueda, links directos a WhatsApp y email, y botón de actualizar. Está diseñado mobile-first para verlo cómodo desde el celular.

La contraseña se verifica **en el servidor** (route handler de Next.js) y la lectura de Firebase también se hace desde el servidor usando `FIREBASE_DB_SECRET`, así ni la contraseña ni el secreto llegan nunca al navegador y las reglas de lectura pública pueden quedar cerradas.

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
