// roshi_fit/src/components/common/GeneralSchedule.tsx
import React, { useState, useEffect } from 'react';
import { fetchGeneralSchedules } from '../../api/scheduleApi';
import { type Schedule } from '../../types/Schedule';

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      setTheme(bodyClass.includes('futurista') ? 'futurista' : 'original');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

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
  const theme = useTheme();

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

  const getLoadingStyle = () => {
    return theme === 'futurista'
      ? 'text-gray-600 text-lg font-light'
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Cargando horarios...</p>;
  }

  // Convertir array de horarios en un mapa por día
  const scheduleMap = new Map<Schedule['dia_semana'], { inicio: string; fin: string }>();
  schedules.forEach(s => {
    scheduleMap.set(s.dia_semana, {
      inicio: formatTime(s.hora_inicio),
      fin: formatTime(s.hora_fin),
    });
  });

  const getStyles = () => {
    if (theme === 'futurista') {
      return {
        container: 'rounded-2xl overflow-hidden',
        containerStyle: {
          background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
          boxShadow: '-8px -8px 16px rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        table: 'w-full text-gray-800 border-collapse',
        headerRow: 'border-b-2 border-blue-200/50',
        headerCell: 'py-4 px-5 text-left font-black text-blue-600 uppercase tracking-wider',
        bodyRow: 'border-b border-blue-100/80 last:border-b-0',
        dayCell: 'py-3 px-5 font-semibold text-gray-700',
        timeCell: 'py-3 px-5',
        timeText: 'font-bold text-blue-600',
        closedText: 'text-gray-400 italic'
      };
    }
    // Tema Original
    return {
      container: 'rounded-2xl overflow-hidden',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      table: 'w-full text-text-light border-collapse',
      headerRow: 'border-b-2 border-accent',
      headerCell: 'py-4 px-5 text-left text-primary font-bold uppercase tracking-wider',
      bodyRow: 'border-b border-accent/30 last:border-b-0 hover:bg-accent/20 transition-colors duration-200',
      dayCell: 'py-3 px-5 font-medium',
      timeCell: 'py-3 px-5',
      timeText: 'text-gold font-semibold',
      closedText: 'text-text-gray italic'
    };
  };

  const styles = getStyles();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Día</th>
            <th className={styles.headerCell}>Horario</th>
          </tr>
        </thead>
        <tbody>
          {DIAS_ORDEN.map(dia => {
            const horario = scheduleMap.get(dia);
            return (
              <tr key={dia} className={styles.bodyRow}>
                <td className={styles.dayCell}>{DIA_NOMBRES[dia]}</td>
                <td className={styles.timeCell}>
                  {horario ? (
                    <span className={styles.timeText}>{horario.inicio} - {horario.fin}</span>
                  ) : (
                    <span className={styles.closedText}>Cerrado</span>
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