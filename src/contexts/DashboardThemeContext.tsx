// roshi_fit/src/contexts/DashboardThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

type DashboardTheme = 'nocturno' | 'amanecer';

interface DashboardThemeContextProps {
  theme: DashboardTheme;
  toggleTheme: () => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextProps | undefined>(undefined);

export const DashboardThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<DashboardTheme>('nocturno');

  useEffect(() => {
    const body = document.body;
    // Eliminar clases de tema público si existen
    body.classList.remove('theme-original', 'theme-futurista');
    // Aplicar clase de tema del dashboard
    body.className = body.className.replace(/theme-dashboard-\w+/g, '').trim();
    body.classList.add(`theme-dashboard-${theme}`);
    // Aplicar estilos base
    body.style.backgroundColor = 'var(--dashboard-bg)';
    body.style.color = 'var(--dashboard-text)';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'nocturno' ? 'amanecer' : 'nocturno');
  };

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
};

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
  }
  return context;
};