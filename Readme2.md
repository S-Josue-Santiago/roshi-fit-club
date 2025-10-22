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
roshi_fit/src/api/planApi.ts
roshi_fit/src/components/auth/RegisterForm.tsx
roshi_fit/src/components/auth/PaymentForm.tsx

📦 roshi_fit_club
├── 📁 backend
│   ├── 📁 prisma
│   │   └── 📄 schema.prisma
│   ├── 📁 scripts
│   │   └── 📄 updatePassword.ts
│   ├── 📁 src
│   │   ├── 📁 controllers
│   │   │   ├── authController.ts
│   │   │   ├── contentController.ts
│   │   │   ├── equipmentController.ts
│   │   │   ├── galleryController.ts
│   │   │   ├── paymentMethodController.ts
│   │   │   ├── planController.ts
│   │   │   ├── productController.ts
│   │   │   ├── scheduleController.ts
│   │   │   ├── serviceController.ts
│   │   │   ├── testimonialController.ts
│   │   │   └── userController.ts
│   │   ├── 📁 routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── contentRoutes.ts
│   │   │   ├── equipmentRoutes.ts
│   │   │   ├── galleryRoutes.ts
│   │   │   ├── paymentMethodRoutes.ts
│   │   │   ├── planRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── scheduleRoutes.ts
│   │   │   ├── serviceRoutes.ts
│   │   │   ├── testimonialRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── 📁 services (vacío)
│   │   ├── 📄 app.ts
│   │   └── 📄 server.ts
│   ├── 📄 .gitignore
│   ├── 📄 package.json
│   ├── 📄 testPassword.ts
│   ├── 📄 tsconfig.json
│   └── 📄 updatePassword.ts
│
├── 📁 public
│   └── 📁 assets
│       ├── 📁 equipment
│       │   └── imagen1.jpg
│       ├── 📁 gallery
│       │   └── imagen1.jpg
│       ├── 📁 products
│       │   └── imagen1.jpg
│       ├── 📁 services
│       │   ├── imagen1.jpg
│       │   └── kamehameha_cardio.jpg
│       ├── 📁 testimonials
│       │   └── imagen1.jpg
│       ├── icono1.png
│       └── imagen1.jpg
│
├── 📁 src
│   ├── 📁 api
│   │   ├── authApi.ts
│   │   ├── axiosInstance.ts
│   │   ├── contentApi.ts
│   │   ├── equipmentApi.ts
│   │   ├── galleryApi.ts
│   │   ├── paymentMethodApi.ts
│   │   ├── planApi.ts
│   │   ├── productApi.ts
│   │   ├── scheduleApi.ts
│   │   ├── serviceApi.ts
│   │   ├── testimonialApi.ts
│   │   └── userApi.ts
│   ├── 📁 assets
│   │   ├── 📁 services
│   │   │   ├── gravitacional_personal.jpg
│   │   │   └── kamehameha_cardio.jpg
│   │   ├── icono1.png
│   │   └── imagen1.jpg
│   ├── 📁 components
│   │   ├── 📁 auth
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterFormWithPayment.tsx
│   │   │   └── RegistrationProgress.tsx
│   │   ├── 📁 common
│   │   │   ├── ContactSection.tsx
│   │   │   ├── EquipmentCarousel.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── GeneralSchedule.tsx
│   │   │   ├── PlansCarousel.tsx
│   │   │   ├── ServicesCarousel.tsx
│   │   │   ├── TestimonialsGrid.tsx
│   │   │   └── TopProductsCarousel.tsx
│   │   ├── 📁 dashboard
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── 📁 temas
│   │   │   ├── 📁 Futurista
│   │   │   │   ├── NavbarFuturista.tsx
│   │   │   │   └── WelcomeRoshiFuturista.tsx
│   │   │   └── 📁 Original
│   │   │       ├── NavbarOriginal.tsx
│   │   │       └── WelcomeRoshiOriginal.tsx
│   │   ├── Layout.tsx
│   │   ├── Modal.tsx
│   │   └── Navbar.tsx
│   ├── 📁 config (vacío)
│   ├── 📁 contexts
│   │   ├── DashboardThemeContext.tsx
│   │   └── ThemeContext.tsx
│   ├── 📁 hooks (vacío)
│   ├── 📁 pages
│   │   ├── 📁 dashboard
│   │   │   ├── 📁 users
│   │   │   │   ├── CreateUserModal.tsx
│   │   │   │   ├── ResetPasswordModal.tsx
│   │   │   │   ├── UserActions.tsx
│   │   │   │   ├── UserEditModal.tsx
│   │   │   │   ├── UserFilters.tsx
│   │   │   │   └── UserList.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ClienteDashboard.tsx
│   │   │   └── EntrenadorDashboard.tsx
│   │   ├── HomePage.tsx
│   │   └── WelcomeRoshi.tsx
│   ├── 📁 styles
│   │   ├── base.css
│   │   └── index.css
│   ├── 📁 types
│   │   ├── Content.ts
│   │   ├── Equipment.ts
│   │   ├── GalleryItem.ts
│   │   ├── PaymentMethod.ts
│   │   ├── Plan.ts
│   │   ├── Product.ts
│   │   ├── Schedule.ts
│   │   ├── Service.ts
│   │   ├── Testimonial.ts
│   │   └── User.ts
│   ├── 📁 utils (vacío)
│   ├── 📄 App.css
│   ├── 📄 App.tsx
│   ├── 📄 index.css
│   └── 📄 main.tsx
│
├── 📄 .gitignore
├── 📄 base_de_datos_en_español.sql
├── 📄 datos_db.txt
├── 📄 eslint.config.js
├── 📄 flujo_a_saber.txt
├── 📄 index.html
├── 📄 package.json
├── 📄 proto.html
├── 📄 react.txt
├── 📄 READEME2.md
├── 📄 README.md
├── 📄 Readme2.md
├── 📄 tailwind.config.js
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts
