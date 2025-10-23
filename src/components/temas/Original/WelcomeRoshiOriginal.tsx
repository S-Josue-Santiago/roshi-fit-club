// roshi_fit/src/components/temas/Original/WelcomeRoshiOriginal.tsx
import React from 'react';

// import { Link } from 'react-router-dom'
import ServicesCarousel from '../../common/ServicesCarousel';
import PlansCarousel from '../../common/PlansCarousel';
import GeneralSchedule from '../../common/GeneralSchedule';
import TopProductsCarousel from '../../common/TopProductsCarousel';
import EquipmentCarousel from '../../common/EquipmentCarousel';
import GalleryGrid from '../../common/GalleryGrid';
import TestimonialsGrid from '../../common/TestimonialsGrid';
import ContactSection from '../../common/ContactSection';
// import Shuffle from '../../../TextAnimations/Shuffle/Shuffle';
// import Beams from '../../../Backgrounds/Beams/Beams';

const WelcomeRoshiOriginal: React.FC = () => {
  return (
    <div style={{ width: '100%', position: 'relative', minHeight: '100vh' }}>
      {/* Fondo fijo con Beams */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        /> */}
      </div>

      {/* Contenido principal sobre el fondo */}
      <div className="min-h-screen bg-secondary/80 text-text-light" style={{ position: 'relative', zIndex: 1 }}>
        {/* Sección: Inicio */}
        <section id="inicio" className="py-20 px-4 text-center relative">
          <img 
            src="https://png.pngtree.com/background/20230827/original/pngtree-dark-fitness-room-with-training-equipment-and-black-dumbbells-on-the-picture-image_4839864.jpg"
            alt="" 
            className="absolute inset-0 w-full h-full object-cover -z-10"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            {/* <Shuffle
              text="Roshi Fit Club"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            /> */}
          </h2>
          <p className="text-text-gray max-w-2xl mx-auto">
            Bienvenido al dojo clásico de Roshi Fit Club. Aquí comienza tu transformación.
          </p>
        </section>

        {/* Sección: Servicios */}
        <section id="servicios" className="py-20 px-4 bg-accent/30">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Servicios</h2>
          <div className="max-w-6xl mx-auto px-4">
            <ServicesCarousel />
          </div>
        </section>

        {/* Sección: Planes */}
        <section id="planes" className="py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Planes</h2>
          <div className="max-w-6xl mx-auto px-4">
            <PlansCarousel />
          </div>
        </section>

        {/* Sección: Productos */}
        <section id="productos" className="py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Productos Más Vendidos</h2>
          <div className="max-w-6xl mx-auto px-4">
            <TopProductsCarousel />
          </div>
        </section>

        <section id="equipos" className="py-20 px-4 bg-accent/30">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Nuestro Arsenal</h2>
          <div className="max-w-6xl mx-auto px-4">
            <EquipmentCarousel />
          </div>
        </section>

        {/* Sección: Galería */}
        <section id="galeria" className="py-20 px-4 bg-accent/30">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Galería</h2>
          <div className="max-w-7xl mx-auto px-4">
            <GalleryGrid />
          </div>
        </section>

        {/* Sección: Testimonios */}
        <section id="testimonios" className="py-20 px-4 bg-accent/30">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Testimonios</h2>
          <div className="max-w-7xl mx-auto px-4">
            <TestimonialsGrid />
          </div>
        </section>

                {/* Sección: Horarios */}
        <section id="horarios" className="py-20 px-4 bg-accent/30">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Horarios</h2>
          <div className="max-w-2xl mx-auto px-4">
            <GeneralSchedule />
          </div>
        </section>

        {/* Sección: Contacto */}
        <section id="contacto" className="py-0 px-0">
          <ContactSection />
        </section>
      </div>
    </div>
  );
};

export default WelcomeRoshiOriginal;