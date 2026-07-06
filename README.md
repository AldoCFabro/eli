# Eli

MVP para gestionar alumnos, instructores, actividades y horarios de una academia, club, gimnasio o
taller. Multi-negocio: cada cuenta administra los datos de un único negocio, sin cruces entre
cuentas distintas.

## Stack

- Next.js 16 (App Router) + TypeScript
- MongoDB + Mongoose
- Tailwind CSS v4, mobile-first, navegación inferior flotante
- Auth propia: bcrypt + JWT (`jose`) en cookie httpOnly/secure/sameSite
- Zod para validación de formularios (cliente y servidor)
- Vercel Blob para el logo del negocio
- Rate limiting in-memory en login/registro
- Pensado para correr 100% sobre infraestructura gratuita de Vercel: Hobby plan + MongoDB Atlas
  (Marketplace) + Vercel Blob

## Correr el proyecto localmente

Requisitos: Node 20+, pnpm, una base MongoDB (local o Atlas).

```bash
pnpm install
cp .env.example .env.local   # completá las variables, ver abajo
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000). La primera vez te pide crear una cuenta y
después te lleva al onboarding para configurar el negocio.

### Base de datos local rápida (opcional)

Si tenés `mongod` instalado:

```bash
mongod --dbpath /tmp/eli-mongo --port 27017 --fork --logpath /tmp/eli-mongo.log
```

y en `.env.local`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/eli-dev
```

### Datos de ejemplo (seed)

```bash
pnpm seed
```

Borra todo lo que haya en la base configurada en `MONGODB_URI` y la recarga con un dataset real
de ejemplo: el negocio "EP Estudio", la cuenta `aldocfabro@gmail.com` (contraseña `EpEstudio2026!`),
la instructora Eliana Pellegrini, 3 disciplinas (Compe Pekes, Compe Reggeton, Compe Brasilero) y 28
alumnas/os con sus datos reales de documento y fecha de nacimiento. Pensado para desarrollo local:
correlo las veces que quieras para volver a un estado limpio y conocido.

## Variables de entorno

Ver `.env.example`. Resumen:

| Variable | Para qué |
| --- | --- |
| `MONGODB_URI` | Conexión a MongoDB. Se completa sola si usás el Marketplace de Vercel para Atlas |
| `AUTH_SECRET` | Firma de las sesiones (JWT). Generalo con `openssl rand -base64 48` |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob. Se completa sola al crear un Blob Store en el proyecto |

Sin `BLOB_READ_WRITE_TOKEN` configurada, todo funciona igual salvo la subida de logo (onboarding y
configuración devuelven un error controlado si intentás subir uno).

## Deploy en Vercel (todo con infraestructura gratuita)

1. Importá el repo en Vercel.
2. En el proyecto → **Storage** → **Marketplace**, provisioná un cluster **MongoDB Atlas** (plan
   Free M0). Vercel completa `MONGODB_URI` solo.
3. En el proyecto → **Storage** → **Create Database**, creá un **Blob Store**. Vercel completa
   `BLOB_READ_WRITE_TOKEN` solo.
4. Cargá `AUTH_SECRET` a mano en las variables de entorno del proyecto.
5. Deploy. No hace falta configuración adicional: el build (`next build`) y el runtime de Server
   Actions/Route Handlers corren tal cual sobre Vercel.
6. Para desarrollar en local contra los mismos recursos: `vercel link` y después
   `vercel env pull .env.local` te trae las tres variables ya completas.

Tené en cuenta que el plan **Hobby** de Vercel es solo para uso no comercial — para vender esto a
academias/clubes reales hace falta pasar a **Pro**.

## Estructura

```
app/
  (auth)/        login, registro
  onboarding/    configuración inicial obligatoria del negocio
  (app)/         rutas protegidas: dashboard, alumnos, instructores, actividades, horarios, ajustes
components/
  ui/            primitivos visuales (Button, Input, Card, Badge, ...)
  layout/        sidebar, bottom nav, topbar
  forms/         formularios por entidad
lib/
  db/            conexión a Mongo cacheada para serverless
  auth/          sesión, hash de contraseñas, guards de ruta
  validations/   esquemas Zod por entidad
  blob/          subida de imágenes a Vercel Blob
  rate-limit/    limitador in-memory
models/          esquemas de Mongoose
proxy.ts         protección de rutas (reemplaza a middleware.ts en Next 16)
```

## Decisiones y límites conocidos del MVP

- **Rate limit in-memory**: funciona dentro de un mismo proceso Node. En un deploy serverless con
  múltiples instancias no es una defensa dura contra fuerza bruta — para producción real,
  reemplazar por Upstash Redis u otro store compartido.
- **Multi-tenancy**: toda consulta filtra por `businessId`, que sale siempre de la sesión
  (`requireSession`/`requireOnboardedSession`), nunca de un valor recibido del cliente.
- **Sin pagos, asistencia, facturación ni notificaciones**: fuera de alcance de este MVP, tal como
  se pidió.
- **Roles**: el modelo soporta `owner`/`admin`, pero hoy no hay diferencias de permisos entre
  ambos — es la base para agregarlas después.

## Qué falta para producción real

- Reemplazar el rate limiter in-memory por uno respaldado en Redis/Upstash.
- Verificación de email al registrarse.
- Recuperación de contraseña.
- Backups y monitoreo de MongoDB.
- Tests automatizados (el MVP se validó manualmente end-to-end, sin suite de tests).
- Revisar límites de tamaño/rate en la subida de imágenes a nivel de infraestructura (hoy solo se
  valida en la Server Action).
