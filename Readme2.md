roshi_fit/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   └── (otros archivos de configuración)
│
└── src/
    ├── api/
    ├── assets/
    ├── components/
    │   ├── auth/
    │   ├── common/
    │   └── Navbar.tsx
    ├── config/
    ├── contexts/
    │   └── ThemeContext.tsx
    ├── hooks/
    ├── pages/
    ├── styles/
    ├── ThemeFuturista/ 
        └── pages/
            └── WelcomeRoshi.tsx
    └── ThemeOriginal/
        └── pages/
            └── WelcomeRoshi.tsx // este solo trabajaria con los archivos de tema original donde lo amerite
        └── puede tener mas carpetas distintas si lo amerita
    ├── types/
    ├── utils/
    ├── App.tsx
    ├── main.tsx
    └── (otros archivos)
│
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── (otros archivos de configuración)

roshi_fit/backend/src/controllers/planController.ts
roshi_fit/backend/src/controllers/paymentController.ts
roshi_fit/backend/src/routes/paymentRoutes.ts
roshi_fit/src/types/Plan.ts
roshi_fit/src/types/PaymentMethod.ts