import React, { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean; // Controla si el modal está visible
  onClose: () => void; // Función para cerrar el modal
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // 1. Fondo Oscuro (Overlay)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      
      {/* 2. Contenedor del Modal */}
      <div 
        className="bg-secondary p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 border border-accent"
        onClick={(e) => e.stopPropagation()} // Detiene la propagación para que el clic dentro no cierre el modal
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6 border-b border-accent pb-3">
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-text-light hover:text-gold transition-colors text-3xl leading-none"
            aria-label="Cerrar Modal"
          >
            &times;
          </button>
        </div>

        {/* Contenido (Formulario) */}
        <div className="text-text-light">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;