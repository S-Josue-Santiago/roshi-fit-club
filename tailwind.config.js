// tailwind.config.js (Raíz)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        // VARIABLES ACTUALIZADAS CON EL NUEVO TEMA GYM
        primary: 'var(--primary)', 
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        gold: 'var(--gold)',
        'text-light': 'var(--text-light)',
        'text-gray': 'var(--text-gray)',
        success: 'var(--success)',
        warning: 'var(--warning)',

        // VARIABLES DASHBOARD MEJORADAS
        dashboard: {
          bg: 'var(--dashboard-bg)',
          sidebar: 'var(--dashboard-sidebar)',
          text: 'var(--dashboard-text)',
          'text-secondary': 'var(--dashboard-text-secondary)',
          primary: 'var(--dashboard-primary)',
          secondary: 'var(--dashboard-secondary)',
          accent: 'var(--dashboard-accent)',
          border: 'var(--dashboard-border)',
          hover: 'var(--dashboard-hover)',
        }
      },

      backgroundImage: {
        'gym-hero': "url('https://st4.depositphotos.com/23254502/24776/i/450/depositphotos_247766330-stock-photo-workout-gym-cross-fit-equipment.jpg')",
        'gradient-gym': 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      },

      fontSize: {
        // Nuevas utilidades de fuente basadas en el tema
        'xs-theme': 'var(--font-size-xs)',
        'sm-theme': 'var(--font-size-sm)',
        'base-theme': 'var(--font-size-base)',
        'lg-theme': 'var(--font-size-lg)',
        'xl-theme': 'var(--font-size-xl)',
        '2xl-theme': 'var(--font-size-2xl)',
        '3xl-theme': 'var(--font-size-3xl)',
      },

      keyframes: {
        neon: {
          '0%, 100%': {
            textShadow: '0 0 5px var(--primary), 0 0 10px var(--primary), 0 0 15px var(--primary)',
          },
          '50%': {
            textShadow: '0 0 2px var(--primary), 0 0 5px var(--primary), 0 0 8px var(--primary)',
          },
        },
        'pulse-gym': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(255, 71, 87, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 71, 87, 0.8)',
          },
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        neon: 'neon 2s ease-in-out infinite alternate',
        'pulse-gym': 'pulse-gym 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },

      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}