// roshi_fit/src/components/temas/Original/NavbarOriginal.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Moon, Menu, X } from 'lucide-react';
import { type NavbarThemeProps } from '../../Navbar';

// Lista de secciones para el menú de scroll
const navItems = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Planes', href: '#planes' },
  { name: 'Productos', href: '#productos' },
  { name: 'Equipos', href: '#equipos' },
  { name: 'Galería', href: '#galeria' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Horarios', href: '#horarios' },
  { name: 'Filosofía', href: '#filosofia' },
  { name: 'Contacto', href: '#contacto' },
];

const NavbarOriginal: React.FC<NavbarThemeProps> = ({
  setIsLoginModalOpen,
  setIsRegisterModalOpen,
  toggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className="fixed top-0 w-full z-50 backdrop-blur-lg"
      style={{
        background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.95), rgba(30, 30, 30, 0.9))',
        boxShadow: '0 8px 32px rgba(255, 107, 53, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 107, 53, 0.2)'
      }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl md:text-3xl font-black text-transparent bg-clip-text  from-primary via-orange-400 to-yellow-500 transition-all duration-300 hover:scale-105"
          style={{ 
            textShadow: '0 0 5px rgba(255, 107, 53, 0.9)',
            letterSpacing: '0.05em'
          }}
        >
          Roshi Fit Club
        </Link>

        {/* Navegación (Desktop) */}
        <nav className="hidden lg:flex space-x-1 xl:space-x-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 font-semibold text-gray-300 hover:text-primary transition-all duration-300 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5  from-primary to-orange-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Botones de Acción (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Iniciar Sesión */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(45, 45, 68, 0.8), rgba(60, 60, 80, 0.8))',
              boxShadow: '-4px -4px 8px rgba(20, 20, 20, 0.5), 4px 4px 8px rgba(80, 80, 80, 0.3)',
              border: '1px solid rgba(255, 107, 53, 0.2)'
            }}
          >
            <LogIn size={18} />
            <span>Ingresar</span>
          </button>

          {/* Registrarse */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4), -4px -4px 8px rgba(255, 140, 66, 0.2), 4px 4px 8px rgba(255, 107, 53, 0.5)'
            }}
          >
            <UserPlus size={18} />
            <span>Registrarse</span>
          </button>

          {/* Cambio de tema */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-all duration-300 text-orange-400 hover:text-primary transform hover:rotate-180"
            style={{
              background: 'linear-gradient(135deg, rgba(45, 45, 68, 0.6), rgba(60, 60, 80, 0.6))',
              boxShadow: '-4px -4px 8px rgba(20, 20, 20, 0.5), 4px 4px 8px rgba(80, 80, 80, 0.3)'
            }}
            title="Cambiar a Tema Futurista"
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Botones Móvil (Tablet y Mobile) */}
        <div className="flex lg:hidden items-center space-x-2">
          {/* Cambio de tema (Móvil) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300 text-orange-400 hover:text-primary"
            style={{
              background: 'linear-gradient(135deg, rgba(45, 45, 68, 0.6), rgba(60, 60, 80, 0.6))',
              boxShadow: '-2px -2px 4px rgba(20, 20, 20, 0.5), 2px 2px 4px rgba(80, 80, 80, 0.3)'
            }}
            title="Cambiar tema"
          >
            <Moon size={18} />
          </button>

          {/* Menú Hamburguesa */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-xl transition-all duration-300 text-primary hover:text-orange-400"
            style={{
              background: 'linear-gradient(135deg, rgba(45, 45, 68, 0.8), rgba(60, 60, 80, 0.8))',
              boxShadow: '-4px -4px 8px rgba(20, 20, 20, 0.5), 4px 4px 8px rgba(80, 80, 80, 0.3)',
              border: '1px solid rgba(255, 107, 53, 0.3)'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(25, 25, 25, 0.98), rgba(20, 20, 20, 0.95))',
          boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col space-y-2">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className="px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-primary transition-all duration-300 transform hover:translate-x-2"
              style={{
                background: 'linear-gradient(135deg, rgba(35, 35, 35, 0.5), rgba(45, 45, 45, 0.5))',
                boxShadow: '-2px -2px 4px rgba(20, 20, 20, 0.5), 2px 2px 4px rgba(60, 60, 60, 0.3)',
                border: '1px solid rgba(255, 107, 53, 0.1)',
                animationDelay: `${index * 0.05}s`,
                animation: isMenuOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
              }}
            >
              {item.name}
            </a>
          ))}

          {/* Botones de Acción en Menú Móvil */}
          <div className="pt-4 space-y-3 border-t border-gray-700">
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                handleNavClick();
              }}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(45, 45, 68, 0.8), rgba(60, 60, 80, 0.8))',
                boxShadow: '-4px -4px 8px rgba(20, 20, 20, 0.5), 4px 4px 8px rgba(80, 80, 80, 0.3)',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}
            >
              <LogIn size={18} />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => {
                setIsRegisterModalOpen(true);
                handleNavClick();
              }}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4), -4px -4px 8px rgba(255, 140, 66, 0.2), 4px 4px 8px rgba(255, 107, 53, 0.5)'
              }}
            >
              <UserPlus size={18} />
              <span>Registrarse</span>
            </button>
          </div>
        </nav>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default NavbarOriginal;