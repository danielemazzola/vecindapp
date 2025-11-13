# API Endpoints — VecindApp

Este documento resume los endpoints disponibles en el backend, sus rutas, middlewares esperados y ejemplos de body/respuesta para facilitar pruebas con Insomnia / Postman.

Nota rápida: el router principal monta estos sub-routers en `/api` desde `index.js` -> `MAIN_ROUTES`.

Autenticación

- La mayoría de endpoints protegidos requieren header:
  - `Authorization: Bearer <JWT_TOKEN>`

Formato de respuestas

- Por convención se devuelve JSON con al menos `message` y, cuando aplica, la entidad en `data` o `community`, `user`, etc.

---

USERS
Base path: `/api/users`

1. Crear usuario

- Method: POST
- Path: `/create-user`
- Auth: Público
- Body (JSON):

```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "password": "MiPass123",
  "roles": ["user"]
}
```

- Ejemplo respuesta (201):

```json
{
  "message": "User created successfully",
  "user": { "_id": "...", "email": "juan@example.com", "name": "Juan Perez" }
}
```

2. Login

- Method: POST
- Path: `/login`
- Auth: Público
- Body:

```json
{ "email": "juan@example.com", "password": "MiPass123" }
```

- Respuesta (200):

```json
{ "message": "Login successful", "token": "<JWT>", "user": { ... } }
```

3. Profile (obtener datos del usuario autenticado)

- Method: GET
- Path: `/profile`
- Auth: `isAuth`

4. Actualizar perfil

- Method: PUT
- Path: `/update-profile`
- Auth: `isAuth`
- Body: campos a actualizar (por ejemplo `name`, `phone`)

5. Update avatar

- Method: PUT
- Path: `/update-avatar/:id`
- Auth: `isAuth`
- Form-data: campo `vcd_avatar` (file)

---

COUNTRIES
Base path: `/api/countries`

1. Crear país

- Method: POST
- Path: `/create-country`
- Auth: `isAuth`, `isAdmin`
- Body example:

```json
{ "name": "Spain", "code": "ES" }
```

2. Actualizar país

- Method: PUT
- Path: `/update-country/:id`
- Auth: `isAuth`, `isAdmin`

3. Obtener países

- Method: GET
- Path: `/get-countries`
- Auth: Público

---

LICENSES
Base path: `/api/licenses`

1. Crear licencia

- Method: POST
- Path: `/create-license`
- Auth: `isAuth`, `isAdmin`
- Body (ejemplo):

```json
{
  "name": "Basic",
  "details": { "userType": "community", "maxAllowed": 10 },
  "price": 0
}
```

2. Actualizar licencia

- Method: POST
- Path: `/update-license/:id`
- Auth: `isAuth`, `isAdmin`

---

COMMUNITY
Base path: `/api/community`

1. Crear comunidad

- Method: POST
- Path: `/create-community`
- Auth: `isAuth`, `authority` (permiso o licencia válida)
- Body (JSON):

```json
{
  "name": "Residencial Los Alamos",
  "description": "Comunidad residencial con áreas verdes",
  "email": "losalamos@community.com",
  "phone": "+34 123 456 789",
  "address": "Calle Principal 123",
  "postal_code": "28001",
  "city": "Madrid",
  "country": "Spain",
  "province": "Madrid",
  "creatorAdminId": "653f3f39c843c62d6b56d2b3",
  "creatorCamId": "653f3f39c843c62d6b56d2b4"
}
```

- Notes: el servidor intentará geocodificar la dirección (usa `geocode.config.js`) y guardará `location: { type: 'Point', coordinates: [lng, lat] }`.

2. Solicitar unirse a comunidad

- Method: POST
- Path: `/request-community/:id`
- Auth: `isAuth`

3. Obtener solicitudes pendientes

- Method: GET
- Path: `/request-pending-community/:id`
- Auth: `isAuth`, `authority`

4. Confirmar solicitud

- Method: PUT
- Path: `/confirm-request-community/:id`
- Auth: `isAuth`, `authority`

5. Obtener comunidad por id

- Method: GET
- Path: `/get-community/:id`
- Auth: Público (según implementacion actual puede variar)

6. Actualizar comunidad (placeholder)

- Method: PUT
- Path: `/update-community/:id`
- Auth: Privado (currently returns 501)

---

PURCHASE (Licencias)
Base path: `/api/secure/purchase`

1. Comprar licencia

- Method: POST
- Path: `/purchase-license/:id`
- Auth: `isAuth`, `isLicense`

---

MIDDLEWARES IMPORTANTES

- `isAuth` — Verifica JWT en `Authorization` header y agrega `req.user`.
- `isAdmin` — Verifica rol de admin en `req.user.roles`.
- `authority` — Comprueba permisos combinando rol y validez de licencia.
- `isLicense` — Verifica que el usuario tenga licencia válida para la operación.

---

HOW TO TEST (Insomnia / Postman)

1. Start server: `npm run dev` (asegúrate de tener `.env` correcto y MongoDB corriendo).
2. Register / login a user to obtain JWT.
3. Usar el JWT en el header `Authorization: Bearer <token>` para endpoints protegidos.
4. Probar `POST /api/community/create-community` con el JSON de ejemplo.

---

Notas finales

- Si quieres que genere un archivo exportable de Insomnia (workspace) con ejemplos listos para importar, puedo generarlo en JSON.
- ¿Prefieres el documento en inglés o quieres que agregue más ejemplos de respuesta y códigos HTTP por endpoint?
