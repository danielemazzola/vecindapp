# VecindApp

**VecindApp** is a platform designed to streamline the internal management of residential communities, facilitating the organization of surveys, elections for new presidents, scheduling important dates, and interaction with external companies for renovation or maintenance projects.

---

## Key Features

- **Survey and Election Management**: Create, schedule, and manage surveys and elections for the community.
- **Candidate Selection**: Allows residents to propose and select candidates for community positions.
- **Date Scheduling**: Organize and notify important dates for surveys and elections.
- **Interaction with External Companies**: Companies can apply for contracts for renovations, maintenance, or other projects.

---

## Project Architecture

```
backend/
├─ node_modules/
├─ src/
│  ├─ config/
│  │  ├─ cloudinary.config.js
│  │  ├─ env.config.js
│  │  ├─ database.config.js
│  │  ├─ geocode.util.js
│  │  └─ jwt.config.js
│  ├─ controllers/
│  │  ├─ community.controller.js
│  │  ├─ country.controller.js
│  │  ├─ license.controller.js
│  │  ├─ purchase.controller.js
│  │  └─ user.controller.js
│  ├─ helpers/
│  │  ├─ delete-avatar.helper.js
│  │  ├─ format-url.helper.js
│  │  └─ sky-id.helper.js
│  ├─ middlewares/
│  │  ├─ authority.middleware.js
│  │  ├─ check-avatar.middleware.js
│  │  ├─ is-admin.middleware.js
│  │  ├─ is-auth.middleware.js
│  │  └─ is-license.middleware.js
│  ├─ models/
│  │  ├─ commercial-profile.model.js
│  │  ├─ community.model.js
│  │  ├─ country.model.js
│  │  ├─ license.model.js
│  │  ├─ license-assignment.model.js
│  │  ├─ survey.model.js
│  │  └─ user.model.js
│  └─ routes/
│     ├─ community.routes.js
│     ├─ country.routes.js
│     ├─ license.routes.js
│     ├─ purchase.routes.js
│     ├─ user.routes.js
│     └─ main.routes.js
├─ .env
├─ .gitignore
├─ index.js
├─ package.json
└─ package-lock.json
```

---

---

## Folder reference (detailed)

Below is a short description of the main folders and important files so you and contributors can quickly find code and understand responsibilities.

### config/

- `cloudinary.config.js` — Cloudinary setup for uploads.
- `database.config.js` — MongoDB / Mongoose connection helper.
- `env.config.js` — Loads and exposes environment variables used across the app.
- `geocode.config.js` — Geocoding utility (convert address → latitude/longitude).
- `jwt.config.js` — JWT signing and verification helpers.

### controllers/

Controllers contain request handlers (business logic) used by routes.

- `community.controllers/community.controllers.js` — Create/list/update communities (location, creator ids, etc.).
- `country.controllers/country.controllers.js` — Country-related endpoints.
- `license.controller.js` — License management (assignments, validation).
- `purchase.controllers.js` — Purchase and payment handling.
- `user.controllers/user.controllers.js` — User CRUD, auth flows.

### helpers/

Lightweight utilities used across controllers and middlewares.

- `delete-avatar.js` — Remove avatar images from storage.
- `format-url.js` — Normalize/format strings for URLs (e.g. slugify or encode).
- `sku-id.js` — Helpers to generate SKU / unique identifiers.

### middlewares/

Reusable request middlewares applied to routes.

- `authority.middleware.js` — Check user authority / permissions.
- `check-avatar.middleware.js` — Validate avatar uploads.
- `is-admin.middleware.js` — Allow only admin users.
- `is-auth.middleware.js` — JWT authentication guard.
- `is-license.middleware.js` — License entitlement checks.

### models/

Mongoose schemas and models representing DB collections.

- `commercial-profile.model.js` — Company/commercial profiles.
- `community.model.js` — Community schema (location as GeoJSON Point, members, emails).
- `country.model.js` — Country data.
- `license.model.js` — License rules and limits.
- `license-assignment.model.js` — Which license is assigned to which user/org.
- `survey.model.js` — Surveys and votes.
- `user.model.js` — Users, roles and auth-related fields.

### routes/

Express route definitions that wire controllers and middlewares.

- `main.routes.js` — Main router that aggregates sub-routers.
- `community.routes/community.routes.js` — /api/communities endpoints.
- `country.routes/country.routes.js` — /api/countries endpoints.
- `license.routes/` — License-related routes.
- `user.routes/` — User and purchase routes (`user.routes.js`, `purchase.routes.js`).

---

## Quick example: create a community (Insomnia / Postman)

Endpoint: POST /api/communities

Headers:

- Content-Type: application/json

Body (JSON):

```json
{
  "name": "Residencial Los Alamos",
  "description": "Comunidad residencial con áreas verdes y zona recreativa",
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

Notes:

- Replace `PORT` and IDs with your local environment values.
- `creatorAdminId` / `creatorCamId` are optional and can be omitted.

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in the `.env` file.

4. Run the application in development mode:

```bash
npm run dev
```

5. For production:

```bash
npm start
```

---

## Dependencies

- `express` - Web framework for Node.js.
- `mongoose` - ODM for MongoDB.
- `bcrypt` - Password hashing.
- `jsonwebtoken` - JWT authentication.
- `cors` - Enable CORS in the API.
- `dotenv` - Environment variable management.
- `multer` and `multer-storage-cloudinary` - File upload handling.
- `cloudinary` - Cloud image storage.
- `stripe` - Payment processing.

**Dev dependencies:** `nodemon`, `prettier`.

---

## Author

**Daniele Mazzola**

---

## License

This project is licensed under the ISC License.
