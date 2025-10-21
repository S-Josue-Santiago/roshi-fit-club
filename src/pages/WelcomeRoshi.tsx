

// roshi_fit/src/pages/WelcomeRoshi.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import WelcomeRoshiFuturista from '../components/temas/Futurista/WelcomeRoshiFuturista';
import WelcomeRoshiOriginal from '../components/temas/Original/WelcomeRoshiOriginal';

const WelcomeRoshi: React.FC = () => {
  const { theme } = useTheme();
  return theme === 'futurista' ? <WelcomeRoshiFuturista /> : <WelcomeRoshiOriginal />;
};

export default WelcomeRoshi;