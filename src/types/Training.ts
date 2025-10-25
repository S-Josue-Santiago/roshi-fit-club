// roshi_fit/src/types/Training.ts
export interface Exercise {
  id: number;
  nombre: string;
  tipo_musculo: string;
  dificultad: 'principiante' | 'intermedio' | 'avanzado';
}

export interface TrainingExercise {
  id: number;
  ejercicio_id: number;
  dia_semana: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo' | null;
  series: number | null;
  repeticiones: number | null;
  descanso_segundos: number | null;
  notas: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
  ejercicios: Exercise;
}


export interface TrainingPlan {
  id: number;
  nombre: string;
  objetivo: string | null;
  duracion_semanas: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
  plan_ejercicios: TrainingExercise[];
}


// src/types/Trainer.ts
export interface Client {
  id: number;
  nombre_completo: string;
  email: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
}





