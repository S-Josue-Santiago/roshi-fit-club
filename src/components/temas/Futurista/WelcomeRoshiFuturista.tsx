// roshi_fit/src/components/temas/Futurista/WelcomeRoshiFuturista.tsx
import React, { useState, useEffect } from 'react';
import ServicesCarousel from '../../common/ServicesCarousel';
import PlansCarousel from '../../common/PlansCarousel';
import GeneralSchedule from '../../common/GeneralSchedule';
import TopProductsCarousel from '../../common/TopProductsCarousel';
import EquipmentCarousel from '../../common/EquipmentCarousel';
import GalleryGrid from '../../common/GalleryGrid';
import TestimonialsGrid from '../../common/TestimonialsGrid';
import ContactSection from '../../common/ContactSection';
import VisionMision from '../../common/VisionMision';

const WelcomeRoshiFuturista: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
      } else {
        setActiveSection('inicio');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div 
      className="h-screen overflow-hidden text-gray-800 relative"
      style={{
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0f7 25%, #f5f9fc 50%, #e3f2fd 75%, #f0f4f8 100%)',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(0, 120, 255, 0.08), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.08), transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.05), transparent 50%)
        `,
      }}
    >
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl " 
             style={{ background: 'radial-gradient(circle, rgba(0, 120, 255, 0.2), transparent)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl " 
             style={{ background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2), transparent)', animationDelay: '1s' }}></div>
      </div>

      {/* Contenedor de secciones que se muestran/ocultan */}
      <div className="h-full w-full relative z-10">
        {activeSection === 'inicio' && (
          <section id="inicio" className="relative flex items-center justify-center h-full bg-cover bg-center">
            {/* Imagen de fondo */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('https://img.freepik.com/fotos-premium/gimnasio-equipos-ejercicio_854605-27999.jpg?semt=ais_hybrid&w=740&q=80')`
              }}
            ></div>
            {/* Overlay para mejorar legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-blue-50/80 to-white/70 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center p-4">
              <h1 
                className="text-6xl md:text-8xl font-black mb-6 tracking-widest animate-pulse "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.2em'
                }}
              >
                ROSHI FIT
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                Bienvenido al dojo del futuro. Aquí no entrenas... <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">evolucionas</span>.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="#planes" 
                  className="px-8 py-4 font-black text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
                    boxShadow: '0 8px 25px rgba(0, 120, 255, 0.4), -4px -4px 12px rgba(0, 212, 255, 0.2), 4px 4px 12px rgba(0, 120, 255, 0.5)'
                  }}
                >
                  Ver Planes
                </a>
                <a 
                  href="#contacto" 
                  className="px-8 py-4 font-bold text-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(315deg, #ffffff, #f0f4f8)',
                    boxShadow: '-6px -6px 12px rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 120, 255, 0.2)',
                    border: '2px solid rgba(0, 120, 255, 0.3)'
                  }}
                >
                  Contacto
                </a>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'servicios' && (
          <section id="servicios" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                NUESTROS SERVICIOS
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Experiencias de entrenamiento diseñadas para tu evolución total.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <div 
                className="max-w-7xl mx-auto p-8 rounded-[66px]"
                style={{
                  background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 248, 0.9))',
                  boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.15), inset 0 0 20px rgba(0, 120, 255, 0.05)',
                  border: '2px solid rgba(0, 120, 255, 0.2)'
                }}
              >
                <ServicesCarousel />
              </div>
            </div>
          </section>
        )}

        {activeSection === 'planes' && (
          <section id="planes" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                PLANES DE EVOLUCIÓN
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Selecciona el plan perfecto para alcanzar tus metas más ambiciosas.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <PlansCarousel />
            </div>
          </section>
        )}

        {activeSection === 'productos' && (
          <section id="productos" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                EQUIPAMIENTO SUPERIOR
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Productos de élite para maximizar tu rendimiento diario.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <div 
                className="max-w-7xl mx-auto p-8 rounded-[66px]"
                style={{
                  background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 248, 0.9))',
                  boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.15), inset 0 0 20px rgba(0, 120, 255, 0.05)',
                  border: '2px solid rgba(0, 120, 255, 0.2)'
                }}
              >
                <TopProductsCarousel />
              </div>
            </div>
          </section>
        )}

        {activeSection === 'equipos' && (
          <section id="equipos" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                ARSENAL TECNOLÓGICO
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Maquinaria de vanguardia para un entrenamiento del futuro.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <div 
                className="max-w-7xl mx-auto p-8 rounded-[66px]"
                style={{
                  background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 248, 0.9))',
                  boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.15), inset 0 0 20px rgba(0, 120, 255, 0.05)',
                  border: '2px solid rgba(0, 120, 255, 0.2)'
                }}
              >
                <EquipmentCarousel />
              </div>
            </div>
          </section>
        )}

        {activeSection === 'galeria' && (
          <section id="galeria" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                REGISTROS VISUALES
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Una mirada al interior de nuestra comunidad de élite.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <div 
                className="max-w-7xl mx-auto p-8 rounded-[66px]"
                style={{
                  background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 248, 0.9))',
                  boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.15), inset 0 0 20px rgba(0, 120, 255, 0.05)',
                  border: '2px solid rgba(0, 120, 255, 0.2)'
                }}
              >
                <GalleryGrid />
              </div>
            </div>
          </section>
        )}

        {activeSection === 'testimonios' && (
          <section id="testimonios" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                TRANSMISIONES DE MIEMBROS
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Historias reales de transformación y superación personal.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <TestimonialsGrid />
            </div>
          </section>
        )}

        {activeSection === 'horarios' && (
          <section id="horarios" className="h-full flex items-center justify-center container mx-auto px-4 py-8">
            <div className="w-full">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-center tracking-widest "
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 120, 255, 0.3))',
                  letterSpacing: '0.15em'
                }}
              >
                CICLOS DE ENTRENAMIENTO
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto text-center leading-relaxed font-light italic">
                Encuentra el horario perfecto para tu rutina de evolución.
              </p>
              <div className="w-40 h-1.5 mx-auto mb-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #0078ff, #00d4ff, transparent)', boxShadow: '0 0 10px rgba(0, 120, 255, 0.5)' }}></div>
              <div 
                className="max-w-2xl mx-auto p-8 rounded-[66px]"
                style={{
                  background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 248, 0.9))',
                  boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.15), inset 0 0 20px rgba(0, 120, 255, 0.05)',
                  border: '2px solid rgba(0, 120, 255, 0.2)'
                }}
              >
                <GeneralSchedule />
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contacto' && (
          <section id="contacto" className="h-full flex items-center justify-center">
            <div className="w-full">
              <ContactSection />
            </div>
          </section>
        )}

        {activeSection === 'filosofia' && (
          <section id="filosofia" className="h-full flex items-center justify-center">
            <div className="w-full">
              <VisionMision />
            </div>
          </section>
        )}

        {/* Fallback por si el hash no coincide con ninguna sección */}
        {!['inicio', 'servicios', 'planes', 'productos', 'equipos', 'galeria', 'testimonios', 'horarios', 'filosofia', 'contacto'].includes(activeSection) && (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <h2 
                className="text-4xl font-black mb-4"
                style={{
                  background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Sección no encontrada
              </h2>
              <a href="#inicio" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-bold underline">Volver al inicio</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeRoshiFuturista;