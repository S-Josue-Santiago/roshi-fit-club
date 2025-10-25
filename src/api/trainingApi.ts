// roshi_fit/src/api/trainingApi.ts
import api from '../api/axiosInstance';
import type { Client, TrainingPlan, Exercise, TrainingExercise  } from '../types/Training';

export const fetchMyTrainingPlan = async (): Promise<TrainingPlan | null> => {
  const userData = localStorage.getItem('userData');
  if (!userData) return null;
  
  const user = JSON.parse(userData);
  const res = await api.get<TrainingPlan>(`/training/${user.id}`);
  return res.data;
};

export const updateExerciseStatus = async (exerciseId: number, estado: 'activo' | 'desabilitado'): Promise<void> => {
  await api.patch(`/training/exercises/${exerciseId}/status`, { estado });
};


// Clientes
export const fetchClients = async (): Promise<Client[]> => {
  const res = await api.get<Client[]>('/trainer/clients');
  return res.data;
};

export const assignTrainingPlan = async (clientId: number, planId: number): Promise<void> => {
  await api.post(`/trainer/clients/${clientId}/assign-plan`, { plan_id: planId });
};

// Planes
export const fetchTrainerPlans = async (): Promise<TrainingPlan[]> => {
  const res = await api.get<TrainingPlan[]>('/trainer/plans');
  return res.data;
};

export const createTrainingPlan = async (data: {
  nombre: string;
  objetivo: string;
  duracion_semanas: number;
  cliente_id: number;
}): Promise<TrainingPlan> => {
  const res = await api.post<TrainingPlan>('/trainer/plans', data);
  return res.data;
};

// Ejercicios
export const fetchExercises = async (): Promise<Exercise[]> => {
  const res = await api.get<Exercise[]>('/trainer/exercises');
  return res.data;
};

export const createExercise = async (data: {
  nombre: string;
  tipo_musculo: string;
  dificultad: 'principiante' | 'intermedio' | 'avanzado';
}): Promise<Exercise> => {
  const res = await api.post<Exercise>('/trainer/exercises', data);
  return res.data;
};

// Plan de ejercicios
export const fetchPlanExercises = async (planId: number): Promise<TrainingExercise[]> => {
  const res = await api.get<TrainingExercise[]>(`/trainer/plans/${planId}/exercises`);
  return res.data;
};

