// roshi_fit/src/components/Navbar.tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Modal from './Modal';
import NavbarOriginal from './temas/Original/NavbarOriginal';
import NavbarFuturista from './temas/Futurista/NavbarFuturista';
import LoginForm from './auth/LoginForm';
import RegisterFormWithPayment from './auth/RegisterFormWithPayment';

export interface NavbarThemeProps {
  setIsRegisterModalOpen: (isOpen: boolean) => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
}

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    window.location.href = '/dashboard/cliente';
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    window.location.reload();
  };

  const modalProps: NavbarThemeProps = {
    setIsRegisterModalOpen,
    setIsLoginModalOpen,
    toggleTheme,
  };

  const NavbarComponent = theme === 'futurista' ? NavbarFuturista : NavbarOriginal;
  const modalTitle = theme === 'futurista' ? 'Autorización Ciber-Dojo' : 'Ingreso al Dojo Clásico';

  return (
    <>
      <NavbarComponent {...modalProps} />

      {/* Modal de Registro (UNIFICADO) */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Registro Completo"
      >
        <RegisterFormWithPayment
          onRegisterSuccess={handleRegisterSuccess}
          onGoToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </Modal>

      {/* Modal de Login */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title={`Ingreso: ${modalTitle}`}
      >
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </Modal>
    </>
  );
};

export default Navbar;