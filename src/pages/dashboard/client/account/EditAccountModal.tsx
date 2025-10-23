// roshi_fit/src/pages/dashboard/client/account/EditAccountModal.tsx
import React, { useState } from 'react';
import { updateUserProfile } from '../../../../api/userApi';
import { uploadProfileImage } from '../../../../api/uploadApi';
import { X, Save, User, Phone, Calendar, Users, MapPin, Image } from 'lucide-react';

const AVATARS = [
  'avatar1.png', 'avatar2.png', 'avatar3.png',
  'avatar4.png', 'avatar5.png', 'avatar6.png'
];

interface EditAccountModalProps {
  user: any;
  onClose: () => void;
  onUpdateSuccess: (updatedUser: any) => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ user, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_completo: user.nombre_completo || '',
    telefono: user.telefono || '',
    fecha_nacimiento: user.fecha_nacimiento 
      ? new Date(user.fecha_nacimiento).toISOString().split('T')[0] 
      : '',
    genero: user.genero || 'masculino',
    direccion: user.direccion || '',
  });
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user.foto_perfil);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setSelectedAvatar(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let foto_perfil = selectedAvatar;

      if (imageFile) {
        const filename = await uploadProfileImage(imageFile);
        foto_perfil = filename;
      }

      const updatedUser = await updateUserProfile(user.id, {
        ...formData,
        foto_perfil: foto_perfil ?? undefined,
      });

      onUpdateSuccess(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/20 rounded-lg">
              <User size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR MI CUENTA</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <User size={16} className="text-cyan-400" />
                  NOMBRE COMPLETO
                </label>
                <input
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  required
                  className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Phone size={16} className="text-cyan-400" />
                  TELÉFONO
                </label>
                <input
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-cyan-400" />
                  FECHA DE NACIMIENTO
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                  className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
              {/* Género */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Users size={16} className="text-cyan-400" />
                  GÉNERO
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="bg-black w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Dirección */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400" />
                  DIRECCIÓN
                </label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  rows={4}
                  className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Foto de perfil */}
          <div className="border-t border-dashboard-accent/50 pt-6">
            <h3 className="text-lg font-bold text-dashboard-text mb-4 flex items-center gap-2">
              <Image size={20} className="text-cyan-400" />
              FOTO DE PERFIL
            </h3>
            <div className="p-4 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50">
              <label className=" text-sm font-bold text-dashboard-text mb-3">
                SELECCIONA UN AVATAR
              </label>
              <div className="flex flex-wrap gap-3 mb-4">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      setImageFile(null);
                    }}
                    className={`w-16 h-16 rounded-full overflow-hidden border-4 transition-all duration-300 transform hover:scale-110 ${
                      selectedAvatar === avatar ? 'border-cyan-500' : 'border-dashboard-accent/50 hover:border-cyan-400/50'
                    }`}
                  >
                    <img src={`/assets/avatars/${avatar}`} alt={avatar} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <label className=" text-sm font-bold text-dashboard-text mb-3">
                O SUBE TU PROPIA IMAGEN
              </label>
              <div className="p-4 bg-dashboard-bg rounded-xl border-2 border-dashboard-accent/50 border-dashed">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-lg border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer"
                />
                <p className="text-xs text-dashboard-text-secondary mt-2 text-center">
                  Subir una imagen nueva deseleccionará el avatar.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-dashboard-accent/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-dashboard-text font-bold border-2 border-dashboard-accent/50 rounded-xl hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <X size={18} />
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-cyan-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ACTUALIZANDO...
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

export default EditAccountModal;