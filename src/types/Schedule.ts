// roshi_fit/src/types/Schedule.ts
export interface Schedule {
  dia_semana: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  hora_inicio: string; // Ej: "07:00:00" → usaremos solo HH:mm
  hora_fin: string;
}