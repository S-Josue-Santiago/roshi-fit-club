// roshi_fit/src/components/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, type LoginCredentials } from '../../api/authApi';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void; // Nueva prop para ir al registro
}

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const bodyClass = document.body.className;
      
      if (savedTheme === 'futurista' || bodyClass.includes('futurista')) {
        setTheme('futurista');
      } else {
        setTheme('original');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(formData);
      
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.usuario));

      const rolePath = response.usuario.tipo === 'admin' 
        ? '/dashboard/admin'
        : response.usuario.tipo === 'entrenador'
        ? '/dashboard/entrenador'
        : '/dashboard/cliente';

      navigate(rolePath);
      onLoginSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'futurista') {
      return {
        container: 'w-full max-w-md mx-auto p-8 rounded-3xl',
        containerStyle: {
          background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.95), rgba(240, 244, 248, 0.95))',
          boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.2)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        title: 'text-3xl md:text-4xl font-black mb-6 text-center tracking-wider',
        titleStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
          backgroundClip: 'text',
          WebkitTextFillColor: 'white',
          filter: 'drop-shadow(0 0 15px rgba(0, 120, 255, 0.3))'
        },
        label: 'block text-sm font-bold text-gray-700 mb-2',
        inputContainer: 'relative',
        input: 'w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 font-medium transition-all duration-300 focus:outline-none focus:ring-2',
        inputStyle: {
          background: 'linear-gradient(315deg, #ffffff, #f8fafc)',
          boxShadow: 'inset -4px -4px 8px rgba(255, 255, 255, 0.8), inset 4px 4px 8px rgba(0, 120, 255, 0.1)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        inputFocusRing: 'ring-blue-400',
        icon: 'absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500',
        button: 'w-full py-4 rounded-xl font-black text-white text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        buttonStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          boxShadow: '0 8px 25px rgba(0, 120, 255, 0.4), -4px -4px 12px rgba(0, 212, 255, 0.2), 4px 4px 12px rgba(0, 120, 255, 0.5)'
        },
        linkText: 'text-gray-600 text-sm',
        linkButton: 'text-blue-600 hover:text-blue-700 font-bold underline transition-colors duration-300',
        errorContainer: 'rounded-xl p-4 mb-4 flex items-start gap-3',
        errorStyle: {
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.1)'
        },
        errorText: 'text-red-700 font-medium flex-1'
      };
    }
    
    // Tema Original (Oscuro)
    return {
      container: 'w-full max-w-md mx-auto p-8 rounded-3xl ',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      title: 'text-3xl md:text-4xl font-black mb-6 text-center tracking-wider text-ambar-300',
      titleStyle: {
        background: 'linear-gradient(135deg, #ff6b35, #ff8c42, #ffa742)',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.4))'
      },
      label: 'block text-sm font-bold text-gray-300 mb-2',
      inputContainer: 'relative',
      input: 'w-full pl-12 pr-4 py-3 rounded-xl text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2',
      inputStyle: {
        background: 'linear-gradient(315deg, rgba(35, 35, 35, 0.9), rgba(45, 45, 45, 0.9))',
        boxShadow: 'inset -4px -4px 8px rgba(20, 20, 20, 0.8), inset 4px 4px 8px rgba(60, 60, 60, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      inputFocusRing: 'ring-orange-400',
      icon: 'absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400',
      button: 'w-full py-4 rounded-xl font-black text-white text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      buttonStyle: {
        background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), -4px -4px 12px rgba(255, 140, 66, 0.2), 4px 4px 12px rgba(255, 107, 53, 0.5)'
      },
      linkText: 'text-gray-400 text-sm',
      linkButton: 'text-orange-400 hover:text-orange-300 font-bold underline transition-colors duration-300',
      errorContainer: 'rounded-xl p-4 mb-4 flex items-start gap-3',
      errorStyle: {
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))',
        border: '2px solid rgba(239, 68, 68, 0.4)',
        boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.1)'
      },
      errorText: 'text-red-300 font-medium flex-1'
    };
  };

  const styles = getStyles();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className={styles.title} style={styles.titleStyle}>
          INICIO DE SESIÓN
        </h3>

        {error && (
          <div className={styles.errorContainer} style={styles.errorStyle}>
            <AlertCircle className="flex-shrink-0 mt-0.5" size={20} style={{ color: theme === 'futurista' ? '#dc2626' : '#fca5a5' }} />
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div>
          <label className={styles.label}>Email</label>
          <div className={styles.inputContainer}>
            <Mail className={styles.icon} size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              className={`${styles.input} ${styles.inputFocusRing}`}
              style={styles.inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>Contraseña</label>
          <div className={styles.inputContainer}>
            <Lock className={styles.icon} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={`${styles.input} ${styles.inputFocusRing} pr-12`}
              style={styles.inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword 
                ? <EyeOff size={20} style={{ color: theme === 'futurista' ? '#0078ff' : '#ff8c42' }} /> 
                : <Eye size={20} style={{ color: theme === 'futurista' ? '#9ca3af' : '#9ca3af' }} />
              }
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
          style={styles.buttonStyle}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Ingresando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LogIn size={20} />
              Ingresar
            </span>
          )}
        </button>

        <div className="text-center mt-6 pt-6 border-t" style={{ borderColor: theme === 'futurista' ? 'rgba(0, 120, 255, 0.2)' : 'rgba(255, 107, 53, 0.2)' }}>
          <span className={styles.linkText}>¿No tienes cuenta? </span>
          <button
            type="button" // Mantener como type="button" para evitar submit del formulario
            onClick={onGoToRegister}
            className={styles.linkButton}
          >
            Regístrate aquí
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;