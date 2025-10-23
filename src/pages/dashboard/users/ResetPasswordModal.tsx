// roshi_fit/src/pages/dashboard/users/ResetPasswordModal.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, X, Save, Lock, Key } from 'lucide-react';
import { resetUserPassword } from '../../../api/userApi';

interface ResetPasswordModalProps {
  userId: number;
  onClose: () => void;
  onPasswordReset: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ userId, onClose, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await resetUserPassword(userId, formData.newPassword);
      setSuccess(true);
      setTimeout(() => {
        onPasswordReset();
        onClose();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al restablecer la contraseña.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-dashboard-accent/95 p-6 rounded-2xl shadow-2xl w-full max-w-md border-2 border-dashboard-accent/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Lock size={24} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">RESTABLECER CONTRASEÑA</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-600/20 border border-green-500/50 text-green-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            ✅ Contraseña actualizada correctamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nueva Contraseña */}
          <div>
            <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Key size={16} className="text-purple-400" />
              NUEVA CONTRASEÑA
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="
                  w-full p-4 pr-12 bg-dashboard-bg text-dashboard-text 
                  rounded-xl border-2 border-dashboard-accent/50
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                  hover:border-purple-400/50 transition-all duration-300
                  placeholder:text-dashboard-text-secondary/50
                "
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="
                  absolute right-3 top-1/2 transform -translate-y-1/2
                  text-dashboard-text-secondary hover:text-purple-400
                  p-1 rounded-lg transition-all duration-300
                  hover:bg-purple-400/10
                "
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Key size={16} className="text-purple-400" />
              CONFIRMAR CONTRASEÑA
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="
                  w-full p-4 pr-12 bg-dashboard-bg text-dashboard-text 
                  rounded-xl border-2 border-dashboard-accent/50
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                  hover:border-purple-400/50 transition-all duration-300
                  placeholder:text-dashboard-text-secondary/50
                "
                placeholder="Repite la contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="
                  absolute right-3 top-1/2 transform -translate-y-1/2
                  text-dashboard-text-secondary hover:text-purple-400
                  p-1 rounded-lg transition-all duration-300
                  hover:bg-purple-400/10
                "
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashboard-accent/50">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 px-6 py-3 text-dashboard-text font-bold
                border-2 border-dashboard-accent/50 rounded-xl
                hover:border-red-400 hover:text-red-400 hover:bg-red-400/10
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2
              "
            >
              <X size={18} />
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="
                flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 
                text-white font-bold rounded-xl 
                hover:from-purple-700 hover:to-purple-800
                disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  GUARDANDO...
                </>
              ) : success ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  ¡ÉXITO!
                </>
              ) : (
                <>
                  <Save size={18} />
                  GUARDAR
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;