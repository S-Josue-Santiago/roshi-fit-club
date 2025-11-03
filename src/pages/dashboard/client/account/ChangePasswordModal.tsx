// roshi_fit/src/pages/dashboard/client/account/ChangePasswordModal.tsx
import React, { useState, useEffect } from 'react';
import { changeUserPassword } from '../../../../api/userApi';
import { Lock, Eye, EyeOff, X, AlertCircle, CheckCircle, Shield } from 'lucide-react';

interface ChangePasswordModalProps {
  userId: number;
  onClose: () => void;
}

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

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ userId, onClose }) => {
  const theme = useDashboardThemeDetection();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword(userId, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        overlay: 'bg-black/40',
        modal: 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-300',
        modalShadow: '0 25px 50px rgba(74, 144, 226, 0.25)',
        header: 'border-slate-300',
        headerTitle: 'text-gray-900',
        headerIcon: 'bg-blue-100 text-blue-600',
        closeButton: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
        input: 'bg-white text-gray-900 border-slate-300 focus:border-blue-500',
        inputIcon: 'text-blue-500',
        eyeButton: 'text-gray-600 hover:text-blue-600',
        cancelButton: 'bg-white border-slate-300 text-gray-700 hover:bg-slate-100',
        submitButton: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
        submitButtonShadow: '0 8px 20px rgba(74, 144, 226, 0.4)',
        errorContainer: 'bg-red-50 border-red-300 text-red-700',
        successContainer: 'bg-green-50 border-green-300 text-green-700',
        passwordStrength: {
          weak: 'bg-red-100 text-red-700',
          medium: 'bg-yellow-100 text-yellow-700',
          strong: 'bg-green-100 text-green-700'
        }
      };
    }
    
    // Tema Nocturno
    return {
      overlay: 'bg-black/60',
      modal: 'bg-gradient-to-br from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-purple-500/30',
      modalShadow: '0 25px 50px rgba(138, 43, 226, 0.3)',
      header: 'border-purple-500/30',
      headerTitle: 'text-white',
      headerIcon: 'bg-purple-900/30 text-[#FFD700]',
      closeButton: 'text-white hover:text-red-400 hover:bg-red-500/20',
      input: 'bg-[#0A0E27] text-white border-purple-500/30 focus:border-[#FFD700]',
      inputIcon: 'text-[#FFD700]',
      eyeButton: 'text-[#B0BEC5] hover:text-[#FFD700]',
      cancelButton: 'bg-[#16213E] border-purple-500/30 text-white hover:bg-[#1A1A2E]',
      submitButton: 'bg-gradient-to-r from-purple-900 to-purple-700 text-white hover:from-purple-800 hover:to-purple-600',
      submitButtonShadow: '0 8px 20px rgba(138, 43, 226, 0.5)',
      errorContainer: 'bg-red-900/20 border-red-500/40 text-red-300',
      successContainer: 'bg-green-500/20 border-green-500 text-green-400',
      passwordStrength: {
        weak: 'bg-red-500/20 text-red-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
        strong: 'bg-green-500/20 text-green-400'
      }
    };
  };

  const styles = getStyles();

  // Verificar fortaleza de contraseña
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const strengthText = {
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte'
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${styles.overlay} backdrop-blur-md`}
      onClick={onClose}
    >
      <div 
        className={`${styles.modal} p-6 md:p-8 rounded-3xl w-full max-w-md border-2 animate-slideUp`}
        style={{ boxShadow: styles.modalShadow }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center mb-6 pb-4 border-b-2 ${styles.header}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${styles.headerIcon}`}>
              <Shield size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${styles.headerTitle}`}>Cambiar Contraseña</h2>
              <p className={`text-xs ${theme === 'amanecer' ? 'text-gray-600' : 'text-[#B0BEC5]'} mt-0.5`}>
                Actualiza tu contraseña de seguridad
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 ${styles.closeButton}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${styles.errorContainer} mb-4`}>
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${styles.successContainer} mb-4`}>
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="font-semibold">✨ Contraseña actualizada correctamente</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contraseña actual */}
          <div>
            <label htmlFor="currentPassword" className={`block text-sm font-bold mb-2 ${theme === 'amanecer' ? 'text-gray-700' : 'text-white'}`}>
              Contraseña Actual
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.inputIcon}`} size={20} />
              <input
                type={showCurrent ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                placeholder="Ingresa tu contraseña actual"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                style={{ 
                  boxShadow: theme === 'amanecer' 
                    ? 'inset -2px -2px 4px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    : 'inset -2px -2px 4px rgba(20, 20, 20, 0.8), inset 2px 2px 4px rgba(60, 60, 60, 0.3)' 
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${styles.eyeButton}`}
              >
                {showCurrent ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label htmlFor="newPassword" className={`block text-sm font-bold mb-2 ${theme === 'amanecer' ? 'text-gray-700' : 'text-white'}`}>
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.inputIcon}`} size={20} />
              <input
                type={showNew ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                placeholder="Mínimo 6 caracteres"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                style={{ 
                  boxShadow: theme === 'amanecer' 
                    ? 'inset -2px -2px 4px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    : 'inset -2px -2px 4px rgba(20, 20, 20, 0.8), inset 2px 2px 4px rgba(60, 60, 60, 0.3)' 
                }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${styles.eyeButton}`}
              >
                {showNew ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {/* Indicador de fortaleza */}
            {passwordStrength && (
              <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-bold inline-block ${styles.passwordStrength[passwordStrength]}`}>
                Seguridad: {strengthText[passwordStrength]}
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-bold mb-2 ${theme === 'amanecer' ? 'text-gray-700' : 'text-white'}`}>
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.inputIcon}`} size={20} />
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite la nueva contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                style={{ 
                  boxShadow: theme === 'amanecer' 
                    ? 'inset -2px -2px 4px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(0, 0, 0, 0.1)' 
                    : 'inset -2px -2px 4px rgba(20, 20, 20, 0.8), inset 2px 2px 4px rgba(60, 60, 60, 0.3)' 
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${styles.eyeButton}`}
              >
                {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl font-bold border-2 transition-all duration-300 transform hover:scale-105 ${styles.cancelButton}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className={`flex-1 px-6 py-3 rounded-xl font-black border-2 border-transparent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${styles.submitButton}`}
              style={{ boxShadow: styles.submitButtonShadow }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span>
                  Cambiando...
                </span>
              ) : success ? (
                '✓ Completado'
              ) : (
                'Cambiar Contraseña'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordModal;