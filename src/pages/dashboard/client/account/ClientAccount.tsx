// roshi_fit/src/pages/dashboard/client/account/ClientAccount.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditAccountModal from './EditAccountModal';
import ChangePasswordModal from './ChangePasswordModal';
import ClientPurchaseHistory from './ClientPurchaseHistory';
import ClientTestimonials from './ClientTestimonials';
import { fetchUserProfile } from '../../../../api/userApi';
import { 
  User, Mail, Phone, Calendar, MapPin, User2, 
  Edit, Lock, Camera, Check, AlertCircle 
} from 'lucide-react';

const AVATARS = [
  'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg',
  'avatar4.jpg', 'avatar5.jpg', 'avatar6.jpg'
];

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const ClientAccount: React.FC = () => {
  const theme = useDashboardThemeDetection();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'history' | 'testimonials'>('account');
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

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        container: 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-300',
        containerShadow: '0 20px 40px rgba(74, 144, 226, 0.15)',
        title: 'text-gray-900',
        avatarBorder: 'border-blue-500',
        avatarBg: 'bg-gradient-to-br from-blue-500 to-purple-600',
        avatarOverlay: 'bg-gradient-to-t from-black/60 to-transparent',
        userName: 'text-gray-900',
        userEmail: 'text-gray-600',
        infoCard: 'bg-white border-slate-200',
        infoLabel: 'text-gray-600',
        infoValue: 'text-gray-900',
        infoIcon: 'text-blue-500',
        editButton: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
        editButtonShadow: '0 8px 20px rgba(74, 144, 226, 0.4)',
        passwordButton: 'bg-white border-slate-300 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-400 hover:text-purple-600',
        loadingText: 'text-gray-600',
        errorContainer: 'bg-red-50 border-red-300 text-red-700',
        badge: 'bg-green-100 text-green-700 border-green-400',
        tabInactive: 'text-gray-600 hover:text-gray-900 border-transparent',
        activeItem: 'text-white border-blue-500'
      };
    }
    
    // Tema Nocturno
    return {
      container: 'bg-gradient-to-br from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-purple-500/30',
      containerShadow: '0 20px 40px rgba(138, 43, 226, 0.3)',
      title: 'text-white',
      avatarBorder: 'border-[#FFD700]',
      avatarBg: 'bg-gradient-to-br from-purple-900 to-purple-700',
      avatarOverlay: 'bg-gradient-to-t from-black/80 to-transparent',
      userName: 'text-white',
      userEmail: 'text-[#B0BEC5]',
      infoCard: 'bg-[#16213E]/50 border-purple-500/20',
      infoLabel: 'text-[#B0BEC5]',
      infoValue: 'text-white',
      infoIcon: 'text-[#FFD700]',
      editButton: 'bg-gradient-to-r from-purple-900 to-purple-700 text-white hover:from-purple-800 hover:to-purple-600',
      editButtonShadow: '0 8px 20px rgba(138, 43, 226, 0.5)',
      passwordButton: 'bg-[#16213E] border-purple-500/30 text-white hover:bg-purple-900 hover:border-[#FFD700] hover:text-[#FFD700]',
      loadingText: 'text-[#B0BEC5]',
      errorContainer: 'bg-red-900/20 border-red-500/40 text-red-300',
      badge: 'bg-green-500/20 text-green-400 border-green-500',
      tabInactive: 'text-[#B0BEC5] hover:text-white border-transparent',
      activeItem: 'text-white border-[#FFD700]'
    };
  };

  const styles = getStyles();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" 
             style={{ borderColor: theme === 'amanecer' ? '#3b82f6' : '#8b5cf6', borderTopColor: 'transparent' }}></div>
        <p className={`mt-4 ${styles.loadingText} font-semibold`}>Cargando cuenta...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${styles.errorContainer}`}>
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <p className="font-semibold">Usuario no encontrado.</p>
      </div>
    );
  }

  const infoItems = [
    { icon: User, label: 'Nombre Completo', value: user.nombre_completo },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Teléfono', value: user.telefono || '—' },
    { icon: Calendar, label: 'Fecha de Nacimiento', value: user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-GT') : '—' },
    { icon: User2, label: 'Género', value: getGenderText(user.genero) },
    { icon: MapPin, label: 'Dirección', value: user.direccion || '—' },
  ];

  return (
    <div 
      className={`${styles.container} p-6 md:p-8 rounded-3xl border-2 max-w-6xl mx-auto`}
      style={{ boxShadow: styles.containerShadow }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-3xl font-black ${styles.title}`}>Mi Cuenta</h2>
        <div className={`px-4 py-2 rounded-xl border-2 ${styles.badge} font-bold text-sm flex items-center gap-2`}>
          <Check size={16} />
          Perfil Activo
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-dashboard-accent/50 mb-6">
        <button
          className={`px-6 py-3 font-bold ${activeTab === 'account' ? styles.activeItem : styles.tabInactive} border-b-2`}
          onClick={() => setActiveTab('account')}
        >
          Cuenta
        </button>
        <button
          className={`px-6 py-3 font-bold ${activeTab === 'history' ? styles.activeItem : styles.tabInactive} border-b-2`}
          onClick={() => setActiveTab('history')}
        >
          Historial de Compras
        </button>
        <button
          className={`px-6 py-3 font-bold ${activeTab === 'testimonials' ? styles.activeItem : styles.tabInactive} border-b-2`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonios
        </button>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === 'account' ? (
        <>
          {/* Foto de perfil y nombre */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 rounded-2xl" style={{ background: theme === 'amanecer' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(124, 58, 237, 0.05))' : 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(22, 33, 62, 0.5))' }}>
            <div className="relative group">
              <div className={`w-32 h-32 ${styles.avatarBg} rounded-2xl p-1 shadow-2xl`}>
                <img
                  src={getAvatarUrl(user.foto_perfil)}
                  alt="Foto de perfil"
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div className={`absolute inset-0 rounded-2xl ${styles.avatarOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                <Camera size={32} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className={`text-2xl md:text-3xl font-black ${styles.userName} mb-2`}>
                {user.nombre_completo}
              </h3>
              <p className={`${styles.userEmail} text-sm md:text-base font-semibold flex items-center justify-center md:justify-start gap-2`}>
                <Mail size={16} />
                {user.email}
              </p>
            </div>
          </div>

          {/* Información de cuenta en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className={`${styles.infoCard} p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${theme === 'amanecer' ? 'bg-blue-50' : 'bg-purple-900/30'}`}>
                      <Icon size={20} className={styles.infoIcon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${styles.infoLabel} mb-1`}>
                        {item.label}
                      </p>
                      <p className={`font-bold ${styles.infoValue} truncate`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-4 
                rounded-2xl font-black text-lg
                ${styles.editButton}
                transition-all duration-300 transform hover:scale-105
                border-2 border-transparent
              `}
              style={{ boxShadow: styles.editButtonShadow }}
            >
              <Edit size={20} />
              Editar Perfil
            </button>
            
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-4 
                rounded-2xl font-bold text-lg border-2
                ${styles.passwordButton}
                transition-all duration-300 transform hover:scale-105
              `}
            >
              <Lock size={20} />
              Cambiar Contraseña
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
        </>
      ) : activeTab === 'history' ? (
        <ClientPurchaseHistory />
      ) : (
        <ClientTestimonials />
      )}
    </div>
  );
};

export default ClientAccount;