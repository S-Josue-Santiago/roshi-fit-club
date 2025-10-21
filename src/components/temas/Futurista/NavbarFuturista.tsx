import React from 'react';
import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react'; // Solo importa Sun
import { type NavbarThemeProps } from '../../Navbar'; 

const NavbarFuturista: React.FC<NavbarThemeProps> = ({toggleTheme }) => {
    
    return (
        // 🚨 CAMBIO ESTRUCTURAL: Usamos 'backdrop-blur' para el efecto cristal cyberpunk
        <header className="fixed top-0 w-full z-50 shadow-2xl bg-secondary/80 backdrop-blur-md border-b border-primary/20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo Futurista: usa animación y color primario cian */}
                <Link to="/" className="text-3xl font-extrabold text-primary animate-neon tracking-wider">
                    ROS H I F I T
                </Link>

                {/* Botones de Acción y Tema */}
                <div className="flex items-center space-x-3">
                    {/* Botón Ingresar: Estilo de chip */}


                    {/* Botón de Cambio de Tema: Muestra el Sol (cambia al tema Original/día) */}
                    <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full transition-all text-gold hover:bg-accent/50"
                        title="Cambiar a Tema Original"
                    >
                        <Sun size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default NavbarFuturista;