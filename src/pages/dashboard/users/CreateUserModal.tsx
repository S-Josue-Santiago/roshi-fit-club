import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Save, User, Mail, Key, Shield, CreditCard, DollarSign } from 'lucide-react';
import {
  createUserWithSubscription,
  createStaffUser
} from '../../../api/userApi';
import { fetchPlansForRegistration } from '../../../api/planApi';
import { fetchActivePaymentMethods } from '../../../api/paymentMethodApi';
import type { Plan } from '../../../types/Plan';
import type { PaymentMethod } from '../../../types/PaymentMethod';
import type { AdminCreateUserWithSubscriptionParams, StaffCreateParams } from '../../../types/User';

interface CreateUserModalProps {
  onClose: () => void;
  onCreateSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    contrasena: '',
    tipo_usuario: 'cliente' as 'cliente' | 'entrenador' | 'admin',
    plan_id: 0,
    metodo_pago_id: 0,
    numero_tarjeta: '',
    cvv: '',
    mes_expiracion: '',
    anio_expiracion: '',
    paypal_email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    Promise.all([
      fetchPlansForRegistration(),
      fetchActivePaymentMethods()
    ]).then(([p, m]) => {
      setPlans(p);
      setPaymentMethods(m);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'metodo_pago_id' || name === 'plan_id'
        ? value === '' ? 0 : parseInt(value, 10)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (formData.tipo_usuario === 'cliente') {
        if (!formData.plan_id) {
          setError('Selecciona un plan de suscripción.');
          return;
        }
        const metodoId = formData.metodo_pago_id;
        if (!metodoId) {
          setError('Selecciona un método de pago.');
          return;
        }

        if (metodoId === 1) {
          if (!formData.numero_tarjeta || !formData.cvv || !formData.mes_expiracion || !formData.anio_expiracion) {
            setError('Completa todos los datos de la tarjeta.');
            return;
          }
        } else if (metodoId === 4) {
          if (!formData.paypal_email) {
            setError('Ingresa tu email de PayPal.');
            return;
          }
        }

        let detalles_pago: Record<string, any> = {};
        if (metodoId === 1) {
          detalles_pago = {
            numero_tarjeta: formData.numero_tarjeta,
            cvv: formData.cvv,
            mes_expiracion: formData.mes_expiracion,
            anio_expiracion: formData.anio_expiracion
          };
        } else if (metodoId === 4) {
          detalles_pago = { paypal_email: formData.paypal_email };
        } else {
          detalles_pago = { metodo: 'efectivo' };
        }

        const payload: AdminCreateUserWithSubscriptionParams = {
          nombre_completo: formData.nombre_completo,
          email: formData.email,
          contrasena: formData.contrasena,
          plan_id: formData.plan_id,
          metodo_pago_id: metodoId,
          detalles_pago
        };

        await createUserWithSubscription(payload);
      } else {
        const staffPayload: StaffCreateParams = {
          nombre_completo: formData.nombre_completo,
          email: formData.email,
          contrasena: formData.contrasena,
          tipo_usuario: formData.tipo_usuario,
        };
        await createStaffUser(staffPayload);
      }

      onCreateSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el usuario.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === formData.plan_id);
  const selectedMethod = paymentMethods.find(m => m.id === formData.metodo_pago_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4  text-white">
      <div
        className="bg-dashboard-accent/95 p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <User size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">CREAR NUEVO USUARIO</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda - Información Básica */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-dashboard-text border-b border-dashboard-accent/30 pb-2">
                Información Básica
              </h3>
              
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <User size={16} className="text-cyan-400" />
                  NOMBRE COMPLETO
                </label>
                <input
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                  "
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-cyan-400" />
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                  "
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Key size={16} className="text-cyan-400" />
                  CONTRASEÑA
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    minLength={6}
                    required
                    className="
                      w-full p-4 pr-12 bg-dashboard-bg text-dashboard-text 
                      rounded-xl border-2 border-dashboard-accent/50
                      focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                      hover:border-cyan-400/50 transition-all duration-300
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-3 top-1/2 transform -translate-y-1/2
                      text-dashboard-text-secondary hover:text-cyan-400
                      p-1 rounded-lg transition-all duration-300
                      hover:bg-cyan-400/10
                    "
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Tipo de Usuario */}
              <div>
                <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-cyan-400" />
                  TIPO DE USUARIO
                </label>
                <select
                  name="tipo_usuario"
                  value={formData.tipo_usuario}
                  onChange={handleChange}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                    cursor-pointer bg-black
                  "
                >
                  <option value="cliente">Cliente</option>
                  <option value="entrenador">Entrenador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            {/* Columna Derecha - Suscripción y Pago (solo para clientes) */}
            {formData.tipo_usuario === 'cliente' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-dashboard-text border-b border-dashboard-accent/30 pb-2">
                  Suscripción y Pago
                </h3>

                {/* Plan */}
                <div>
                  <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    PLAN DE SUSCRIPCIÓN
                  </label>
                  <select
                    name="plan_id"
                    value={formData.plan_id}
                    onChange={handleChange}
                    required
                    className="
                      w-full p-4 bg-dashboard-bg text-dashboard-text 
                      rounded-xl border-2 border-dashboard-accent/50
                      focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                      hover:border-green-400/50 transition-all duration-300
                      cursor-pointer bg-black
                    "
                  >
                    <option value="">Selecciona un plan</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.nombre} - Q{parseFloat(plan.precio_q.toString()).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-green-400" />
                    MÉTODO DE PAGO
                  </label>
                  <select
                    name="metodo_pago_id"
                    value={formData.metodo_pago_id}
                    onChange={handleChange}
                    required
                    className="
                      w-full p-4 bg-dashboard-bg text-dashboard-text 
                      rounded-xl border-2 border-dashboard-accent/50
                      focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                      hover:border-green-400/50 transition-all duration-300
                      cursor-pointer bg-black
                    "
                  >
                    <option value="">Selecciona método de pago</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campos de Pago Dinámicos */}
                {selectedMethod && (
                  <div className="p-4 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50">
                    <h5 className="font-bold text-dashboard-text mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-green-400" />
                      DETALLES DE {selectedMethod.nombre.toUpperCase()}
                    </h5>
                    {selectedMethod.id === 1 && (
                      <div className="space-y-3">
                        <input
                          name="numero_tarjeta"
                          placeholder="Número de Tarjeta"
                          value={formData.numero_tarjeta}
                          onChange={handleChange}
                          required
                          className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-lg border border-dashboard-accent/50"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            name="mes_expiracion"
                            placeholder="Mes (MM)"
                            value={formData.mes_expiracion}
                            onChange={handleChange}
                            required
                            className="p-3 bg-dashboard-bg text-dashboard-text rounded-lg border border-dashboard-accent/50"
                          />
                          <input
                            name="anio_expiracion"
                            placeholder="Año (AA)"
                            value={formData.anio_expiracion}
                            onChange={handleChange}
                            required
                            className="p-3 bg-dashboard-bg text-dashboard-text rounded-lg border border-dashboard-accent/50"
                          />
                        </div>
                        <input
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-lg border border-dashboard-accent/50"
                        />
                      </div>
                    )}
                    {selectedMethod.id === 4 && (
                      <input
                        name="paypal_email"
                        type="email"
                        placeholder="Email de PayPal"
                        value={formData.paypal_email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-lg border border-dashboard-accent/50"
                      />
                    )}
                  </div>
                )}

                {/* Total */}
                {selectedPlan && (
                  <div className="text-center py-3 border-2 border-green-500/30 rounded-xl bg-green-500/10">
                    <p className="text-green-400 font-black text-lg">
                      TOTAL A PAGAR: Q{parseFloat(selectedPlan.precio_q.toString()).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-dashboard-accent/50">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 px-6 py-3 text-dashboard-text font-bold
                border-2 border-dashboard-accent/50 rounded-xl
                hover:border-red-400 hover:text-red-400 hover:bg-red-400/10
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2
              "
            >
              <X size={18} />
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 
                text-white font-bold rounded-xl 
                hover:from-green-700 hover:to-green-800
                disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  CREANDO USUARIO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  CREAR USUARIO
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;