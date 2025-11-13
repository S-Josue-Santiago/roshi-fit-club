// roshi_fit/src/components/common/VisionMision.tsx
import React, { useState, useEffect } from 'react';
import { Eye, Target } from 'lucide-react';

// Hook para detectar el tema actual (reutilizado de otros componentes)
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

const VisionMision: React.FC = () => {
  const theme = useTheme();

  const getStyles = () => {
    if (theme === 'futurista') {
      return {
        container: 'py-24 px-4',
        containerStyle: {
          background: 'linear-gradient(135deg, #f0f4f8, #e8f0f7)',
        },
        title: 'text-5xl font-black mb-4 text-center tracking-wider',
        titleStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        subtitle: 'text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center font-light',
        contentContainer: 'max-w-6xl mx-auto p-8 rounded-[40px]',
        contentContainerStyle: {
          background: 'linear-gradient(315deg, #ffffff, #f0f4f8)',
          boxShadow: '-12px -12px 24px rgba(255, 255, 255, 0.9), 12px 12px 24px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        itemContainer: 'p-6 rounded-3xl',
        itemContainerStyle: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(240, 244, 248, 0.8))',
          border: '1px solid rgba(0, 120, 255, 0.15)'
        },
        itemTitle: 'text-3xl font-bold text-gray-800 mb-3',
        itemText: 'text-gray-700 leading-relaxed',
        itemIcon: 'text-blue-500',
      };
    }
    // Tema Original
    return {
      container: 'py-24 px-4',
      containerStyle: {},
      title: 'text-5xl font-black text-primary mb-4 text-center',
      titleStyle: {},
      subtitle: 'text-xl text-text-gray mb-12 max-w-2xl mx-auto text-center',
      contentContainer: 'max-w-6xl mx-auto p-8 rounded-[40px]',
      contentContainerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-12px -12px 24px rgba(20, 20, 20, 0.8), 12px 12px 24px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      itemContainer: 'p-6 rounded-3xl',
      itemContainerStyle: {
        background: 'linear-gradient(135deg, rgba(45, 45, 68, 0.5), rgba(60, 60, 80, 0.5))',
        border: '1px solid rgba(255, 107, 53, 0.15)'
      },
      itemTitle: 'text-3xl font-bold text-gold mb-3',
      itemText: 'text-text-light leading-relaxed',
      itemIcon: 'text-primary',
    };
  };

  const styles = getStyles();

  return (
    <div className={styles.container} style={styles.containerStyle} id="filosofia">
      <div className={styles.contentContainer} style={styles.contentContainerStyle}>
        <h2 className={styles.title} style={styles.titleStyle}>
          Nuestra Filosofía
        </h2>
        <p className={styles.subtitle}>
          Los principios que guían cada uno de nuestros entrenamientos y definen nuestro dojo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Visión */}
          <div className={styles.itemContainer} style={styles.itemContainerStyle}>
            <div className="flex items-center gap-4 mb-4">
              <Eye size={32} className={styles.itemIcon} />
              <h3 className={styles.itemTitle}>Visión</h3>
            </div>
            <p className={styles.itemText}>
              Ser el dojo líder en la evolución física y mental, donde cada miembro descubre y libera su máximo potencial, forjando una comunidad de individuos fuertes, resilientes y disciplinados.
            </p>
          </div>

          {/* Misión */}
          <div className={styles.itemContainer} style={styles.itemContainerStyle}>
            <div className="flex items-center gap-4 mb-4">
              <Target size={32} className={styles.itemIcon} />
              <h3 className={styles.itemTitle}>Misión</h3>
            </div>
            <p className={styles.itemText}>
              Proporcionar un entorno de entrenamiento de élite con equipamiento de vanguardia, guía experta y una comunidad de apoyo inquebrantable, empoderando a cada persona para que construya su versión más fuerte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMision;