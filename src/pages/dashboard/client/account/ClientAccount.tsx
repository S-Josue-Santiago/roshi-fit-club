// roshi_fit/src/pages/dashboard/client/account/ClientAccount.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditAccountModal from './EditAccountModal';
import ChangePasswordModal from './ChangePasswordModal';
import { fetchUserProfile } from '../../../../api/userApi';

const AVATARS = [
  'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg',
  'avatar4.jpg', 'avatar5.jpg', 'avatar6.jpg'
];

const ClientAccount: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) {
          navigate('/');
          return;
        }

        const parsedUser = JSON.parse(userData);
        const fullProfile = await fetchUserProfile(parsedUser.id);
        
        localStorage.setItem('userData', JSON.stringify(fullProfile));
        setUser(fullProfile);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleUpdateSuccess = (updatedUser: any) => {
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return <p className="text-dashboard-text">Cargando cuenta...</p>;
  }

  if (!user) {
    return <p className="text-dashboard-text">Usuario no encontrado.</p>;
  }

  const getAvatarUrl = (filename: string | null) => {
    if (!filename) return '/assets/avatars/avatar1.jpg';
    if (AVATARS.includes(filename)) {
      return `/assets/avatars/${filename}`;
    }
    return `/assets/profiles/${filename}`;
  };

  const getGenderText = (gender: string | null) => {
    if (gender === 'masculino') return 'Masculino';
    if (gender === 'femenino') return 'Femenino';
    return 'Otro';
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent max-w-2xl">
      <h2 className="text-2xl font-bold text-dashboard-text mb-6">Mi Cuenta</h2>

      {/* Foto de perfil */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={getAvatarUrl(user.foto_perfil)}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full object-cover border-4 border-dashboard-primary mb-4"
        />
        <span className="text-dashboard-text">{user.nombre_completo}</span>
      </div>

      {/* Información de cuenta */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-dashboard-text-secondary">Nombre:</span>
          <span className="text-dashboard-text font-medium">{user.nombre_completo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dashboard-text-secondary">Email:</span>
          <span className="text-dashboard-text font-medium">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dashboard-text-secondary">Teléfono:</span>
          <span className="text-dashboard-text font-medium">{user.telefono || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dashboard-text-secondary">Fecha de nacimiento:</span>
          <span className="text-dashboard-text font-medium">
            {user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-GT') : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-dashboard-text-secondary">Género:</span>
          <span className="text-dashboard-text font-medium">{getGenderText(user.genero)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dashboard-text-secondary">Dirección:</span>
          <span className="text-dashboard-text font-medium">{user.direccion || '—'}</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
        >
          Actualizar
        </button>
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="px-4 py-2 bg-dashboard-secondary text-dashboard-bg font-semibold rounded hover:bg-dashboard-primary transition-colors"
        >
          Cambiar contraseña
        </button>
      </div>

      {/* Modales */}
      {isEditModalOpen && (
        <EditAccountModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal
          userId={user.id}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientAccount;