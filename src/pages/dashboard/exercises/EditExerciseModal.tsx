// roshi_fit/src/pages/dashboard/exercises/EditExerciseModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchExerciseById, updateExercise } from '../../../api/exerciseApi';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="bg-dashboard-accent/90 p-6 rounded-xl w-full max-w-md border border-dashboard-accent">
          <p className="text-dashboard-text">Cargando ejercicio...</p>
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
          <h2 className="text-xl font-bold text-dashboard-text">Editar Ejercicio</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre del ejercicio *"
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
            name="tipo_musculo"
            placeholder="Tipo de músculo (ej: Pecho, Piernas) *"
            value={formData.tipo_musculo}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <select
            name="dificultad"
            value={formData.dificultad}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          >
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <input
            name="video_url"
            placeholder="URL del video (opcional)"
            value={formData.video_url}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <input
            name="imagen"
            placeholder="URL de la imagen (opcional)"
            value={formData.imagen}
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExerciseModal;