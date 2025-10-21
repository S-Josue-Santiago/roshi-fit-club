import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Crear Nuevo Usuario</h2>
          <button
            onClick={onClose}
            className="text-dashboard-text hover:text-dashboard-primary text-2xl"
          >
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Nombre */}
          <input
            name="nombre_completo"
            placeholder="Nombre Completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              minLength={6}
              required
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-dashboard-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Rol */}
          <select
            name="tipo_usuario"
            value={formData.tipo_usuario}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          >
            <option value="cliente">Cliente</option>
            <option value="entrenador">Entrenador</option>
            <option value="admin">Administrador</option>
          </select>

          {formData.tipo_usuario === 'cliente' && (
            <>
              {/* Plan */}
              <select
                name="plan_id"
                value={formData.plan_id}
                onChange={handleChange}
                required
                className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
              >
                <option value="">Selecciona un plan</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - Q{parseFloat(plan.precio_q.toString()).toFixed(2)}
                  </option>
                ))}
              </select>

              {/* Método de pago */}
              <select
                name="metodo_pago_id"
                value={formData.metodo_pago_id}
                onChange={handleChange}
                required
                className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
              >
                <option value="">Selecciona método de pago</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.nombre}
                  </option>
                ))}
              </select>

              {/* Campos dinámicos */}
              {selectedMethod && (
                <div className="p-3 bg-dashboard-accent/50 rounded border border-dashboard-accent">
                  <h5 className="font-semibold text-dashboard-text mb-2">Detalles de {selectedMethod.nombre}</h5>
                  {selectedMethod.id === 1 && (
                    <>
                      <input
                        name="numero_tarjeta"
                        placeholder="Número de Tarjeta"
                        value={formData.numero_tarjeta}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded mt-2"
                      />
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <input
                          name="mes_expiracion"
                          placeholder="Mes (MM)"
                          value={formData.mes_expiracion}
                          onChange={handleChange}
                          required
                          className="p-2 bg-dashboard-bg text-dashboard-text rounded"
                        />
                        <input
                          name="anio_expiracion"
                          placeholder="Año (AA)"
                          value={formData.anio_expiracion}
                          onChange={handleChange}
                          required
                          className="p-2 bg-dashboard-bg text-dashboard-text rounded"
                        />
                      </div>
                      <input
                        name="cvv"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded mt-2"
                      />
                    </>
                  )}
                  {selectedMethod.id === 4 && (
                    <input
                      name="paypal_email"
                      type="email"
                      placeholder="Email de PayPal"
                      value={formData.paypal_email}
                      onChange={handleChange}
                      required
                      className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded mt-2"
                    />
                  )}
                </div>
              )}

              {selectedPlan && (
                <div className="text-center py-2 border-t border-dashboard-accent">
                  <p className="text-dashboard-primary font-bold">
                    Total a Pagar: Q{parseFloat(selectedPlan.precio_q.toString()).toFixed(2)}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;