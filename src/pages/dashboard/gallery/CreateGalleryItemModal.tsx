// roshi_fit/src/pages/dashboard/gallery/CreateGalleryItemModal.tsx
import React, { useState } from 'react';
import { createGalleryItem } from '../../../api/galleryApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { X, Save, Image, Type, Edit, Tag, Plus } from 'lucide-react';

interface CreateGalleryItemModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateGalleryItemModal: React.FC<CreateGalleryItemModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    orden_visual: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    try {
      let imagen_url = '';

      // Subir imagen si se seleccionó
      if (imageFile) {
        imagen_url = await uploadProductImage(imageFile);
      } else {
        setError('Debe seleccionar una imagen.');
        setLoading(false);
        return;
      }

      await createGalleryItem({
        titulo: formData.titulo || undefined,
        descripcion: formData.descripcion || undefined,
        categoria: formData.categoria || undefined,
        imagen_url,
        orden_visual: formData.orden_visual ? parseInt(formData.orden_visual) : undefined,
      });

      onCreate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el item.';
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
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Plus size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">NUEVO ITEM DE GALERÍA</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Image size={16} className="text-green-400" />IMAGEN *
            </label>
            <div className="p-3 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50 border-dashed">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full text-sm text-dashboard-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600/20 file:text-green-300 hover:file:bg-green-600/40"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Type size={16} className="text-green-400" />TÍTULO (OPCIONAL)
            </label>
            <input
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="Ej. Día de Piernas"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Edit size={16} className="text-green-400" />DESCRIPCIÓN (OPCIONAL)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-vertical"
              placeholder="Describe la imagen..."
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Tag size={16} className="text-green-400" />CATEGORÍA (OPCIONAL)
            </label>
            <input
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="Ej. Instalaciones, Eventos"
            />
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
                  CREAR ITEM
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGalleryItemModal;