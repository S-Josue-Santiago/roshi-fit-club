// roshi_fit/src/pages/dashboard/client/account/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { changeUserPassword } from '../../../../api/userApi';

interface ChangePasswordModalProps {
  userId: number;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ userId, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Cambiar Contraseña</h2>
          <button
            onClick={onClose}
            className="text-dashboard-text hover:text-dashboard-primary text-2xl"
          >
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-800/50 text-green-200 p-2 rounded mb-4">✅ Contraseña actualizada.</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              placeholder="Contraseña actual"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-2 top-2 text-dashboard-text"
            >
              {showCurrent ? '👁️' : '🙈'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              placeholder="Nueva contraseña"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-2 top-2 text-dashboard-text"
            >
              {showNew ? '👁️' : '🙈'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar nueva contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-2 text-dashboard-text"
            >
              {showConfirm ? '👁️' : '🙈'}
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;