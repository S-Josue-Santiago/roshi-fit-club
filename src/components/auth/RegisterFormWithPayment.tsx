// roshi_fit/src/components/auth/RegisterFormWithPayment.tsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CreditCard, Calendar, Shield, DollarSign, AlertCircle } from 'lucide-react';
import { fetchPlansForRegistration } from '../../api/planApi';
import { fetchActivePaymentMethods } from '../../api/paymentMethodApi';
import { type Plan } from '../../types/Plan';
import { type PaymentMethod } from '../../types/PaymentMethod';
import { registerUserWithPlan } from '../../api/userApi';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
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

const RegisterFormWithPayment: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onGoToLogin }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    contrasena: '',
    confirmar_contrasena: '',
    plan_id: '',
    metodo_pago_id: '',
    numero_tarjeta: '',
    cvv: '',
    mes_expiracion: '',
    anio_expiracion: '',
    paypal_email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchPlansForRegistration(),
      fetchActivePaymentMethods()
    ]).then(([p, m]) => {
      const filteredMethods = m.filter(method => method.id === 1 || method.id === 4);
      setPlans(p);
      setPaymentMethods(filteredMethods);
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.contrasena !== formData.confirmar_contrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!formData.plan_id || !formData.metodo_pago_id) {
      setError('Selecciona un plan y un método de pago.');
      return;
    }

    const planId = parseInt(formData.plan_id);
    const metodoId = parseInt(formData.metodo_pago_id);

    let detalles_pago: Record<string, any> = {};
    if (metodoId === 1) {
      if (!formData.numero_tarjeta || !formData.cvv || !formData.mes_expiracion || !formData.anio_expiracion) {
        setError('Completa todos los datos de la tarjeta.');
        return;
      }
      detalles_pago = {
        numero_tarjeta: formData.numero_tarjeta,
        cvv: formData.cvv,
        mes_expiracion: formData.mes_expiracion,
        anio_expiracion: formData.anio_expiracion
      };
    } else if (metodoId === 4) {
      if (!formData.paypal_email) {
        setError('Ingresa tu email de PayPal.');
        return;
      }
      detalles_pago = {
        paypal_email: formData.paypal_email
      };
    }

    try {
      await registerUserWithPlan({
        nombre_completo: formData.nombre_completo,
        email: formData.email,
        contrasena: formData.contrasena,
        plan_id: planId,
        metodo_pago_id: metodoId,
        detalles_pago
      });
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    }
  };

  const selectedPlan = plans.find(p => p.id.toString() === formData.plan_id);
  const selectedMethod = paymentMethods.find(m => m.id.toString() === formData.metodo_pago_id);

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'futurista') {
      return {
        container: 'w-full max-w-2xl mx-auto p-8 rounded-3xl',
        containerStyle: {
          background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.95), rgba(240, 244, 248, 0.95))',
          boxShadow: '-16px -16px 32px rgba(255, 255, 255, 0.8), 16px 16px 32px rgba(0, 120, 255, 0.2)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        title: 'text-3xl md:text-4xl font-black mb-6 text-center tracking-wider',
        titleStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'white',
          filter: 'drop-shadow(0 0 15px rgba(0, 120, 255, 0.3))'
        },
        sectionTitle: 'text-lg font-black mb-3 flex items-center gap-2',
        sectionTitleStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'white'
        },
        label: 'block text-sm font-bold text-gray-700 mb-2',
        inputContainer: 'relative',
        input: 'w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 font-medium transition-all duration-300 focus:outline-none focus:ring-2',
        inputStyle: {
          background: 'linear-gradient(315deg, #ffffff, #f8fafc)',
          boxShadow: 'inset -4px -4px 8px rgba(255, 255, 255, 0.8), inset 4px 4px 8px rgba(0, 120, 255, 0.1)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        select: 'w-full px-4 py-3 rounded-xl text-gray-800 font-medium transition-all duration-300 focus:outline-none focus:ring-2',
        inputFocusRing: 'ring-blue-400',
        icon: 'absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500',
        button: 'w-full py-4 rounded-xl font-black text-white text-lg transition-all duration-300 transform hover:scale-105',
        buttonStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          boxShadow: '0 8px 25px rgba(0, 120, 255, 0.4), -4px -4px 12px rgba(0, 212, 255, 0.2), 4px 4px 12px rgba(0, 120, 255, 0.5)'
        },
        detailsContainer: 'mt-4 p-5 rounded-2xl',
        detailsStyle: {
          background: 'linear-gradient(135deg, rgba(0, 120, 255, 0.08), rgba(0, 212, 255, 0.08))',
          border: '2px solid rgba(0, 120, 255, 0.3)',
          boxShadow: 'inset 0 0 15px rgba(0, 120, 255, 0.05)'
        },
        totalContainer: 'text-center py-4 border-t-2 mt-6',
        totalBorder: 'rgba(0, 120, 255, 0.3)',
        totalText: 'text-blue-600 font-black text-2xl',
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
    
    return {
      container: 'w-full max-w-2xl mx-auto p-8 rounded-3xl',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-16px -16px 32px rgba(20, 20, 20, 0.8), 16px 16px 32px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      title: 'text-3xl md:text-4xl font-black mb-6 text-center tracking-wider',
      titleStyle: {
        background: 'linear-gradient(135deg, #ff6b35, #ff8c42, #ffa742)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'white',
        filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.4))'
      },
      sectionTitle: 'text-lg font-black mb-3 flex items-center gap-2',
      sectionTitleStyle: {
        background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'white'
      },
      label: 'block text-sm font-bold text-gray-300 mb-2',
      inputContainer: 'relative',
      input: 'w-full pl-12 pr-4 py-3 rounded-xl text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2',
      inputStyle: {
        background: 'linear-gradient(315deg, rgba(35, 35, 35, 0.9), rgba(45, 45, 45, 0.9))',
        boxShadow: 'inset -4px -4px 8px rgba(20, 20, 20, 0.8), inset 4px 4px 8px rgba(60, 60, 60, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      select: 'w-full px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2',
      inputFocusRing: 'ring-orange-400',
      icon: 'absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400',
      button: 'w-full py-4 rounded-xl font-black text-white text-lg transition-all duration-300 transform hover:scale-105',
      buttonStyle: {
        background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), -4px -4px 12px rgba(255, 140, 66, 0.2), 4px 4px 12px rgba(255, 107, 53, 0.5)'
      },
      detailsContainer: 'mt-4 p-5 rounded-2xl',
      detailsStyle: {
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.1))',
        border: '2px solid rgba(255, 107, 53, 0.3)',
        boxShadow: 'inset 0 0 15px rgba(255, 107, 53, 0.05)'
      },
      totalContainer: 'text-center py-4 border-t-2 mt-6',
      totalBorder: 'rgba(255, 107, 53, 0.3)',
      totalText: 'text-orange-400 font-black text-2xl',
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
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        <h3 className={styles.title} style={styles.titleStyle}>
          REGISTRO COMPLETO
        </h3>

        {error && (
          <div className={styles.errorContainer} style={styles.errorStyle}>
            <AlertCircle className="flex-shrink-0 mt-0.5" size={20} style={{ color: theme === 'futurista' ? '#dc2626' : '#fca5a5' }} />
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Datos personales */}
        <div className="space-y-4">
          <h4 className={styles.sectionTitle} style={styles.sectionTitleStyle}>
            <User size={20} />
            Datos Personales
          </h4>
          
          <div className={styles.inputContainer}>
            <User className={styles.icon} size={20} />
            <input
              name="nombre_completo"
              placeholder="Nombre Completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              className={`${styles.input} ${styles.inputFocusRing}`}
              style={styles.inputStyle}
            />
          </div>

          <div className={styles.inputContainer}>
            <Mail className={styles.icon} size={20} />
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={`${styles.input} ${styles.inputFocusRing}`}
              style={styles.inputStyle}
            />
          </div>

          <div className={styles.inputContainer}>
            <Lock className={styles.icon} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="contrasena"
              placeholder="Contraseña (mín. 6 caracteres)"
              value={formData.contrasena}
              onChange={handleChange}
              minLength={6}
              required
              className={`${styles.input} ${styles.inputFocusRing} pr-12`}
              style={styles.inputStyle}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
              style={{ color: theme === 'futurista' ? '#0078ff' : '#ff6b35' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className={styles.inputContainer}>
            <Lock className={styles.icon} size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmar_contrasena"
              placeholder="Confirmar Contraseña"
              value={formData.confirmar_contrasena}
              onChange={handleChange}
              minLength={6}
              required
              className={`${styles.input} ${styles.inputFocusRing} pr-12`}
              style={styles.inputStyle}
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
              style={{ color: theme === 'futurista' ? '#0078ff' : '#ff6b35' }}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Plan */}
        <div className="space-y-4">
          <h4 className={styles.sectionTitle} style={styles.sectionTitleStyle}>
            <DollarSign size={20} />
            Plan de Suscripción
          </h4>
          {loading ? (
            <p className={theme === 'futurista' ? 'text-gray-600' : 'text-gray-400'}>Cargando planes...</p>
          ) : (
            <select
              name="plan_id"
              value={formData.plan_id}
              onChange={handleChange}
              required
              className={`${styles.select} ${styles.inputFocusRing}`}
              style={styles.inputStyle}
            >
              <option className="text-black" value="">Selecciona un plan</option>
              {plans.map(plan => (
                <option className="text-black" key={plan.id} value={plan.id}>
                  {plan.nombre} - Q{parseFloat(plan.precio_q.toString()).toFixed(2)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Método de pago */}
        <div className="space-y-4">
          <h4 className={styles.sectionTitle} style={styles.sectionTitleStyle}>
            <CreditCard size={20} />
            Método de Pago
          </h4>
          {loading ? (
            <p className={theme === 'futurista' ? 'text-gray-600' : 'text-gray-400'}>Cargando métodos...</p>
          ) : (
            <select
              name="metodo_pago_id"
              value={formData.metodo_pago_id}
              onChange={handleChange}
              required
              className={`${styles.select} ${styles.inputFocusRing}`}
              style={styles.inputStyle}
            >
              <option className="text-black" value="">Selecciona un método</option>
              {paymentMethods.map(method => (
                <option className="text-black" key={method.id} value={method.id}>
                  {method.nombre}
                </option>
              ))}
            </select>
          )}

          {/* Campos dinámicos */}
          {selectedMethod && (
            <div className={styles.detailsContainer} style={styles.detailsStyle}>
              <h5 className="font-black mb-4" style={theme === 'futurista' ? { color: '#0078ff' } : { color: '#ff6b35' }}>
                Detalles de {selectedMethod.nombre}
              </h5>
              {selectedMethod.id === 1 && (
                <div className="space-y-3">
                  <div className={styles.inputContainer}>
                    <CreditCard className={styles.icon} size={20} />
                    <input
                      name="numero_tarjeta"
                      placeholder="Número de Tarjeta"
                      value={formData.numero_tarjeta}
                      onChange={handleChange}
                      required
                      className={`${styles.input} ${styles.inputFocusRing}`}
                      style={styles.inputStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={styles.inputContainer}>
                      <Calendar className={styles.icon} size={20} />
                      <input
                        name="mes_expiracion"
                        placeholder="Mes (MM)"
                        value={formData.mes_expiracion}
                        onChange={handleChange}
                        required
                        className={`${styles.input} ${styles.inputFocusRing}`}
                        style={styles.inputStyle}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <Calendar className={styles.icon} size={20} />
                      <input
                        name="anio_expiracion"
                        placeholder="Año (AA)"
                        value={formData.anio_expiracion}
                        onChange={handleChange}
                        required
                        className={`${styles.input} ${styles.inputFocusRing}`}
                        style={styles.inputStyle}
                      />
                    </div>
                  </div>
                  <div className={styles.inputContainer}>
                    <Shield className={styles.icon} size={20} />
                    <input
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      maxLength={4}
                      className={`${styles.input} ${styles.inputFocusRing}`}
                      style={styles.inputStyle}
                    />
                  </div>
                </div>
              )}
              {selectedMethod.id === 4 && (
                <div className={styles.inputContainer}>
                  <Mail className={styles.icon} size={20} />
                  <input
                    name="paypal_email"
                    type="email"
                    placeholder="Email de PayPal"
                    value={formData.paypal_email}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.inputFocusRing}`}
                    style={styles.inputStyle}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Total */}
        {selectedPlan && (
          <div className={styles.totalContainer} style={{ borderColor: styles.totalBorder }}>
            <p className={styles.totalText}>
              Total a Pagar: Q{parseFloat(selectedPlan.precio_q.toString()).toFixed(2)}
            </p>
          </div>
        )}

        <button
          type="submit"
          className={styles.button}
          style={styles.buttonStyle}
        >
          Confirmar Registro y Pago
        </button>

        <div className="text-center mt-6 pt-6 border-t-2" style={{ borderColor: styles.totalBorder }}>
          <span className={styles.linkText}>¿Ya tienes cuenta? </span>
          <button
            type="button"
            onClick={onGoToLogin}
            className={styles.linkButton}
          >
            Inicia sesión aquí
          </button>
        </div>
      </form>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'futurista' ? 'rgba(0, 120, 255, 0.1)' : 'rgba(255, 107, 53, 0.1)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'futurista' ? 'rgba(0, 120, 255, 0.5)' : 'rgba(255, 107, 53, 0.5)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'futurista' ? 'rgba(0, 120, 255, 0.7)' : 'rgba(255, 107, 53, 0.7)'};
        }
      `}</style>
    </div>
  );
};

export default RegisterFormWithPayment;