// roshi_fit/src/pages/dashboard/subscriptions/EditPlanModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchPlanById, updatePlan } from '../../../api/planApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { X, Save, Award, Edit, DollarSign, Clock, Image, List } from 'lucide-react';

interface EditPlanModalProps {
  planId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ planId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_q: '',
    duracion_dias: '',
    beneficios: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const plan = await fetchPlanById(planId);
        setFormData({
          nombre: plan.nombre,
          descripcion: plan.descripcion || '',
          precio_q: plan.precio_q.toString(),
          duracion_dias: plan.duracion_dias.toString(),
          beneficios: plan.beneficios ? JSON.stringify(plan.beneficios) : '',
        });
        setCurrentImage(plan.imagen);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el plan.');
      } finally {
        setLoading(false);
      }
    };
    loadPlan();
  }, [planId]);

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
      let imagen = currentImage;

      if (imageFile) {
        imagen = await uploadProductImage(imageFile);
      }

      await updatePlan(planId, {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        precio_q: parseFloat(formData.precio_q),
        duracion_dias: parseInt(formData.duracion_dias),
        imagen: imagen || undefined,
        beneficios: formData.beneficios || undefined,
      });

      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el plan.';
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
            <p className="text-dashboard-text font-semibold">Cargando plan...</p>
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
            <div className="p-2 bg-teal-600/20 rounded-lg">
              <Edit size={24} className="text-teal-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR PLAN</h2>
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
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Award size={16} className="text-teal-400" />NOMBRE DEL PLAN *</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Edit size={16} className="text-teal-400" />DESCRIPCIÓN</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={2} className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-vertical" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><DollarSign size={16} className="text-teal-400" />PRECIO (Q) *</label>
              <input name="precio_q" type="number" step="0.01" value={formData.precio_q} onChange={handleChange} required className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
            </div>
            <div>
              <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Clock size={16} className="text-teal-400" />DURACIÓN (DÍAS) *</label>
              <input name="duracion_dias" type="number" value={formData.duracion_dias} onChange={handleChange} required className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><List size={16} className="text-teal-400" />BENEFICIOS (JSON)</label>
            <textarea
              name="beneficios"
              value={formData.beneficios}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-vertical font-mono text-xs"
              placeholder='{ "acceso_gimnasio": true, "clases_grupales": false }'
            />
          </div>

          <div className="border-t border-dashboard-accent/50 pt-4">
            <h3 className="text-md font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Image size={18} className="text-teal-400" />
              IMAGEN DEL PLAN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {currentImage && (
                <div className="text-center">
                  <label className="text-xs font-bold text-dashboard-text-secondary mb-2 block">IMAGEN ACTUAL</label>
                  <img
                    src={`/assets/products/${currentImage}`}
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
                    className="w-full text-sm text-dashboard-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600/20 file:text-teal-300 hover:file:bg-teal-600/40"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-800 disabled:from-gray-600 transition-all flex items-center justify-center gap-2"
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

export default EditPlanModal;

/*
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

export default EditPlanModal;
*/