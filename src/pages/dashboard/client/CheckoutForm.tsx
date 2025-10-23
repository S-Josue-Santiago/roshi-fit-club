// roshi_fit/src/pages/dashboard/client/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { fetchActivePaymentMethods } from '../../../api/paymentMethodApi';
import type { PaymentMethod } from '../../../types/PaymentMethod';

interface CheckoutFormProps {
  usuarioId: number;
  onBack: () => void;
  onCheckout: (data: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ usuarioId, onBack, onCheckout }) => {
  const [formData, setFormData] = useState({
    tipo_entrega: 'retiro' as 'retiro' | 'domicilio',
    direccion_entrega: '',
    metodo_pago_id: 1,
    // Campos de pago
    numero_tarjeta: '',
    cvv: '',
    mes_expiracion: '',
    anio_expiracion: '',
    paypal_email: '',
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    fetchActivePaymentMethods().then(setPaymentMethods);
  }, []);

  // Manejar cambio de método de pago y resetear campos
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethodId = parseInt(e.target.value);
    
    // Resetear campos según el método
    if (newMethodId === 1) {
      // Tarjeta de crédito - limpiar PayPal
      setFormData(prev => ({ 
        ...prev, 
        metodo_pago_id: newMethodId,
        paypal_email: '' 
      }));
    } else if (newMethodId === 4) {
      // PayPal - limpiar tarjeta
      setFormData(prev => ({ 
        ...prev, 
        metodo_pago_id: newMethodId,
        numero_tarjeta: '', 
        cvv: '', 
        mes_expiracion: '', 
        anio_expiracion: '' 
      }));
    } else {
      // Efectivo - limpiar todo
      setFormData(prev => ({ 
        ...prev, 
        metodo_pago_id: newMethodId,
        numero_tarjeta: '', 
        cvv: '', 
        mes_expiracion: '', 
        anio_expiracion: '',
        paypal_email: ''
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let detalles_pago: Record<string, any> = {};
    const metodoId = formData.metodo_pago_id;

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

    onCheckout({
      usuario_id: usuarioId,
      tipo_entrega: formData.tipo_entrega,
      direccion_entrega: formData.tipo_entrega === 'domicilio' ? formData.direccion_entrega : undefined,
      metodo_pago_id: metodoId,
      detalles_pago
    });
  };

  const selectedMethod = paymentMethods.find(m => m.id === formData.metodo_pago_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-2xl border border-dashboard-accent" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Finalizar Compra</h2>
          <button onClick={onBack} className="text-dashboard-text hover:text-dashboard-primary text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de entrega */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Tipo de Entrega</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo_entrega"
                  value="retiro"
                  checked={formData.tipo_entrega === 'retiro'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Retiro en Gimnasio
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo_entrega"
                  value="domicilio"
                  checked={formData.tipo_entrega === 'domicilio'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Domicilio
              </label>
            </div>
          </div>

          {/* Dirección (solo si es domicilio) */}
          {formData.tipo_entrega === 'domicilio' && (
            <div>
              <label className="block text-sm text-dashboard-text-secondary mb-1">Dirección de Entrega</label>
              <input
                type="text"
                name="direccion_entrega"
                value={formData.direccion_entrega}
                onChange={handleChange}
                required
                className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
                placeholder="Zona, calle, referencias..."
              />
            </div>
          )}

          {/* Método de pago */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Método de Pago</label>
            <select
              name="metodo_pago_id"
              value={formData.metodo_pago_id}
              onChange={handlePaymentMethodChange}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            >
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>{method.nombre}</option>
              ))}
            </select>
          </div>

          {/* Campos dinámicos de pago */}
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

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary"
            >
              Volver al Carrito
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              Confirmar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;