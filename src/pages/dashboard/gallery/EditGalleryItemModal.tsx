// roshi_fit/src/pages/dashboard/gallery/EditGalleryItemModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchGalleryItemById, updateGalleryItem } from '../../../api/galleryApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { X, Save, Image, Type, Edit, Tag, Activity } from 'lucide-react';

interface EditGalleryItemModalProps {
  itemId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditGalleryItemModal: React.FC<EditGalleryItemModalProps> = ({ itemId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    orden_visual: '',
    estado: 'activo',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await fetchGalleryItemById(itemId);
        setFormData({
          titulo: item.titulo || '',
          descripcion: item.descripcion || '',
          categoria: item.categoria || '',
          orden_visual: item.orden_visual?.toString() || '',
          estado: item.estado,
        });
        setCurrentImage(item.imagen_url);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el item.');
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [itemId]);

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

    try {
      let imagen_url = currentImage;

      if (imageFile) {
        imagen_url = await uploadProductImage(imageFile);
      }

      await updateGalleryItem(itemId, {
        titulo: formData.titulo || undefined,
        descripcion: formData.descripcion || undefined,
        categoria: formData.categoria || undefined,
        imagen_url: imagen_url || undefined,
        orden_visual: formData.orden_visual ? parseInt(formData.orden_visual) : undefined,
        estado: formData.estado,
      });

      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el item.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-black p-8 rounded-2xl w-full max-w-md border-2 border-dashboard-accent/50">
          <div className="flex justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dashboard-primary"></div>
            <p className="text-dashboard-text font-semibold">Cargando item...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-lg border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 rounded-lg">
              <Edit size={24} className="text-pink-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR ITEM DE GALERÍA</h2>
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
              <Type size={16} className="text-pink-400" />TÍTULO (OPCIONAL)
            </label>
            <input
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Edit size={16} className="text-pink-400" />DESCRIPCIÓN (OPCIONAL)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-vertical"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Tag size={16} className="text-pink-400" />CATEGORÍA (OPCIONAL)
            </label>
            <input
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Activity size={16} className="text-pink-400" />ESTADO
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
            >
              <option className="bg-black" value="activo">Activo</option>
              <option className="bg-black" value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="border-t border-dashboard-accent/50 pt-4">
            <h3 className="text-md font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Image size={18} className="text-pink-400" />
              IMAGEN DEL ITEM
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {currentImage && (
                <div className="text-center">
                  <label className="text-xs font-bold text-dashboard-text-secondary mb-2 block">IMAGEN ACTUAL</label>
                  <img
                    src={`/assets/gallery/${currentImage}`}
                    alt="Imagen actual"
                    className="w-24 h-24 object-cover rounded-lg mx-auto border-2 border-dashboard-accent/50"
                  />
                </div>
              )}
              <div className={currentImage ? '' : 'md:col-span-2'}>
                <label className="text-xs font-bold text-dashboard-text-secondary mb-2 block">
                  {currentImage ? 'REEMPLAZAR IMAGEN' : 'SUBIR IMAGEN'}
                </label>
                <div className="p-3 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50 border-dashed">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-dashboard-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600/20 file:text-pink-300 hover:file:bg-pink-600/40"
                  />
                </div>
              </div>
            </div>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold rounded-xl hover:from-pink-700 hover:to-pink-800 disabled:from-gray-600 transition-all flex items-center justify-center gap-2"
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

export default EditGalleryItemModal;

/*
          <input
            name="orden_visual"
            type="number"
            placeholder="Orden visual (opcional)"
            value={formData.orden_visual}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGalleryItemModal;
*/
 