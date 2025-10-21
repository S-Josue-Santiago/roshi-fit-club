// roshi_fit/src/pages/dashboard/services/EditServiceModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchServiceById, updateService } from '../../../api/serviceApi';
import { uploadProductImage } from '../../../api/uploadApi';

interface EditServiceModalProps {
  serviceId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ serviceId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion_minutos: '',
    precio_q: '',
    imagen: '',
    estado: 'activo',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadService = async () => {
      try {
        const service = await fetchServiceById(serviceId);
        setFormData({
          nombre: service.nombre,
          descripcion: service.descripcion || '',
          duracion_minutos: service.duracion_minutos?.toString() || '',
          precio_q: service.precio_q.toString(),
          imagen: service.imagen || '',
          estado: service.estado,
        });
        setCurrentImage(service.imagen);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el servicio.');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [serviceId]);

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
      let imagen = currentImage;

      if (imageFile) {
        imagen = await uploadProductImage(imageFile);
      }

      await updateService(serviceId, {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        duracion_minutos: formData.duracion_minutos ? parseInt(formData.duracion_minutos) : undefined,
        precio_q: parseFloat(formData.precio_q),
        imagen: imagen || undefined,
        estado: formData.estado,
      });

      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el servicio.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="bg-dashboard-accent/90 p-6 rounded-xl w-full max-w-md border border-dashboard-accent">
          <p className="text-dashboard-text">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Editar Servicio</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre del servicio *"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          <input
            name="duracion_minutos"
            type="number"
            placeholder="Duración en minutos"
            value={formData.duracion_minutos}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="precio_q"
            type="number"
            step="0.01"
            placeholder="Precio (Q) *"
            value={formData.precio_q}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          {currentImage && (
            <div className="mb-2">
              <label className="block text-sm text-dashboard-text-secondary mb-1">
                Imagen actual
              </label>
              <img
                src={`/assets/products/${currentImage}`}
                alt="Imagen actual"
                className="w-24 h-24 object-cover rounded border border-dashboard-accent"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">
              Nueva imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            />
          </div>
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

export default EditServiceModal;