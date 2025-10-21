// roshi_fit/src/pages/dashboard/gallery/CreateGalleryItemModal.tsx
import React, { useState } from 'react';
import { createGalleryItem } from '../../../api/galleryApi';
import { uploadProductImage } from '../../../api/uploadApi'; // Reutilizamos la misma función

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Crear Nuevo Item</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="titulo"
            placeholder="Título (opcional)"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción (opcional)"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="categoria"
            placeholder="Categoría (opcional)"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          {/* Subir imagen */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">
              Imagen del item *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            />
          </div>
          <input
            name="orden_visual"
            type="number"
            placeholder="Orden visual (opcional)"
            value={formData.orden_visual}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGalleryItemModal;