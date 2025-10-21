// roshi_fit/src/components/temas/Futurista/WelcomeRoshiFuturista.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeRoshiFuturista: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary text-text-light p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-neon tracking-wider text-primary">
          ROSHI FIT CLUB
        </h1>
        <p className="text-xl md:text-2xl text-text-gray mb-8">
          Bienvenido al dojo del futuro. Aquí no entrenas... <span className="text-gold">evolucionas</span>.
        </p>
        <div className="bg-accent/40 backdrop-blur-sm p-6 rounded-xl border border-primary/30 shadow-lg">
          <p className="text-lg mb-4">
            Sistema de autenticación listo. Preparando conexión neural...
          </p>
          <Link
            to="/planes"
            className="inline-block px-6 py-3 bg-primary text-text-light font-bold rounded-full hover:bg-primary/80 transition-all shadow-lg shadow-primary/50"
          >
            Activar Plan (GTQ)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeRoshiFuturista;