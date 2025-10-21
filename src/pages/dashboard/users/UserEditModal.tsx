// roshi_fit/src/pages/dashboard/users/UserEditModal.tsx
import React, { useState } from 'react';
import { type User } from '../../../types/User';
import { updateUser } from '../../../api/userApi';

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_completo: user.nombre_completo,
    email: user.email,
    tipo_usuario: user.tipo_usuario,
    estado: user.estado,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateUser(user.id, formData);
      onSave(); // Recarga la lista
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el usuario.';
      setError(msg);
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
          <h2 className="text-xl font-bold text-dashboard-text">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="text-dashboard-text hover:text-dashboard-primary text-2xl"
          >
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Nombre Completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Rol</label>
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            >
              <option value="admin">Admin</option>
              <option value="entrenador">Entrenador</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="desabilitado">Deshabilitado</option>
            </select>
          </div>

          {/* Botones */}
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
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;