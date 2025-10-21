🥋 Roshi Fit Club: Aplicación Web de Gimnasio
Este es el repositorio frontend de Roshi Fit Club, una aplicación web moderna construida con React, TypeScript y Vite, diseñada para gestionar la experiencia de los usuarios de un gimnasio, desde el registro hasta el acceso a entrenamientos y planes.

🎯 Propósito y Visión de la Aplicación
El objetivo principal de Roshi Fit Club es ofrecer una interfaz de usuario dinámica y altamente personalizable que funcione como el punto de contacto central entre el gimnasio y sus clientes.

🌟 Características Clave (Funcionalidades)
Temas Dinámicos y Estructurales: Permite a los usuarios alternar entre dos diseños de interfaz completamente diferentes (temas) con un solo clic, afectando no solo los colores, sino también el layout y los estilos de los componentes.

Registro y Autenticación: Implementación del flujo de registro con validación, conexión a backend y gestión de modales (Registro/Login).

Rutas y Navegación: Estructura de navegación básica para las páginas principales del gimnasio.

Diseño Responsivo: Uso de Tailwind CSS para garantizar la adaptabilidad a cualquier dispositivo.

¡Excelente! Me parece una idea fantástica. Antes de sumergirnos en la lógica de autenticación, tener un archivo README.md detallado es crucial. Servirá como la documentación central de tu proyecto, Roshi Fit Club.

Aquí tienes el borrador completo, detallando la arquitectura, tecnologías, temas, y funcionalidades implementadas hasta ahora.

🥋 Roshi Fit Club: Aplicación Web de Gimnasio
Este es el repositorio frontend de Roshi Fit Club, una aplicación web moderna construida con React, TypeScript y Vite, diseñada para gestionar la experiencia de los usuarios de un gimnasio, desde el registro hasta el acceso a entrenamientos y planes.

🎯 Propósito y Visión de la Aplicación
El objetivo principal de Roshi Fit Club es ofrecer una interfaz de usuario dinámica y altamente personalizable que funcione como el punto de contacto central entre el gimnasio y sus clientes.

🌟 Características Clave (Funcionalidades)
Temas Dinámicos y Estructurales: Permite a los usuarios alternar entre dos diseños de interfaz completamente diferentes (temas) con un solo clic, afectando no solo los colores, sino también el layout y los estilos de los componentes.

Registro y Autenticación: Implementación del flujo de registro con validación, conexión a backend y gestión de modales (Registro/Login).

Rutas y Navegación: Estructura de navegación básica para las páginas principales del gimnasio.

Diseño Responsivo: Uso de Tailwind CSS para garantizar la adaptabilidad a cualquier dispositivo.

💻 Tecnologías Instaladas y Usadas
El proyecto utiliza un stack de desarrollo moderno y eficiente.

Categoría	Tecnología	Propósito
Núcleo	React (con Hooks)	Biblioteca principal para construir la UI.
Lenguaje	TypeScript (TS)	Añade tipado estático, reduciendo errores y mejorando la escalabilidad del código.
Bundler/Dev	Vite	Herramienta de construcción rápida para el entorno de desarrollo.
Estilos	Tailwind CSS	Framework CSS de utilidad para diseño rápido y modular.
API/HTTP	Axios	Cliente HTTP basado en promesas para realizar solicitudes al backend.
Rutas	React Router DOM	Manejo de la navegación y las URL en la aplicación.
Iconografía	Lucide React	Librería de íconos vectoriales modernos y ligeros.

Configuración Específica de TypeScript
Se ha habilitado verbatimModuleSyntax o similar en el tsconfig.json, lo que requiere el uso de type-only imports para tipos como ReactNode y FormEvent.

Ejemplo de Importación: import React, { type ReactNode } from 'react';

🎨 Temas y Diseño (Composición de Componentes)
El proyecto utiliza un enfoque avanzado para los temas llamado Composición de Componentes Condicional, lo que permite cambiar el diseño completo de una sección sin afectar la lógica.

1. Variables y Paletas CSS
Todos los colores se definen mediante variables CSS en base.css y se referencian en tailwind.config.js, permitiendo a Tailwind generar utilidades como bg-primary, text-gold, etc.

