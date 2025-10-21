// roshi_fit/src/components/temas/Original/NavbarOriginal.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Moon } from 'lucide-react';
import { type NavbarThemeProps } from '../../Navbar';

// Lista de secciones para el menú de scroll
const navItems = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Planes', href: '#planes' },
  { name: 'Horarios', href: '#horarios' },
  { name: 'Productos', href: '#productos' },
  { name: 'Equipos', href: '#equipos' },
  { name: 'Galería', href: '#galeria' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Contacto', href: '#contacto' },
];

const NavbarOriginal: React.FC<NavbarThemeProps> = ({
  setIsLoginModalOpen,
  setIsRegisterModalOpen,
  toggleTheme,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 shadow-xl bg-secondary">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary transition-colors">
          Roshi Fit Club
        </Link>

        {/* Navegación (Desktop) */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="font-medium text-text-light hover:text-gold transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Botones de Acción */}
        <div className="flex items-center space-x-3">
          {/* Iniciar Sesión */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="hidden sm:flex items-center space-x-1 p-2 rounded-lg bg-accent hover:bg-gold transition-colors text-text-light font-semibold shadow-md"
          >
            <LogIn size={18} />
            <span>Ingresar</span>
          </button>

          {/* Registrarse */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="hidden sm:flex items-center space-x-1 p-2 rounded-lg bg-primary hover:bg-gold transition-colors text-text-light font-semibold shadow-lg"
          >
            <UserPlus size={18} />
            <span>Registrarse</span>
          </button>

          {/* Menú hamburguesa para móvil (opcional, por ahora omitido) */}

          {/* Cambio de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all text-gold hover:bg-primary/50"
            title="Cambiar a Tema Futurista"
          >
            <Moon size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarOriginal;