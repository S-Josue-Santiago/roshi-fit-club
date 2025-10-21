// roshi_fit/src/components/auth/RegisterFormWithPayment.tsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { fetchPlansForRegistration } from '../../api/planApi';
import { fetchActivePaymentMethods } from '../../api/paymentMethodApi';
import { type Plan } from '../../types/Plan';
import { type PaymentMethod } from '../../types/PaymentMethod';
import { registerUserWithPlan } from '../../api/userApi';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

const RegisterFormWithPayment: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    contrasena: '',
    confirmar_contrasena: '',
    plan_id: '',
    metodo_pago_id: '',
    // Campos dinámicos
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
      // ✅ Filtrar solo Tarjeta (ID=1) y PayPal (ID=4)
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

    // Construir detalles_pago según el método
    let detalles_pago: Record<string, any> = {};
    if (metodoId === 1) {
      // Tarjeta
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
      // PayPal
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      <h3 className="text-xl font-semibold text-text-light mb-2">Registro Completo</h3>

      {error && <div className="bg-red-800 text-red-200 p-2 rounded">{error}</div>}

      {/* Datos personales */}
      <div className="space-y-3">
        <h4 className="font-bold text-primary">Datos Personales</h4>
        <input
          name="nombre_completo"
          placeholder="Nombre Completo"
          value={formData.nombre_completo}
          onChange={handleChange}
          required
          className="w-full p-2 bg-secondary border border-accent rounded text-text-light"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-secondary border border-accent rounded text-text-light"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full p-2 bg-secondary border border-accent rounded text-text-light pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-text-gray">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmar_contrasena"
            placeholder="Confirmar Contraseña"
            value={formData.confirmar_contrasena}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full p-2 bg-secondary border border-accent rounded text-text-light pr-10"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-2 text-text-gray">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="space-y-3">
        <h4 className="font-bold text-primary">Plan de Suscripción</h4>
        {loading ? (
          <p className="text-text-gray">Cargando...</p>
        ) : (
          <select
            name="plan_id"
            value={formData.plan_id}
            onChange={handleChange}
            required
            className="w-full p-2 bg-secondary border border-accent rounded text-text-light bg-black"
          >
            <option value="">Selecciona un plan</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.nombre} - Q{parseFloat(plan.precio_q.toString()).toFixed(2)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Método de pago */}
      <div className="space-y-3">
        <h4 className="font-bold text-primary">Método de Pago</h4>
        {loading ? (
          <p className="text-text-gray">Cargando...</p>
        ) : (
          <select
            name="metodo_pago_id"
            value={formData.metodo_pago_id}
            onChange={handleChange}
            required
            className="w-full p-2 bg-secondary border border-accent rounded text-text-light bg-black"
          >
            <option value="">Selecciona un método</option>
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.nombre}
              </option>
            ))}
          </select>
        )}

        {/* Campos dinámicos */}
        {selectedMethod && (
          <div className="mt-3 p-3 bg-accent/30 rounded border border-accent">
            <h5 className="font-semibold text-text-light mb-2">Detalles de {selectedMethod.nombre}</h5>
            {selectedMethod.id === 1 && (
              <>
                <input
                  name="numero_tarjeta"
                  placeholder="Número de Tarjeta"
                  value={formData.numero_tarjeta}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-secondary border border-accent rounded text-text-light mt-2"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    name="mes_expiracion"
                    placeholder="Mes (MM)"
                    value={formData.mes_expiracion}
                    onChange={handleChange}
                    required
                    className="p-2 bg-secondary border border-accent rounded text-text-light"
                  />
                  <input
                    name="anio_expiracion"
                    placeholder="Año (AA)"
                    value={formData.anio_expiracion}
                    onChange={handleChange}
                    required
                    className="p-2 bg-secondary border border-accent rounded text-text-light"
                  />
                </div>
                <input
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-secondary border border-accent rounded text-text-light mt-2"
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
                className="w-full p-2 bg-secondary border border-accent rounded text-text-light mt-2"
              />
            )}
          </div>
        )}
      </div>

      {/* Total */}
      {selectedPlan && (
        <div className="text-center py-3 border-t border-accent">
          <p className="text-gold font-bold">Total a Pagar: Q{parseFloat(selectedPlan.precio_q.toString()).toFixed(2)}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-primary hover:bg-gold py-2 rounded font-bold"
      >
        Confirmar Registro y Pago
      </button>

      <div className="text-center mt-4">
        <span className="text-text-gray">¿Ya tienes cuenta? </span>
        <button
          type="button"
          onClick={onGoToLogin}
          className="text-accent hover:text-gold"
        >
          Inicia sesión aquí
        </button>
      </div>
    </form>
  );
};

export default RegisterFormWithPayment;