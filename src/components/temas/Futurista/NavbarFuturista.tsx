// roshi_fit/src/components/temas/Futurista/NavbarFuturista.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Sun, Menu, X } from 'lucide-react';
import { type NavbarThemeProps } from '../../Navbar'; 

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

const NavbarFuturista: React.FC<NavbarThemeProps> = ({
  setIsLoginModalOpen,
  setIsRegisterModalOpen,
  toggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleNavClick = () => setIsMenuOpen(false);

  return (
    <header 
      className="fixed top-0 w-full z-50 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.92))',
        boxShadow: '0 8px 32px rgba(0, 120, 255, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05)',
        borderBottom: '2px solid rgba(0, 120, 255, 0.15)'
      }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-3xl md:text-4xl font-black tracking-widest transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 15px rgba(0, 120, 255, 0.3))',
            letterSpacing: '0.15em'
          }}
        >
          ROSHI
        </Link>

        {/* Navegación (Desktop) */}
        <nav className="hidden lg:flex space-x-1 xl:space-x-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-all duration-300 group"
            >
              <span className="relative z-10">{item.name}</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 120, 255, 0.08), rgba(0, 212, 255, 0.08))'
                }}
              ></div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300 rounded-full"></div>
            </a>
          ))}
        </nav>

        {/* Botones de Acción (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Iniciar Sesión */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 font-bold text-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
            style={{
              background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
              boxShadow: '-6px -6px 12px rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 120, 255, 0.15)',
              border: '2px solid rgba(0, 120, 255, 0.2)'
            }}
          >
            <LogIn size={18} />
            <span>Conectar</span>
          </button>

          {/* Registrarse */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 font-black text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
              boxShadow: '0 6px 20px rgba(0, 120, 255, 0.4), -4px -4px 10px rgba(0, 212, 255, 0.2), 4px 4px 10px rgba(0, 120, 255, 0.5)'
            }}
          >
            <UserPlus size={18} />
            <span>Registro</span>
          </button>

          {/* Cambio de tema */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-all duration-300 text-yellow-500 hover:text-yellow-600 transform hover:rotate-180"
            style={{
              background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
              boxShadow: '-4px -4px 8px rgba(255, 255, 255, 0.8), 4px 4px 8px rgba(0, 120, 255, 0.12)'
            }}
            title="Cambiar a Tema Original"
          >
            <Sun size={20} />
          </button>
        </div>

        {/* Botones Móvil (Tablet y Mobile) */}
        <div className="flex lg:hidden items-center space-x-2">
          {/* Cambio de tema (Móvil) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300 text-yellow-500"
            style={{
              background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
              boxShadow: '-3px -3px 6px rgba(255, 255, 255, 0.8), 3px 3px 6px rgba(0, 120, 255, 0.12)'
            }}
            title="Cambiar tema"
          >
            <Sun size={18} />
          </button>

          {/* Menú Hamburguesa */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-xl transition-all duration-300 text-blue-600 hover:text-blue-700"
            style={{
              background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
              boxShadow: '-4px -4px 8px rgba(255, 255, 255, 0.8), 4px 4px 8px rgba(0, 120, 255, 0.15)',
              border: '2px solid rgba(0, 120, 255, 0.2)'
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
          background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.95))',
          boxShadow: 'inset 0 4px 12px rgba(0, 120, 255, 0.08)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col space-y-2">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2"
              style={{
                background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.7), rgba(240, 244, 248, 0.7))',
                boxShadow: '-3px -3px 6px rgba(255, 255, 255, 0.6), 3px 3px 6px rgba(0, 120, 255, 0.1)',
                border: '1px solid rgba(0, 120, 255, 0.1)',
                animationDelay: `${index * 0.05}s`,
                animation: isMenuOpen ? 'slideInLight 0.3s ease-out forwards' : 'none'
              }}
            >
              {item.name}
            </a>
          ))}

          {/* Botones de Acción en Menú Móvil */}
          <div className="pt-4 space-y-3 border-t-2 border-blue-200">
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                handleNavClick();
              }}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-blue-600 transition-all duration-300"
              style={{
                background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
                boxShadow: '-4px -4px 8px rgba(255, 255, 255, 0.8), 4px 4px 8px rgba(0, 120, 255, 0.15)',
                border: '2px solid rgba(0, 120, 255, 0.2)'
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
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-black text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
                boxShadow: '0 6px 20px rgba(0, 120, 255, 0.4), -4px -4px 10px rgba(0, 212, 255, 0.2), 4px 4px 10px rgba(0, 120, 255, 0.5)'
              }}
            >
              <UserPlus size={18} />
              <span>Registrarse</span>
            </button>
          </div>
        </nav>
      </div>

      <style>{`
        @keyframes slideInLight {
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

export default NavbarFuturista;