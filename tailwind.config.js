// tailwind.config.js (Raíz)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css", // Asegúrate de que esta línea esté aquí
  ],
  theme: {
    extend: {
      colors: {
        // ESTO ES LO CRÍTICO: DEBEN ESTAR TODAS LAS VARIABLES AQUÍ
        primary: 'var(--primary)', 
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        gold: 'var(--gold)',
        'text-light': 'var(--text-light)',
        'text-gray': 'var(--text-gray)',

          dashboard: {
          bg: 'var(--dashboard-bg)',
          sidebar: 'var(--dashboard-sidebar)',
          text: 'var(--dashboard-text)',
          'text-secondary': 'var(--dashboard-text-secondary)',
          primary: 'var(--dashboard-primary)',
          secondary: 'var(--dashboard-secondary)',
          accent: 'var(--dashboard-accent)',
  }
      },

           backgroundImage: {
        'gym-hero': "url('https://st4.depositphotos.com/23254502/24776/i/450/depositphotos_247766330-stock-photo-workout-gym-cross-fit-equipment.jpg')",
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
      },
      animation: {
        neon: 'neon 2s ease-in-out infinite alternate',
      },
    },

    
  },
  plugins: [],
}