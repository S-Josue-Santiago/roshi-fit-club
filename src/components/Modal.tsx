import React, { type ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean; // Controla si el modal está visible
  onClose: () => void; // Función para cerrar el modal
  title: string;
  children: ReactNode;
}

// Hook para detectar el tema actual (se recomienda refactorizar a un archivo compartido si se usa mucho)
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      setTheme(bodyClass.includes('futurista') ? 'futurista' : 'original');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  const theme = useTheme();

  return (
    // 1. Fondo Oscuro (Overlay)
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={onClose}>
      
      {/* 2. Contenedor del Modal */}
      <div 
        className={`
          p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100
          ${theme === 'futurista' 
            ? 'bg-white border-blue-200 shadow-blue-100' 
            : 'bg-secondary border-accent shadow-lg'
          }
        `}
        onClick={(e) => e.stopPropagation()} // Detiene la propagación para que el clic dentro no cierre el modal
      >
        {/* Encabezado */}
        <div className={`flex justify-between items-center mb-6 border-b pb-3 ${theme === 'futurista' ? 'border-gray-200' : 'border-accent'}`}>
          <h2 className={`text-2xl font-bold ${theme === 'futurista' ? 'text-gray-800' : 'text-text-light'}`}>{title}</h2>
          <button 
            onClick={onClose} 
            className={`
              ${theme === 'futurista' ? 'text-gray-600 hover:text-gray-800' : 'text-text-light hover:text-gold'}
              transition-colors text-3xl leading-none
            `}
            aria-label="Cerrar Modal"
          >
            &times;
          </button>
        </div>

        {/* Contenido (Formulario) */}
        <div className={`${theme === 'futurista' ? 'text-gray-700' : 'text-text-light'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;