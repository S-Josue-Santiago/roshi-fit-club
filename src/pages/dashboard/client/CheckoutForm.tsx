// roshi_fit/src/pages/dashboard/client/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { fetchActivePaymentMethods } from '../../../api/paymentMethodApi';
import type { PaymentMethod } from '../../../types/PaymentMethod';
import { X, Truck, CreditCard, DollarSign, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  usuarioId: number;
  onBack: () => void;
  onCheckout: (data: any) => void;
  initialTotal: number; // Nuevo: total del carrito sin envío
  deliveryFee: number; // Nuevo: costo de envío ficticio
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ usuarioId, onBack, onCheckout, initialTotal, deliveryFee }) => {
  const [formData, setFormData] = useState({
    tipo_entrega: 'retiro' as 'retiro' | 'domicilio',
    direccion_entrega: '',
    metodo_pago_id: 1,
    numero_tarjeta: '',
    cvv: '',
    mes_expiracion: '',
    anio_expiracion: '',
    paypal_email: '',
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const data = await fetchActivePaymentMethods();
        setPaymentMethods(data);
      } catch (err) {
        setPaymentMethodsError('Error al cargar métodos de pago.');
      } finally {
        setPaymentMethodsLoading(false);
      }
    };
    loadPaymentMethods();
  }, []);

  // Estado para el total que se muestra al usuario
  const [displayTotal, setDisplayTotal] = useState(initialTotal);

  // Calcular el total a mostrar cada vez que el tipo de entrega o el total inicial cambian
  useEffect(() => {
    let currentTotal = initialTotal;
    if (formData.tipo_entrega === 'domicilio') {
      currentTotal += deliveryFee;
    }
    setDisplayTotal(currentTotal);
  }, [formData.tipo_entrega, initialTotal, deliveryFee]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethodId = parseInt(e.target.value);
    
    if (newMethodId === 1) {
      setFormData(prev => ({ 
        ...prev, 
        metodo_pago_id: newMethodId,
        paypal_email: '' 
      }));
    } else if (newMethodId === 4) {
      setFormData(prev => ({ 
        ...prev, 
        metodo_pago_id: newMethodId,
        numero_tarjeta: '', 
        cvv: '', 
        mes_expiracion: '', 
        anio_expiracion: '' 
      }));
    } else {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

    setLoading(false);
  };

  const selectedMethod = paymentMethods.find(m => m.id === formData.metodo_pago_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 min-h-screen overflow-y-auto">
      <div 
        className="bg-dashboard-accent/95 p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">FINALIZAR COMPRA</h2>
          </div>
          <button 
            onClick={onBack}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {paymentMethodsLoading ? (
          <div className="text-center text-dashboard-text mt-4">Cargando métodos de pago...</div>
        ) : paymentMethodsError ? (
          <div className="text-center text-red-500 mt-4">{paymentMethodsError}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de entrega */}
            <div>
              <label className=" text-sm font-bold text-dashboard-text mb-4 flex items-center gap-2">
                <Truck size={16} className="text-cyan-400" />
                TIPO DE ENTREGA
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${formData.tipo_entrega === 'retiro' 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-dashboard-accent/50 bg-dashboard-accent/20 hover:border-cyan-400/50'
                  }
                `}>
                  <input
                    type="radio"
                    name="tipo_entrega"
                    value="retiro"
                    checked={formData.tipo_entrega === 'retiro'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.tipo_entrega === 'retiro' ? 'border-cyan-500 bg-cyan-500' : 'border-dashboard-text-secondary'
                    }`}></div>
                    <div>
                      <p className="font-bold text-dashboard-text">Retiro en Gimnasio</p>
                      <p className="text-sm text-dashboard-text-secondary">Recoge tu pedido en nuestro local</p>
                    </div>
                  </div>
                </label>

                <label className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${formData.tipo_entrega === 'domicilio' 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-dashboard-accent/50 bg-dashboard-accent/20 hover:border-cyan-400/50'
                  }
                `}>
                  <input
                    type="radio"
                    name="tipo_entrega"
                    value="domicilio"
                    checked={formData.tipo_entrega === 'domicilio'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.tipo_entrega === 'domicilio' ? 'border-cyan-500 bg-cyan-500' : 'border-dashboard-text-secondary'
                    }`}></div>
                    <div>
                      <p className="font-bold text-dashboard-text">Entrega a Domicilio</p>
                      <p className="text-sm text-dashboard-text-secondary">Recibe tu pedido en casa</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Dirección (solo si es domicilio) */}
            {formData.tipo_entrega === 'domicilio' && (
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400" />
                  DIRECCIÓN DE ENTREGA
                </label>
                <input
                  type="text"
                  name="direccion_entrega"
                  value={formData.direccion_entrega}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                    placeholder:text-dashboard-text-secondary/50
                  "
                  placeholder="Zona, calle, número, referencias..."
                />
              </div>
            )}

            {/* Método de pago */}
            <div>
              <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                <CreditCard size={16} className="text-cyan-400" />
                MÉTODO DE PAGO
              </label>
              <select
                name="metodo_pago_id"
                value={formData.metodo_pago_id}
                onChange={handlePaymentMethodChange}
                className="
                  w-full p-4 bg-dashboard-bg text-dashboard-text 
                  rounded-xl border-2 border-dashboard-accent/50
                  focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                  hover:border-cyan-400/50 transition-all duration-300
                  cursor-pointer
                "
              >
                {paymentMethods.map(method => (
                  <option className="bg-black" key={method.id} value={method.id}>{method.nombre}</option>
                ))}
              </select>
            </div>

            {/* Campos dinámicos de pago */}
            {selectedMethod && (
              <div className="p-5 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50">
                <h5 className="font-bold text-dashboard-text mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-cyan-400" />
                  DETALLES DE {selectedMethod.nombre.toUpperCase()}
                </h5>
                
                {selectedMethod.id === 1 && (
                  <div className="space-y-4">
                    <input
                      name="numero_tarjeta"
                      placeholder="Número de Tarjeta"
                      value={formData.numero_tarjeta}
                      onChange={handleChange}
                      required
                      className="
                        w-full p-4 bg-dashboard-bg text-dashboard-text 
                        rounded-xl border-2 border-dashboard-accent/50
                        focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                        hover:border-cyan-400/50 transition-all duration-300
                        placeholder:text-dashboard-text-secondary/50
                      "
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="mes_expiracion"
                        placeholder="Mes (MM)"
                        value={formData.mes_expiracion}
                        onChange={handleChange}
                        required
                        className="
                          p-4 bg-dashboard-bg text-dashboard-text 
                          rounded-xl border-2 border-dashboard-accent/50
                          focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                          hover:border-cyan-400/50 transition-all duration-300
                          placeholder:text-dashboard-text-secondary/50
                        "
                      />
                      <input
                        name="anio_expiracion"
                        placeholder="Año (AA)"
                        value={formData.anio_expiracion}
                        onChange={handleChange}
                        required
                        className="
                          p-4 bg-dashboard-bg text-dashboard-text 
                          rounded-xl border-2 border-dashboard-accent/50
                          focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                          hover:border-cyan-400/50 transition-all duration-300
                          placeholder:text-dashboard-text-secondary/50
                        "
                      />
                    </div>
                    <input
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      className="
                        w-full p-4 bg-dashboard-bg text-dashboard-text 
                        rounded-xl border-2 border-dashboard-accent/50
                        focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                        hover:border-cyan-400/50 transition-all duration-300
                        placeholder:text-dashboard-text-secondary/50
                      "
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
                    className="
                      w-full p-4 bg-dashboard-bg text-dashboard-text 
                      rounded-xl border-2 border-dashboard-accent/50
                      focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                      hover:border-cyan-400/50 transition-all duration-300
                      placeholder:text-dashboard-text-secondary/50
                    "
                  />
                )}
              </div>
            )}

            {/* Resumen del Total */}
            <div className="pt-4 border-t border-dashboard-accent/50 space-y-2">
              <div className="flex justify-between text-dashboard-text">
                <span>Subtotal:</span>
                <span className="font-bold">Q{initialTotal.toFixed(2)}</span>
              </div>
              {formData.tipo_entrega === 'domicilio' && (
                <div className="flex justify-between text-dashboard-text">
                  <span>Costo de Envío:</span>
                  <span className="font-bold">Q{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-black text-dashboard-text mt-3 pt-3 border-t border-dashboard-accent/50">
                <span>Total a Pagar:</span>
                <span className="text-green-500 text-2xl">Q{displayTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-dashboard-accent/50">
              <button
                type="button"
                onClick={onBack}
                className="
                  flex-1 px-6 py-3 text-dashboard-text font-bold
                  border-2 border-dashboard-accent/50 rounded-xl
                  hover:border-red-400 hover:text-red-400 hover:bg-red-400/10
                  transition-all duration-300 transform hover:scale-105
                  flex items-center justify-center gap-2
                "
              >
                <ArrowLeft size={18} />
                VOLVER AL CARRITO
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
                    PROCESANDO...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    CONFIRMAR COMPRA
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default CheckoutForm;