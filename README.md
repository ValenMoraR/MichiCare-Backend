# MichiCare · API (Backend)

API REST de **MichiCare**, una tienda en línea de productos para gatos. Gestiona usuarios con roles, el catálogo de productos y las consultas que los usuarios le envían a la tienda. Es la parte de servidor de la **Entrega 3** de Desarrollo Web (2026-2).

## Despliegues

| Qué | Link |
|---|---|
| API en producción (Render)       | https://michicare-backend.onrender.com |
| Sitio web en producción (Vercel) | https://michi-care-frontend.vercel.app |
| Repositorio del frontend         | https://github.com/ValenMoraR/MichiCare-Frontend |
| Repositorio del backend          | https://github.com/ValenMoraR/MichiCare-Backend |

> La API está en el plan gratuito de Render: se duerme tras unos 15 minutos sin uso, y la primera petición después tarda cerca de un minuto en responder.

## Tecnologías

Node.js · Express 5 · TypeScript · Prisma · Neon(PostgreSQL) · JWT (`jsonwebtoken`) · bcrypt · CORS

## Estructura del proyecto

```
src/
├── domain/entities/          → tipos del negocio (Product, User)
├── application/use-cases/    → casos de uso: reglas de la aplicación
├── infrastructure/database/  → conexión con PostgreSQL (cliente de Prisma)
├── interface/
│   ├── controllers/          → reciben la petición y arman la respuesta
│   ├── middleware/           → autenticación (JWT) y autorización por rol
│   └── routes/               → rutas de la API
├── generated/prisma/         → cliente generado por Prisma (no se edita)
└── index.ts                  → arranque de Express, CORS y manejo de errores
prisma/
├── schema.prisma             → modelo de datos
├── migrations/               → historial de cambios de la base de datos
└── seed.ts                   → datos iniciales
```

## Modelo de datos

| Tabla | Qué guarda |
|---|---|
| `users` | nombre, email único, contraseña (hash bcrypt) y `role` (`admin` o `user`) |
| `products` | el catálogo: nombre, descripción, precio, imagen, categoría y stock |
| `interactions` | las consultas de los usuarios: `userId` (llave foránea a `users`), `productId` (llave foránea a `products`, opcional), `tipo` (`producto` o `michi`), nombre del michi y mensaje |

El seed carga los **12 productos reales** de MichiCare y dos usuarios de prueba.

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público (siempre crea un usuario con rol `user`) |
| POST | `/api/auth/login` | Público (devuelve el JWT) |
| GET | `/api/auth/me` | Usuario autenticado |
| GET | `/api/products?page=1&limit=10&categoria=higiene` | Público. Responde `{ pagination, data }` |
| GET | `/api/products/:id` | Público |
| POST · PUT · DELETE | `/api/products` · `/api/products/:id` | Solo admin |
| POST | `/api/interactions` | Usuario autenticado (queda a nombre del usuario del token) |
| GET | `/api/interactions/mias` | Usuario autenticado: solo sus consultas |
| GET | `/api/interactions` | Solo admin: todas las consultas |

Los errores responden siempre en JSON con la forma `{ "mensaje": "..." }`, sin stack trace. Códigos usados: `400` datos inválidos, `401` sin token o token inválido/expirado (o credenciales incorrectas), `403` sin permiso para el rol, `404` no existe, `409` correo ya registrado.

## Autenticación y autorización

- Las contraseñas se guardan con **bcrypt** y nunca se devuelven en una respuesta.
- `login` devuelve un **JWT** firmado con `JWT_SECRET` (variable de entorno) y con expiración (`JWT_EXPIRES_IN`). El payload lleva solo `id` y `role`.
- Un middleware de autenticación lee `Authorization: Bearer <token>`, verifica el token y deja el usuario en la petición. Otro middleware (`authorizeRoles`) revisa el rol. Ambos se aplican en los routers, no dentro de los controladores.
- El usuario que crea una consulta sale **del token**, nunca del cuerpo de la petición.
- CORS solo permite los orígenes de la variable `FRONTEND_URL`.

## Variables de entorno

Copia `.env.example` a `.env` y completa:

