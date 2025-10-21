// roshi_fit/src/types/Exercise.ts
export interface Exercise {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo_musculo: string;
  dificultad: 'principiante' | 'intermedio' | 'avanzado';
}

export interface ExerciseFilters {
  search: string;
  dificultad: string;
  tipo_musculo: string;
}

export interface CreateExerciseData {
  nombre: string;
  descripcion?: string;
  tipo_musculo: string;
  dificultad: 'principiante' | 'intermedio' | 'avanzado';
  video_url?: string;
  imagen?: string;
}

export interface UpdateExerciseData {
  nombre?: string;
  descripcion?: string;
  tipo_musculo?: string;
  dificultad?: 'principiante' | 'intermedio' | 'avanzado';
  video_url?: string;
  imagen?: string;
}