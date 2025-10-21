// roshi_fit/src/api/exerciseApi.ts
import api from './axiosInstance';
import type { Exercise, ExerciseFilters } from '../types/Exercise';

export const fetchExercises = async (filters: ExerciseFilters): Promise<Exercise[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.dificultad) params.append('dificultad', filters.dificultad);
  if (filters.tipo_musculo) params.append('tipo_musculo', filters.tipo_musculo);
  const res = await api.get<Exercise[]>(`/exercises?${params.toString()}`);
  return res.data;
};

export const fetchExerciseById = async (id: number): Promise<Exercise & { video_url: string | null; imagen: string | null }> => {
  const res = await api.get(`/exercises/${id}`);
  return res.data;
};

export const createExercise = async (data: {
  nombre: string;
  descripcion?: string;
  tipo_musculo: string;
  dificultad: string;
  video_url?: string;
  imagen?: string;
}): Promise<Exercise> => {
  const res = await api.post<Exercise>('/exercises', data);
  return res.data;
};

export const updateExercise = async (id: number, data: {
  nombre?: string;
  descripcion?: string;
  tipo_musculo?: string;
  dificultad?: string;
  video_url?: string;
  imagen?: string;
}): Promise<Exercise> => {
  const res = await api.patch<Exercise>(`/exercises/${id}`, data);
  return res.data;
};

// NUEVA FUNCIÓN
export const fetchMuscleTypes = async (): Promise<string[]> => {
  const res = await api.get<string[]>('/exercises/muscle-types');
  return res.data;
};