| Variable | Para qué sirve |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar los tokens |
| `JWT_EXPIRES_IN` | Duración del token (por ejemplo `1d`) |
| `PORT` | Puerto del servidor (por defecto `3000`) |
| `FRONTEND_URL` | Origen(es) permitidos por CORS, separados por coma |

El archivo `.env` real no se sube al repositorio.

## Cómo correrlo en local

```bash
npm install
cp .env.example .env        # en Windows: copy .env.example .env  (y completa los valores)
npx prisma migrate dev      # crea las tablas en tu base de datos
npx prisma generate         # genera el cliente de Prisma
npm run seed                # carga los productos y los usuarios de prueba
npm run dev                 # servidor en http://localhost:3000
```

Otros scripts: `npm run build` (compila a `dist/`), `npm start` (corre la versión compilada) y `npm run migrate:deploy` (aplica las migraciones, se usa en Render).

En Render, el comando de compilación es `npm install --include=dev && npm run build && npm run migrate:deploy` y el de inicio es `npm start`.

## Credenciales de prueba

Creadas por el seed, **solo para el ambiente de esta entrega**:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@michicare.com` | `Admin12345` |
| Usuario | `user@michicare.com` | `User12345` |

### Flujo completo de un login

1. El usuario escribe su correo y contraseña en el formulario del frontend y lo envía.
2. El frontend hace `POST /api/auth/login` con esos datos.
3. El controlador valida que lleguen los dos campos y llama al caso de uso `LoginUser`.
4. El caso de uso busca al usuario por correo y compara la contraseña con el hash guardado usando `bcrypt.compare`. Si falla cualquiera de los dos, responde lo mismo (`401`, "Correo electrónico o contraseña incorrectos") para no revelar si el correo existe.
5. Si todo está bien, firma un JWT con `id` y `role`, usando `JWT_SECRET` y la expiración de `JWT_EXPIRES_IN`, y lo devuelve junto con los datos públicos del usuario.
6. El frontend guarda el token. En cada petición protegida lo envía en el header `Authorization: Bearer <token>`.
7. El middleware `authenticateToken` verifica la firma y la expiración y guarda `id` y `role` en la petición. Si el token falta o no es válido, responde `401`.
8. Si la ruta exige un rol, `authorizeRoles("admin")` compara el rol del token. Si no coincide, responde `403`. Si todo pasa, el controlador responde.

### ¿En qué caso responde 401 y en cuál 403?

- **401**: no se sabe quién eres. Ejemplo: `DELETE /api/products/1` sin token (o con un token vencido) responde "Debes iniciar sesión para acceder a este recurso".
- **403**: se sabe quién eres, pero no tienes permiso. Ejemplo: la misma petición con el token de `user@michicare.com` responde "No tienes permisos para realizar esta acción", porque borrar productos es solo para administradores.

### ¿Cómo se diferencia un admin de un usuario?

Por la columna `role` de la tabla `users`. El registro público siempre crea usuarios con rol `user`; el administrador solo existe porque lo crea el seed. El rol viaja dentro del token y es lo que revisan los middlewares.

### Si usaste IA, ¿para qué la usaste y qué tuviste que corregir?

Usé un asistente de IA para estructurar los endpoints, los middlewares y el despliegue. Tuve que corregir cosas como: ejecutar `prisma generate` a mano después de cada migración para que TypeScript reconociera los campos nuevos, instalar `@types/cors`, ajustar el seed para que los productos tuvieran datos reales y no de relleno, y reconfigurar `FRONTEND_URL` en Render para que el CORS aceptara el sitio de Vercel.

## Captura de la pestaña Network

Petición protegida (`GET /api/auth/me`) mostrando el header `Authorization`:

Me falta subir la imagen!!

## Limitaciones conocidas

- Los casos de uso importan Prisma directamente, sin una capa de repositorios; separar el acceso a datos en `infrastructure/repositories/` queda como mejora.
- El esquema incluye las tablas `cart_items` y `wishlist_items`, pero todavía no tienen endpoints: el carrito y la lista de deseos se guardan en el navegador.
- No hay pruebas automatizadas.