Tema	Paleta	Paleta Principal	Descripción del Estilo
Original	--primary: Naranja	Clásico Deportivo	Diseño robusto, limpio y con colores cálidos. El NavbarOriginal tiene un layout simple y botones con sombra definida.
Futurista	--primary: Cian Brillante	Cyberpunk / Neón	Diseño oscuro con efectos de transparencia (backdrop-blur-md), bordes sutiles y texto con animación animate-neon para un look tecnológico y moderno.

Exportar a Hojas de cálculo

2. Arquitectura de Temas
La Navbar es el primer componente en usar este patrón:

Navbar.tsx (Selector): Es el componente raíz. Maneja la lógica (useState para Modales) y usa el hook useTheme() para decidir si renderizar <NavbarOriginal> o <NavbarFuturista>.

NavbarOriginal.tsx / NavbarFuturista.tsx (Diseños): Contienen el JSX y las clases de Tailwind específicas para cada tema. Reciben la lógica de control (handlers como setIsLoginModalOpen) a través de las props.

📁 Estructura de Carpetas y Archivos
Ruta	Archivo/Directorio	Propósito y Contenido
src/		Directorio raíz del código fuente.
src/	App.tsx	Componente principal. Envuelve toda la aplicación con ThemeProvider y BrowserRouter.
src/api/	axiosInstance.ts	Instancia base de Axios configurada (p. ej., con la URL del backend).
src/api/	userApi.ts	Funciones de la API de usuario. Contiene registerUser(params), que usa POST /api/users.
src/components/	Modal.tsx	Componente reutilizable para pop-ups. Implementa el overlay oscuro y la función onClose.
src/components/	Navbar.tsx	Selector de Temas y gestor de estado de Modales (Registro/Login).
src/components/auth/	RegisterForm.tsx	Formulario de registro. Maneja formData, validación básica, estado de carga, y la llamada a registerUser.
src/components/temas/	Original/	Contiene los componentes de diseño para el Tema Original (ej. NavbarOriginal.tsx).
src/components/temas/	Futurista/	Contiene los componentes de diseño para el Tema Futurista (ej. NavbarFuturista.tsx).
src/contexts/	ThemeContext.tsx	Provee el estado theme y la función toggleTheme. Aplica las variables CSS al document.body vía JavaScript.
src/styles/	base.css	Archivo CSS principal. Contiene las directivas @import "tailwindcss";, las definiciones de variables CSS (--primary, etc.) y las clases de tema (.theme-original, .theme-futurista).
src/types/	User.ts	Definiciones de interfaces (User, RegisterUserParams).
./	tailwind.config.js	Configuración de Tailwind. Extiende la sección colors para mapear utilidades a variables CSS (primary: 'var(--primary)').

Flujo de Funcionalidad Implementada (Registro)
El usuario hace clic en Registrarse en la Navbar.

Navbar.tsx llama a setIsRegisterModalOpen(true).

El componente Modal se renderiza, mostrando el RegisterForm.

El usuario llena los campos y presiona Registrarme.

RegisterForm.tsx llama a registerUser(formData) usando Axios.

registerUser hace un POST a /api/users en el backend.

Al recibir un éxito (201 Created), RegisterForm llama a la prop onSuccess().

handleRegisterSuccess en Navbar.tsx se ejecuta, cerrando el modal de Registro y abriendo inmediatamente el modal de Login (setIsLoginModalOpen(true)).

💻 Estructura de Carpetas del Backend (Node/Express/Prisma)
Esta estructura sigue el patrón de Arquitectura Modular o de Capas, que separa claramente las responsabilidades (rutas, lógica de negocio, y acceso a datos).

