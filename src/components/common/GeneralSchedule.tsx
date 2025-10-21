// roshi_fit/src/components/common/GeneralSchedule.tsx
import React, { useState, useEffect } from 'react';
import { fetchGeneralSchedules } from '../../api/scheduleApi';
import { type Schedule } from '../../types/Schedule';

// Mapeo para mostrar nombres en español
const DIA_NOMBRES: Record<Schedule['dia_semana'], string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

// Orden de los días (de lunes a domingo)
const DIAS_ORDEN: Schedule['dia_semana'][] = [
  'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
];

const GeneralSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeneralSchedules()
      .then(setSchedules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Función para formatear la hora (ej: "1970-01-01T07:00:00.000Z" → "07:00")
  const formatTime = (timeStr: string): string => {
    const time = timeStr.split('T')[1].substring(0, 5);
    return time;
  };

  if (loading) {
    return <p className="text-text-gray text-center py-6">Cargando horarios...</p>;
  }

  // Convertir array de horarios en un mapa por día
  const scheduleMap = new Map<Schedule['dia_semana'], { inicio: string; fin: string }>();
  schedules.forEach(s => {
    scheduleMap.set(s.dia_semana, {
      inicio: formatTime(s.hora_inicio),
      fin: formatTime(s.hora_fin),
    });
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-text-light border-collapse">
        <thead>
          <tr className="border-b border-accent">
            <th className="py-3 px-4 text-left text-primary font-bold">Día</th>
            <th className="py-3 px-4 text-left text-primary font-bold">Horario</th>
          </tr>
        </thead>
        <tbody>
          {DIAS_ORDEN.map(dia => {
            const horario = scheduleMap.get(dia);
            return (
              <tr key={dia} className="border-b border-accent/30 hover:bg-accent/20">
                <td className="py-3 px-4 font-medium">{DIA_NOMBRES[dia]}</td>
                <td className="py-3 px-4">
                  {horario ? (
                    <span className="text-gold">{horario.inicio} - {horario.fin}</span>
                  ) : (
                    <span className="text-text-gray">Cerrado</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GeneralSchedule;