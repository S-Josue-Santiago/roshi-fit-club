import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
type Theme = 'original' | 'futurista';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('original'); 

  useEffect(() => {
    const body = document.body;
    
    // 1. Limpia las clases de tema anteriores
    body.classList.remove('theme-original', 'theme-futurista');
    
    // 2. Aplica la clase de tema (la clase base del tema YA tiene las variables de color)
    body.classList.add(theme === 'original' ? 'theme-original' : 'theme-futurista');
    
    // 3. Aplicar estilos base al body
    body.style.backgroundColor = 'var(--secondary)';
    body.style.color = 'var(--text-light)';
    
  }, [theme]);
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const toggleTheme = () => {
      setThemeState(currentTheme => (currentTheme === 'original' ? 'futurista' : 'original'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};