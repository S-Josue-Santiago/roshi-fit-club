// roshi_fit/src/pages/dashboard/exercises/EditExerciseModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchExerciseById, updateExercise } from '../../../api/exerciseApi';
import { X, Save, Dumbbell, Edit , Activity, Video, Image } from 'lucide-react';

interface EditExerciseModalProps {
  exerciseId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditExerciseModal: React.FC<EditExerciseModalProps> = ({ exerciseId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo_musculo: '',
    dificultad: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
    video_url: '',
    imagen: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const exercise = await fetchExerciseById(exerciseId);
        setFormData({
          nombre: exercise.nombre,
          descripcion: exercise.descripcion || '',
          tipo_musculo: exercise.tipo_musculo,
          dificultad: exercise.dificultad,
          video_url: exercise.video_url || '',
          imagen: exercise.imagen || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el ejercicio.');
      } finally {
        setLoading(false);
      }
    };
    loadExercise();
  }, [exerciseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateExercise(exerciseId, formData);
      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el ejercicio.';
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
            <p className="text-dashboard-text font-semibold">Cargando ejercicio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Dumbbell size={24} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR EJERCICIO</h2>
          </div>
          <button onClick={onClose} className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110">
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
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2"><Dumbbell size={16} className="text-blue-400" />NOMBRE *</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2"><Dumbbell  size={16} className="text-blue-400" />TIPO DE MÚSCULO *</label>
                <input name="tipo_musculo" value={formData.tipo_musculo} onChange={handleChange} required className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2"><Activity size={16} className="text-blue-400" />DIFICULTAD *</label>
                <select name="dificultad" value={formData.dificultad} onChange={handleChange} className="bg-black w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer">
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2"><Edit size={16} className="text-blue-400" />DESCRIPCIÓN</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300 resize-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2"><Video size={16} className="text-blue-400" />URL DEL VIDEO</label>
                <input name="video_url" value={formData.video_url} onChange={handleChange} className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300" />
              </div>
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2"><Image size={16} className="text-blue-400" />URL DE LA IMAGEN</label>
                <input name="imagen" value={formData.imagen} onChange={handleChange} className="w-full p-4 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-dashboard-accent/50">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 text-dashboard-text font-bold border-2 border-dashboard-accent/50 rounded-xl hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <X size={18} />
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
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

export default EditExerciseModal;