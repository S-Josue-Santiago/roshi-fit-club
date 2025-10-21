import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section id="inicio" className="h-[70vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("/assets/gym-hero.jpg")' }}> 
        <div className="text-center p-8 bg-black/50 rounded-lg">
          <h1 className="text-5xl font-extrabold mb-4 text-text-light">
            Roshi Fit Club
          </h1>
          <p className="text-xl text-text-light/80">
            Tu camino hacia la maestría física y mental.
          </p>
          <button className="mt-6 px-6 py-3 bg-primary text-text-light font-semibold rounded-full hover:bg-gold transition duration-300">
            Únete Hoy
          </button>
        </div>
      </section>

      {/* 2. SECCIÓN DE SERVICIOS (Carrusel) */}
      <section id="servicios" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Nuestros Servicios</h2>
        <div className="h-64 bg-accent/50 flex items-center justify-center rounded-xl">
          <p className="text-text-light/70">Espacio para Carrusel de Servicios, uno</p>
        </div>
      </section>

      {/* 3. SECCIÓN DE PLANES (Comparación) */}
      <section id="planes" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-primary">Elige tu Plan de Batalla</h2>
          <div className="h-96 bg-accent/70 flex items-center justify-center rounded-xl">
            <p className="text-text-light/70">Espacio para Comparación de Planes de Suscripción</p>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE PRODUCTOS (Tienda Integrada) */}
      <section id="productos" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Tienda Roshi Gear</h2>
        <div className="h-64 bg-accent/50 flex items-center justify-center rounded-xl">
          <p className="text-text-light/70">Espacio para Carrusel de Productos Destacados</p>
        </div>
      </section>

      {/* 5. SECCIÓN DE EQUIPOS (Carrusel) */}
      <section id="equipos" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-primary">Nuestro Arsenal de Equipos</h2>
          <div className="h-64 bg-accent/70 flex items-center justify-center rounded-xl">
            <p className="text-text-light/70">Espacio para Carrusel de Equipamiento</p>
          </div>
        </div>
      </section>
      
      {/* 6. SECCIÓN DE TESTIMONIOS (Carrusel) */}
      <section id="testimonios" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Testimonios de Maestros</h2>
        <div className="h-64 bg-accent/50 flex items-center justify-center rounded-xl">
          <p className="text-text-light/70">Espacio para Carrusel de Testimonios</p>
        </div>
      </section>

    </div>
  );
};

export default HomePage;