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
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
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