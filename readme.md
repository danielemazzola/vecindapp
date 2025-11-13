backend/
├─ node_modules/
│
├─ src/
│ ├─ config/
│ │ ├─ cloudinary.js
│ │ ├─ config.env.js
│ │ ├─ connectDDBB.js
│ │ ├─ fetchGeoCode.js
│ │ └─ jsonwebtoken.js
│ │
│ ├─ controllers/
│ │ ├─ community.controllers/
│ │ │ └─ community.controllers.js
│ │ ├─ country.controllers/
│ │ │ └─ country.controllers.js
│ │ ├─ license.controllers/
│ │ │ └─ license.controllers.js
│ │ ├─ purchase.controllers/
│ │ │ └─ purchase.controllers.js
│ │ └─ user.controllers/
│ │ └─ user.controllers.js
│ │
│ ├─ helpers/
│ │ ├─ delete.avatar.js
│ │ ├─ formatForURL.js
│ │ └─ skyId.js
│ │
│ ├─ middlewares/
│ │ ├─ authority.middleware.js
│ │ ├─ checkAvatar.middleware.js
│ │ ├─ isAdmin.middleware.js
│ │ ├─ isAuth.middleware.js
│ │ └─ isLicense.middleware.js
│ │
│ ├─ models/
│ │ ├─ commercialProfile.js
│ │ ├─ community.model.js
│ │ ├─ country.model.js
│ │ ├─ license.model.js
│ │ ├─ licenseAssignment.js
│ │ ├─ survey.model.js
│ │ └─ user.model.js
│ │
│ └─ routes/
│ ├─ community.routes/
│ │ └─ community.routes.js
│ ├─ country.routes/
│ │ └─ country.routes.js
│ ├─ license.routes/
│ │ └─ license.routes.js
│ ├─ user.routes/
│ │ └─ user.routes.js
│ ├─ purchase.routes.js
│ └─ main.routes.js
│
├─ .env  
├─ .gitignore
├─ .prettierrc
├─ index.js  
├─ package.json
└─ package-lock.json
