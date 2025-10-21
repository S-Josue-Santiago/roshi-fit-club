// roshi_fit/src/pages/dashboard/equipment/EditEquipmentModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchEquipmentById, updateEquipment } from '../../../api/equipmentApi';
import { uploadProductImage } from '../../../api/uploadApi';

interface EditEquipmentModalProps {
  equipmentId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ equipmentId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    ubicacion: '',
    estado_equipo: 'funcional',
    ultima_revision: '',
    proxima_revision: '',
    estado: 'activo',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const equipment = await fetchEquipmentById(equipmentId);
        setFormData({
          nombre: equipment.nombre,
          tipo: equipment.tipo || '',
          marca: equipment.marca || '',
          modelo: equipment.modelo || '',
          numero_serie: equipment.numero_serie || '',
          ubicacion: equipment.ubicacion || '',
          estado_equipo: equipment.estado_equipo,
          ultima_revision: equipment.ultima_revision ? equipment.ultima_revision.split('T')[0] : '',
          proxima_revision: equipment.proxima_revision ? equipment.proxima_revision.split('T')[0] : '',
          estado: equipment.estado,
        });
        setCurrentImage(equipment.imagen);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el equipo.');
      } finally {
        setLoading(false);
      }
    };
    loadEquipment();
  }, [equipmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      await updateEquipment(equipmentId, {
        ...formData,
        imagen: imagen || undefined,
      });

      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el equipo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="bg-dashboard-accent/90 p-6 rounded-xl w-full max-w-md border border-dashboard-accent">
          <p className="text-dashboard-text">Cargando equipo...</p>
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
          <h2 className="text-xl font-bold text-dashboard-text">Editar Equipo</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre del equipo *"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="tipo"
            placeholder="Tipo (ej: Fuerza)"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="marca"
            placeholder="Marca"
            value={formData.marca}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="modelo"
            placeholder="Modelo"
            value={formData.modelo}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="numero_serie"
            placeholder="Número de Serie"
            value={formData.numero_serie}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="ubicacion"
            placeholder="Ubicación"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <select
            name="estado_equipo"
            value={formData.estado_equipo}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          >
            <option value="funcional">Funcional</option>
            <option value="en_mantenimiento">En Mantenimiento</option>
            <option value="fuera_de_servicio">Fuera de Servicio</option>
          </select>
          <input
            name="ultima_revision"
            type="date"
            value={formData.ultima_revision}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="proxima_revision"
            type="date"
            value={formData.proxima_revision}
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

export default EditEquipmentModal;