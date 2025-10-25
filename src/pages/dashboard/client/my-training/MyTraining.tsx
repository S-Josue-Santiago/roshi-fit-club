// roshi_fit/src/pages/dashboard/client/my-training/MyTraining.tsx
import React, { useState, useEffect } from 'react';
import { fetchMyTrainingPlan } from '../../../../api/trainingApi';
import type { TrainingPlan } from '../../../../types/Training';
import TrainingExerciseCard from './TrainingExerciseCard';
import { Calendar, Target, Clock, Award, Activity, AlertCircle, Dumbbell } from 'lucide-react';

const MyTraining: React.FC = () => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTraining = async () => {
      try {
        const data = await fetchMyTrainingPlan();
        setTrainingPlan(data);
      } catch (err) {
        setError('Error al cargar tu plan de entrenamiento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTraining();
  }, []);

  const handleExerciseStatusChange = () => {
    const loadTraining = async () => {
      const data = await fetchMyTrainingPlan();
      setTrainingPlan(data);
    };
    loadTraining();
  };

  const getStatusConfig = (estado: string) => {
    const configs: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      activo: {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: <Activity size={16} className="text-green-400" />,
        text: 'ACTIVO'
      },
      inactivo: {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: <Clock size={16} className="text-yellow-400" />,
        text: 'INACTIVO'
      },
      deshabilitado: {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: <AlertCircle size={16} className="text-red-400" />,
        text: 'DESHABILITADO'
      }
    };
    return configs[estado] || configs.inactivo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-dashboard-text font-bold">CARGANDO PLAN DE ENTRENAMIENTO</p>
          <p className="text-dashboard-text-secondary text-sm mt-1">Preparando tu rutina personalizada</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-6 rounded-xl flex items-center gap-3">
        <AlertCircle size={24} className="text-red-400" />
        <div>
          <p className="font-bold">Error al cargar</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!trainingPlan) {
    return (
      <div className="bg-dashboard-accent/30 p-8 rounded-xl border-2 border-dashboard-accent/50 text-center">
        <div className="text-6xl mb-4">💪</div>
        <h2 className="text-2xl font-black text-dashboard-text mb-4">SIN PLAN DE ENTRENAMIENTO</h2>
        <p className="text-dashboard-text-secondary mb-6">No tienes un plan de entrenamiento activo asignado.</p>
        <p className="text-dashboard-text-secondary text-sm">
          Contacta con tu entrenador para obtener un plan personalizado
        </p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(trainingPlan.estado);

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border-2 border-dashboard-accent/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-600/20 rounded-xl">
            <Dumbbell size={28} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-dashboard-text">MI PLAN DE ENTRENAMIENTO</h2>
            <p className="text-dashboard-text-secondary text-sm">Rutina personalizada para alcanzar tus objetivos</p>
          </div>
        </div>
        
        {/* Badge de estado */}
        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm
          ${statusConfig.color}
        `}>
          {statusConfig.icon}
          {statusConfig.text}
        </div>
      </div>

      {/* Información del plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
          <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
            <Award size={16} className="text-cyan-400" />
            NOMBRE DEL PLAN
          </label>
          <p className="text-dashboard-text font-black text-lg">{trainingPlan.nombre}</p>
        </div>

        <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
          <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            OBJETIVO
          </label>
          <p className="text-dashboard-text font-semibold">{trainingPlan.objetivo || 'No especificado'}</p>
        </div>

        <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
          <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
            <Clock size={16} className="text-cyan-400" />
            DURACIÓN
          </label>
          <p className="text-dashboard-text font-semibold">
            {trainingPlan.duracion_semanas 
              ? `${trainingPlan.duracion_semanas} semanas` 
              : 'No definida'}
          </p>
        </div>

        <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
          <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-cyan-400" />
            PERIODO
          </label>
          <div className="text-dashboard-text text-sm">
            <div className="font-semibold">
              {trainingPlan.fecha_inicio 
                ? new Date(trainingPlan.fecha_inicio).toLocaleDateString('es-GT')
                : '—'}
            </div>
            <div className="text-dashboard-text-secondary">hasta</div>
            <div className="font-semibold">
              {trainingPlan.fecha_fin 
                ? new Date(trainingPlan.fecha_fin).toLocaleDateString('es-GT')
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de ejercicios */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-dashboard-text flex items-center gap-2">
            <Dumbbell size={20} className="text-cyan-400" />
            EJERCICIOS DEL PLAN
          </h3>
          <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold border border-cyan-500/30">
            {trainingPlan.plan_ejercicios.length} EJERCICIOS
          </span>
        </div>

        {trainingPlan.plan_ejercicios.length === 0 ? (
          <div className="text-center py-12 bg-dashboard-accent/20 rounded-xl border-2 border-dashboard-accent/30">
            <div className="text-6xl mb-4">🏋️</div>
            <p className="text-dashboard-text text-xl font-black">NO HAY EJERCICIOS ASIGNADOS</p>
            <p className="text-dashboard-text-secondary mt-2">
              Tu entrenador agregará ejercicios a tu plan pronto
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trainingPlan.plan_ejercicios.map((exercise) => (
              <TrainingExerciseCard
                key={exercise.id}
                exercise={exercise}
                onStatusChange={handleExerciseStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTraining;