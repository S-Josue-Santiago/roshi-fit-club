// roshi_fit/src/pages/dashboard/users/UserEditModal.tsx
import React, { useState } from 'react';
import type { User } from '../../../types/User';
import { updateUser } from '../../../api/userApi';
import { X, Save, CircleUser, Mail, Shield, Activity } from 'lucide-react';

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
      onSave();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el usuario.';
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
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50 ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/20 rounded-lg">
              <CircleUser  size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR USUARIO</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <CircleUser  size={16} className="text-cyan-400" />
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              className="
                w-full p-4 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary/50
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Mail size={16} className="text-cyan-400" />
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                w-full p-4 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary/50
              "
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Shield size={16} className="text-cyan-400" />
              TIPO DE USUARIO
            </label>
            <select
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              className="
                w-full p-4 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                cursor-pointer bg-black
              "
            >
              <option value="admin">Administrador</option>
              <option value="entrenador">Entrenador</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              ESTADO DEL USUARIO
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="
                w-full p-4 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                cursor-pointer bg-black
              "
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="desabilitado">Deshabilitado</option>
            </select>
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
              disabled={loading}
              className="
                flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 
                text-white font-bold rounded-xl 
                hover:from-cyan-700 hover:to-cyan-800
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
              ) : (
                <>
                  <Save size={18} />
                  GUARDAR CAMBIOS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;