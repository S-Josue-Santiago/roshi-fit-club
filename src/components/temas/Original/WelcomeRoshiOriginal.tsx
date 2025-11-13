// roshi_fit/src/components/temas/Original/WelcomeRoshiOriginal.tsx
import React from 'react';

import ServicesCarousel from '../../common/ServicesCarousel';
import PlansCarousel from '../../common/PlansCarousel';
import GeneralSchedule from '../../common/GeneralSchedule';
import TopProductsCarousel from '../../common/TopProductsCarousel';
import EquipmentCarousel from '../../common/EquipmentCarousel';
import GalleryGrid from '../../common/GalleryGrid';
import TestimonialsGrid from '../../common/TestimonialsGrid';
import ContactSection from '../../common/ContactSection';
import VisionMision from '../../common/VisionMision';

const WelcomeRoshiOriginal: React.FC = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-text-light relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(45, 45, 68, 0.15) 0%, transparent 50%),
          url('/assets/noise.png')
        `,
      }}
    >
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl "></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl " style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Sección: Inicio */}
      <section 
        id="inicio" 
        className="relative flex items-center justify-center h-screen bg-cover bg-center py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/90 to-transparent z-0"></div>
        <img 
          src="https://png.pngtree.com/background/20230827/original/pngtree-dark-fitness-room-with-training-equipment-and-black-dumbbells-on-the-picture-image_4839864.jpg"
          alt="Gimnasio Roshi Fit Club" 
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-40"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-text-light mb-6 " 
              style={{ 
                textShadow: '0 0 30px rgba(255, 107, 53, 0.8), 0 0 60px rgba(255, 107, 53, 0.4)',
                letterSpacing: '0.05em'
              }}>
            Roshi Fit Club
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed font-light tracking-wide">
            Bienvenido al dojo donde la fuerza y la disciplina se encuentran. Aquí comienza tu verdadera transformación.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#planes" className="px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-xl text-base-theme transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/50">
              Ver Planes
            </a>
            <a href="#contacto" className="px-8 py-4 bg-transparent text-text-light font-bold rounded-xl border-2 border-accent transition-all duration-300 hover:bg-accent/20 hover:border-primary backdrop-blur-sm">
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* Sección: Servicios */}
      <section id="servicios" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
                WebkitTextStroke: '2px rgba(255, 107, 53, 0.3)'
              }}>
            NUESTROS SERVICIOS
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Descubre todo lo que Roshi Fit Club tiene para ofrecerte en tu camino hacia la excelencia.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-7xl mx-auto p-8 rounded-[66px] relative"
               style={{
                 background: 'linear-gradient(315deg, rgba(69, 62, 59, 0.9), rgba(46, 40, 39, 0.9))',
                 boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.05)',
                 border: '1px solid rgba(255, 107, 53, 0.1)'
               }}>
            <ServicesCarousel />
          </div>
        </div>
      </section>
      
            {/* Sección: Planes */}
      <section id="planes" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
                WebkitTextStroke: '2px rgba(255, 107, 53, 0.3)'
              }}>
            ELIGE TU PLAN DE BATALLA
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Tenemos una membresía perfecta diseñada para alcanzar tus objetivos más ambiciosos.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-7xl mx-auto p-8 rounded-[66px] relative"
               style={{
                 background: 'linear-gradient(315deg, rgba(69, 62, 59, 0.9), rgba(46, 40, 39, 0.9))',
                 boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.05)',
                 border: '1px solid rgba(255, 107, 53, 0.1)'
               }}>
            <PlansCarousel />
          </div>
        </div>
      </section>


      {/* Sección: Productos */}
      <section id="productos" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
                WebkitTextStroke: '2px rgba(255, 107, 53, 0.3)'
              }}>
            PRODUCTOS MÁS VENDIDOS
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Equípate con lo mejor para llevar tu entrenamiento al siguiente nivel de rendimiento.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-7xl mx-auto p-8 rounded-[66px] relative"
               style={{
                 background: 'linear-gradient(315deg, rgba(69, 62, 59, 0.9), rgba(46, 40, 39, 0.9))',
                 boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.05)',
                 border: '1px solid rgba(255, 107, 53, 0.1)'
               }}>
            <TopProductsCarousel />
          </div>
        </div>
      </section>

      {/* Sección: Equipos */}
      <section id="equipos" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
                WebkitTextStroke: '2px rgba(255, 107, 53, 0.3)'
              }}>
            NUESTRO ARSENAL DE EQUIPOS
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Máquinas de última generación diseñadas para un rendimiento superior y resultados excepcionales.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-7xl mx-auto p-8 rounded-[66px] relative"
               style={{
                 background: 'linear-gradient(315deg, rgba(69, 62, 59, 0.9), rgba(46, 40, 39, 0.9))',
                 boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.05)',
                 border: '1px solid rgba(255, 107, 53, 0.1)'
               }}>
            <EquipmentCarousel />
          </div>
        </div>
      </section>

      {/* Sección: Galería */}
      <section id="galeria" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
                WebkitTextStroke: '2px rgba(255, 107, 53, 0.3)'
              }}>
            GALERÍA DEL DOJO
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Un vistazo inspirador a nuestra comunidad vibrante y nuestras instalaciones de élite.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-7xl mx-auto p-8 rounded-[66px] relative"
               style={{
                 background: 'linear-gradient(315deg, rgba(69, 62, 59, 0.9), rgba(46, 40, 39, 0.9))',
                 boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.05)',
                 border: '1px solid rgba(255, 107, 53, 0.1)'
               }}>
            <GalleryGrid />
          </div>
        </div>
      </section>

      {/* Sección: Testimonios */}
      <section id="testimonios" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
                WebkitTextStroke: '2px rgba(255, 107, 53, 0.3)'
              }}>
            VOCES DE NUESTROS GUERREROS
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Descubre las historias de transformación y éxito de quienes ya son parte de nuestra familia.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-7xl mx-auto">
            <TestimonialsGrid />
          </div>
        </div>
      </section>

      {/* Sección: Horarios */}
      <section id="horarios" className="min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 mb-6 tracking-wider " 
              style={{ 
                textShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 0 80px rgba(255, 107, 53, 0.3)',
                fontWeight: '900',
                letterSpacing: '0.15em',
              }}>
            HORARIOS DE ENTRENAMIENTO
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light italic">
            Encuentra el momento perfecto para entrenar y alcanzar tu máximo potencial.
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16 shadow-lg shadow-primary/50"></div>
          <div className="max-w-2xl mx-auto p-8 rounded-[66px] relative"
               style={{
                 background: 'linear-gradient(315deg, rgba(69, 62, 59, 0.9), rgba(46, 40, 39, 0.9))',
                 boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.05)',
                 border: '1px solid rgba(255, 107, 53, 0.1)'
               }}>
            <GeneralSchedule />
          </div>
        </div>
      </section>

      {/* Sección: Filosofía (Visión y Misión) */}
      <section id="filosofia" className="relative min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="w-full">
          <VisionMision />
        </div>
      </section>

      {/* Sección: Contacto */}
      <section id="contacto" className="relative min-h-[100vh] flex items-center py-24 md:py-32 lg:py-40">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent"></div>
        <div className="w-full">
          <ContactSection />
        </div>
      </section>
        
    </div>
  );
};

export default WelcomeRoshiOriginal;