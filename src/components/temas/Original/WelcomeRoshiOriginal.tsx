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




const WelcomeRoshiOriginal: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary text-text-light">
      {/* Sección: Inicio */}
      {/* <section id="inicio" className="py-20 px-4 text-center bg-[image:url('https://tu-url-directa.jpg')] bg-cover bg-center bg-no-repeat"></section> */}
      <section id="inicio" className="py-20 px-4 text-center relative">
  <img 
    src="https://png.pngtree.com/background/20230827/original/pngtree-dark-fitness-room-with-training-equipment-and-black-dumbbells-on-the-picture-image_4839864.jpg"
    alt="" 
    className="absolute inset-0 w-full h-full object-cover -z-10"
  />
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Inicio</h2>
        <p className="text-text-gray max-w-2xl mx-auto">
          Bienvenido al dojo clásico de Roshi Fit Club. Aquí comienza tu transformación.
        </p>
      </section>

      {/* Sección: Servicios */}
      <section id="servicios" className="py-20 px-4 bg-accent/30">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center ">Servicios</h2>
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

      {/* Sección: Horarios */}
      <section id="horarios" className="py-20 px-4 bg-accent/30">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Horarios</h2>
        <div className="max-w-2xl mx-auto px-4">
          <GeneralSchedule />
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

      {/* Sección: Contacto */}
      <section id="contacto" className="py-0 px-0">
        <ContactSection />
      </section>
    </div>
  );
};

export default WelcomeRoshiOriginal;