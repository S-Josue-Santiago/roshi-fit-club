// roshi_fit/src/pages/dashboard/services/CreateServiceModal.tsx
import React, { useState } from 'react';
import { createService } from '../../../api/serviceApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { X, Save, Dumbbell, Edit, Clock, DollarSign, Image, Plus } from 'lucide-react';

interface CreateServiceModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion_minutos: '',
    precio_q: '',
    imagen: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.nombre || !formData.precio_q) {
      setError('Nombre, y precio son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      let imagen = formData.imagen;

      if (imageFile) {
        imagen = await uploadProductImage(imageFile);
      }

      await createService({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        duracion_minutos: formData.duracion_minutos ? parseInt(formData.duracion_minutos) : undefined,
        precio_q: parseFloat(formData.precio_q),
        imagen: imagen || undefined,
      });

      onCreate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el servicio.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-lg border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Plus size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">CREAR NUEVO SERVICIO</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Dumbbell size={16} className="text-green-400" />NOMBRE DEL SERVICIO *
            </label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="Ej. Entrenamiento Personalizado"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Edit size={16} className="text-green-400" />DESCRIPCIÓN
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-vertical"
              placeholder="Describe el servicio..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
                <Clock size={16} className="text-green-400" />DURACIÓN (MIN)
              </label>
              <input
                name="duracion_minutos"
                type="number"
                value={formData.duracion_minutos}
                onChange={handleChange}
                className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                placeholder="Ej. 60"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-green-400" />PRECIO (Q) *
              </label>
              <input
                name="precio_q"
                type="number"
                step="0.01"
                value={formData.precio_q}
                onChange={handleChange}
                required
                className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Image size={16} className="text-green-400" />IMAGEN
            </label>
            <div className="p-3 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50 border-dashed">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-dashboard-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600/20 file:text-green-300 hover:file:bg-green-600/40"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/30 text-center">
            <p className="text-xs text-blue-400 font-semibold">* Campos obligatorios</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashboard-accent/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-dashboard-text font-bold border-2 border-dashboard-accent/50 rounded-xl hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  CREANDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  CREAR SERVICIO
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;