Directorio Principal: /roshi_fit_club_backend
Ruta	Archivo/Directorio	Propósito y Contenido
/	package.json	Define dependencias (Express, Prisma, bcrypt, jsonwebtoken, typescript, ts-node).
/	tsconfig.json	Configuración de TypeScript para compilar el código a JavaScript (/dist).
/	server.ts	Archivo de arranque principal. Inicializa Express, aplica middleware y monta las rutas principales.
/	.env	Variables de entorno (puerto, URL de la base de datos, JWT_SECRET).
/	prisma/	Directorio para archivos de Prisma.
prisma/	schema.prisma	Define el esquema de la base de datos (tablas User, Plan, etc.) y las credenciales de conexión.
/src		Código fuente de la aplicación.
src/	app.ts	Configura y exporta la instancia de Express (sin iniciar el servidor).
src/controllers/		Contiene la lógica que maneja las solicitudes y respuestas HTTP.
src/controllers/	userController.ts	Lógica para usuarios (ej. getAllUsers).
src/controllers/	authController.ts	Lógica que necesitamos ahora: loginUser, registerUser.
src/routes/		Define los endpoints de la API y los mapea a los controllers.
src/routes/	userRoutes.ts	Define la ruta: POST /api/users (Registro).
src/routes/	authRoutes.ts	Ruta clave que necesitamos: POST /api/auth/login.
src/services/		Lógica de negocio pura (procesamiento de datos, hashing de contraseñas, generación de tokens).
src/services/	authService.ts	Contiene funciones como verifyPassword, generateToken, y createUser.
src/middleware/		Funciones que se ejecutan antes del controller (ej. validación, seguridad, autenticación).
src/middleware/	authMiddleware.ts	Función protect para verificar el JWT en rutas protegidas.
src/utils/		Funciones de utilidad (ej. validadores, manejadores de errores).

¡Tienes toda la razón! El README que te proporcioné se centró únicamente en el frontend de Roshi Fit Club. Para avanzar con la autenticación (Login), necesitamos definir y documentar la estructura de tu Backend basado en Node.js/Express, que es donde se generará el JWT.

Aquí tienes la sección de estructura de carpetas y archivos para el backend, asumiendo que utilizas Node.js, Express, TypeScript, Prisma (como ORM) y JWT para la autenticación.

💻 Estructura de Carpetas del Backend (Node/Express/Prisma)
Esta estructura sigue el patrón de Arquitectura Modular o de Capas, que separa claramente las responsabilidades (rutas, lógica de negocio, y acceso a datos).

Directorio Principal: /roshi_fit_club_backend
Ruta	Archivo/Directorio	Propósito y Contenido
/	package.json	Define dependencias (Express, Prisma, bcrypt, jsonwebtoken, typescript, ts-node).
/	tsconfig.json	Configuración de TypeScript para compilar el código a JavaScript (/dist).
/	server.ts	Archivo de arranque principal. Inicializa Express, aplica middleware y monta las rutas principales.
/	.env	Variables de entorno (puerto, URL de la base de datos, JWT_SECRET).
/	prisma/	Directorio para archivos de Prisma.
prisma/	schema.prisma	Define el esquema de la base de datos (tablas User, Plan, etc.) y las credenciales de conexión.
/src		Código fuente de la aplicación.
src/	app.ts	Configura y exporta la instancia de Express (sin iniciar el servidor).
src/controllers/		Contiene la lógica que maneja las solicitudes y respuestas HTTP.
src/controllers/	userController.ts	Lógica para usuarios (ej. getAllUsers).
src/controllers/	authController.ts	Lógica que necesitamos ahora: loginUser, registerUser.
src/routes/		Define los endpoints de la API y los mapea a los controllers.
src/routes/	userRoutes.ts	Define la ruta: POST /api/users (Registro).
src/routes/	authRoutes.ts	Ruta clave que necesitamos: POST /api/auth/login.
src/services/		Lógica de negocio pura (procesamiento de datos, hashing de contraseñas, generación de tokens).
src/services/	authService.ts	Contiene funciones como verifyPassword, generateToken, y createUser.
src/middleware/		Funciones que se ejecutan antes del controller (ej. validación, seguridad, autenticación).
src/middleware/	authMiddleware.ts	Función protect para verificar el JWT en rutas protegidas.
src/utils/		Funciones de utilidad (ej. validadores, manejadores de errores).

Exportar a Hojas de cálculo
🔑 Enfoque en la Autenticación (Login)
Para implementar el Login, nos centraremos en tres archivos clave dentro de tu backend:

1. src/routes/authRoutes.ts
Define la ruta:

TypeScript

router.post('/login', authController.loginUser);
2. src/controllers/authController.ts
Recibe email y password del cuerpo de la solicitud y llama al servicio. Si tiene éxito, devuelve un token.

TypeScript

// authController.ts
export const loginUser = async (req: Request, res: Response) => {
    // 1. Llama al authService.login()
    // 2. Si es exitoso, devuelve el token JWT
    res.json({ token: '...' }); 
};
3. src/services/authService.ts
Contiene la lógica pesada:

Busca el usuario en Prisma.

Compara la contraseña con bcrypt.

Genera el token JWT si las credenciales son válidas.