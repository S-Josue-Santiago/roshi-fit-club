// roshi_fit/src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, type LoginCredentials } from '../../api/authApi';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(formData);
      
      // Guardar en localStorage
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.usuario));

      // Redirigir según rol
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-text-light mb-2">Inicio de Sesión</h3>

      {error && <div className="bg-red-800 text-red-200 p-2 rounded">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-secondary border border-accent rounded text-text-light"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 bg-secondary border border-accent rounded text-text-light"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-gold py-2 rounded font-bold"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>

      <div className="text-center mt-4">
        <span className="text-text-gray">¿No tienes cuenta? </span>
        <button
          type="button"
          onClick={() => {/* Abrir modal de registro */}}
          className="text-accent hover:text-gold"
        >
          Regístrate aquí
        </button>
      </div>
    </form>
  );
};

export default LoginForm;