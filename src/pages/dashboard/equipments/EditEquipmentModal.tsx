// roshi_fit/src/pages/dashboard/equipment/EditEquipmentModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchEquipmentById, updateEquipment } from '../../../api/equipmentApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { X, Save, Wrench, Type, Tag, Hash, MapPin, Activity, Calendar, Image, Edit } from 'lucide-react';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-black p-8 rounded-2xl w-full max-w-md border-2 border-dashboard-accent/50">
          <div className="flex justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dashboard-primary"></div>
            <p className="text-dashboard-text font-semibold">Cargando equipo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-3xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Edit size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR EQUIPO</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Wrench size={16} className="text-indigo-400" />NOMBRE *</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Type size={16} className="text-indigo-400" />TIPO</label>
                <input name="tipo" value={formData.tipo} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Tag size={16} className="text-indigo-400" />MARCA</label>
                <input name="marca" value={formData.marca} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Hash size={16} className="text-indigo-400" />MODELO</label>
                <input name="modelo" value={formData.modelo} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Hash size={16} className="text-indigo-400" />NÚMERO DE SERIE</label>
                <input name="numero_serie" value={formData.numero_serie} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><MapPin size={16} className="text-indigo-400" />UBICACIÓN</label>
                <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Activity size={16} className="text-indigo-400" />ESTADO DEL EQUIPO</label>
                <select name="estado_equipo" value={formData.estado_equipo} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                  <option className="bg-black" value="funcional">Funcional</option>
                  <option className="bg-black" value="en_mantenimiento">En Mantenimiento</option>
                  <option className="bg-black" value="fuera_de_servicio">Fuera de Servicio</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Calendar size={16} className="text-indigo-400" />ÚLTIMA REVISIÓN</label>
                <input name="ultima_revision" type="date" value={formData.ultima_revision} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Calendar size={16} className="text-indigo-400" />PRÓXIMA REVISIÓN</label>
                <input name="proxima_revision" type="date" value={formData.proxima_revision} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Activity size={16} className="text-indigo-400" />ESTADO DEL REGISTRO</label>
                <select name="estado" value={formData.estado} onChange={handleChange} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                  <option className="bg-black" value="activo">Activo</option>
                  <option className="bg-black" value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-dashboard-accent/50 pt-4">
            <h3 className="text-md font-bold text-dashboard-text mb-3 flex items-center gap-2"><Image size={18} className="text-indigo-400" />IMAGEN DEL EQUIPO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {currentImage && (
                <div className="text-center">
                  <label className="text-xs font-bold text-dashboard-text-secondary mb-2 block">IMAGEN ACTUAL</label>
                  <img src={`/assets/products/${currentImage}`} alt="Imagen actual" className="w-24 h-24 object-cover rounded-lg mx-auto border-2 border-dashboard-accent/50" />
                </div>
              )}
              <div className={currentImage ? '' : 'md:col-span-2'}>
                <label className="text-xs font-bold text-dashboard-text-secondary mb-2 block">{currentImage ? 'REEMPLAZAR IMAGEN' : 'SUBIR IMAGEN'}</label>
                <div className="p-3 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50 border-dashed">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-dashboard-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/40"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-600 transition-all flex items-center justify-center gap-2"
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

export default EditEquipmentModal;

/*
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
*/