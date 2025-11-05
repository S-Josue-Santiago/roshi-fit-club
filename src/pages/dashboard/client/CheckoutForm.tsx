// roshi_fit/src/pages/dashboard/client/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { fetchActivePaymentMethods } from '../../../api/paymentMethodApi';
import type { PaymentMethod } from '../../../types/PaymentMethod';
import { 
  X, Truck, CreditCard, DollarSign, MapPin, ArrowLeft, 
  CheckCircle, Calendar, Shield, Mail, Package, Store
} from 'lucide-react';

interface CheckoutFormProps {
  usuarioId: number;
  onBack: () => void;
  onCheckout: (data: any) => void;
  initialTotal: number;
  deliveryFee: number;
}

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ usuarioId, onBack, onCheckout, initialTotal, deliveryFee }) => {
  const theme = useDashboardThemeDetection();
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

  const [displayTotal, setDisplayTotal] = useState(initialTotal);

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

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        overlay: 'bg-black/40',
        modal: 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-300',
        modalShadow: '0 25px 50px rgba(74, 144, 226, 0.25)',
        header: 'border-slate-300',
        headerIcon: 'bg-green-100 text-green-600',
        headerTitle: 'text-gray-900',
        closeButton: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
        sectionTitle: 'text-gray-800',
        sectionIcon: 'text-blue-500',
        radioCard: {
          base: 'border-slate-300 bg-white hover:border-blue-400',
          active: 'border-blue-500 bg-blue-50'
        },
        radioButton: {
          base: 'border-gray-400',
          active: 'border-blue-500 bg-blue-500'
        },
        radioText: 'text-gray-900',
        radioSubtext: 'text-gray-600',
        input: 'bg-white text-gray-900 border-slate-300 focus:border-blue-500',
        select: 'bg-white text-gray-900 border-slate-300 focus:border-blue-500',
        detailsContainer: 'bg-blue-50 border-blue-200',
        detailsTitle: 'text-gray-900',
        summaryContainer: 'border-slate-300 bg-gradient-to-r from-blue-50 to-purple-50',
        summaryText: 'text-gray-800',
        summaryTotal: 'text-green-600',
        backButton: 'bg-white border-slate-300 text-gray-700 hover:bg-red-50 hover:border-red-400 hover:text-red-600',
        submitButton: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        submitButtonShadow: '0 8px 20px rgba(34, 197, 94, 0.4)',
        loadingText: 'text-gray-600',
        errorText: 'text-red-600'
      };
    }
    
    // Tema Nocturno
    return {
      overlay: 'bg-black/60',
      modal: 'bg-gradient-to-br from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-purple-500/30',
      modalShadow: '0 25px 50px rgba(138, 43, 226, 0.3)',
      header: 'border-purple-500/30',
      headerIcon: 'bg-green-500/20 text-green-400',
      headerTitle: 'text-white',
      closeButton: 'text-white hover:text-red-400 hover:bg-red-500/20',
      sectionTitle: 'text-white',
      sectionIcon: 'text-cyan-400',
      radioCard: {
        base: 'border-purple-500/30 bg-[#16213E]/30 hover:border-cyan-400/50',
        active: 'border-cyan-500 bg-cyan-500/10'
      },
      radioButton: {
        base: 'border-[#B0BEC5]',
        active: 'border-cyan-500 bg-cyan-500'
      },
      radioText: 'text-white',
      radioSubtext: 'text-[#B0BEC5]',
      input: 'bg-[#0A0E27] text-white border-purple-500/30 focus:border-cyan-500',
      select: 'bg-[#0A0E27] text-white border-purple-500/30 focus:border-cyan-500',
      detailsContainer: 'bg-cyan-500/10 border-cyan-500/30',
      detailsTitle: 'text-white',
      summaryContainer: 'border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-[#16213E]/50',
      summaryText: 'text-white',
      summaryTotal: 'text-green-400',
      backButton: 'bg-[#16213E] border-purple-500/30 text-white hover:bg-red-900/30 hover:border-red-500 hover:text-red-400',
      submitButton: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
      submitButtonShadow: '0 8px 20px rgba(34, 197, 94, 0.5)',
      loadingText: 'text-[#B0BEC5]',
      errorText: 'text-red-400'
    };
  };

  const styles = getStyles();

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${styles.overlay} backdrop-blur-md p-4 min-h-screen`}
      onClick={onBack}
    >
      <div 
        className={`${styles.modal} p-6 md:p-8 rounded-3xl w-full max-w-3xl border-2 max-h-[95vh] flex flex-col animate-slideUp`}
        style={{ boxShadow: styles.modalShadow }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center mb-6 pb-4 border-b-2 ${styles.header}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${styles.headerIcon}`}>
              <Package size={24} />
            </div>
            <div>
              <h2 className={`text-2xl md:text-3xl font-black ${styles.headerTitle}`}>FINALIZAR COMPRA</h2>
              <p className={`text-sm ${styles.radioSubtext} mt-0.5`}>Completa los datos de tu pedido</p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 ${styles.closeButton}`}
          >
            <X size={24} />
          </button>
        </div>

        {paymentMethodsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" 
                 style={{ borderColor: theme === 'amanecer' ? '#3b82f6' : '#8b5cf6', borderTopColor: 'transparent' }}></div>
            <p className={`mt-4 ${styles.loadingText} font-semibold`}>Cargando métodos de pago...</p>
          </div>
        ) : paymentMethodsError ? (
          <div className={`text-center ${styles.errorText} font-semibold py-8`}>{paymentMethodsError}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 -mr-2">
            {/* Tipo de entrega */}
            <div>
              <label className={`block text-sm font-black ${styles.sectionTitle} mb-4 flex items-center gap-2`}>
                <Truck size={18} className={styles.sectionIcon} />
                TIPO DE ENTREGA
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`
                  relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${formData.tipo_entrega === 'retiro' ? styles.radioCard.active : styles.radioCard.base}
                `}>
                  <input
                    type="radio"
                    name="tipo_entrega"
                    value="retiro"
                    checked={formData.tipo_entrega === 'retiro'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                      formData.tipo_entrega === 'retiro' ? styles.radioButton.active : styles.radioButton.base
                    }`}>
                      {formData.tipo_entrega === 'retiro' && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Store size={18} className={styles.sectionIcon} />
                        <p className={`font-black ${styles.radioText}`}>Retiro en Gimnasio</p>
                      </div>
                      <p className={`text-sm ${styles.radioSubtext}`}>Recoge tu pedido en nuestro local</p>
                    </div>
                  </div>
                </label>

                <label className={`
                  relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${formData.tipo_entrega === 'domicilio' ? styles.radioCard.active : styles.radioCard.base}
                `}>
                  <input
                    type="radio"
                    name="tipo_entrega"
                    value="domicilio"
                    checked={formData.tipo_entrega === 'domicilio'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                      formData.tipo_entrega === 'domicilio' ? styles.radioButton.active : styles.radioButton.base
                    }`}>
                      {formData.tipo_entrega === 'domicilio' && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck size={18} className={styles.sectionIcon} />
                        <p className={`font-black ${styles.radioText}`}>Entrega a Domicilio</p>
                      </div>
                      <p className={`text-sm ${styles.radioSubtext}`}>Recibe tu pedido en casa</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Dirección */}
            {formData.tipo_entrega === 'domicilio' && (
              <div className="animate-slideDown">
                <label className={`block text-sm font-black ${styles.sectionTitle} mb-3 flex items-center gap-2`}>
                  <MapPin size={18} className={styles.sectionIcon} />
                  DIRECCIÓN DE ENTREGA
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                  <input
                    type="text"
                    name="direccion_entrega"
                    value={formData.direccion_entrega}
                    onChange={handleChange}
                    required
                    placeholder="Zona, calle, número, referencias..."
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                  />
                </div>
              </div>
            )}

            {/* Método de pago */}
            <div>
              <label className={`block text-sm font-black ${styles.sectionTitle} mb-3 flex items-center gap-2`}>
                <CreditCard size={18} className={styles.sectionIcon} />
                MÉTODO DE PAGO
              </label>
              <div className="relative">
                <CreditCard className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                <select
                  name="metodo_pago_id"
                  value={formData.metodo_pago_id}
                  onChange={handlePaymentMethodChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 cursor-pointer ${styles.select}`}
                >
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campos dinámicos de pago */}
            {selectedMethod && (
              <div className={`p-6 rounded-2xl border-2 ${styles.detailsContainer} animate-fadeIn`}>
                <h5 className={`font-black ${styles.detailsTitle} mb-4 flex items-center gap-2`}>
                  <DollarSign size={18} className={styles.sectionIcon} />
                  DETALLES DE {selectedMethod.nombre.toUpperCase()}
                </h5>
                
                {selectedMethod.id === 1 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <CreditCard className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                      <input
                        name="numero_tarjeta"
                        placeholder="Número de Tarjeta"
                        value={formData.numero_tarjeta}
                        onChange={handleChange}
                        required
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                        <input
                          name="mes_expiracion"
                          placeholder="Mes (MM)"
                          value={formData.mes_expiracion}
                          onChange={handleChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                        />
                      </div>
                      <div className="relative">
                        <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                        <input
                          name="anio_expiracion"
                          placeholder="Año (AA)"
                          value={formData.anio_expiracion}
                          onChange={handleChange}
                          required
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <Shield className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                      <input
                        name="cvv"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        maxLength={4}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                      />
                    </div>
                  </div>
                )}
                
                {selectedMethod.id === 4 && (
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.sectionIcon}`} size={20} />
                    <input
                      name="paypal_email"
                      type="email"
                      placeholder="Email de PayPal"
                      value={formData.paypal_email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.input}`}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Resumen del Total */}
            <div className={`p-6 rounded-2xl border-2 ${styles.summaryContainer} space-y-3`}>
              <div className={`flex justify-between ${styles.summaryText} font-semibold`}>
                <span>Subtotal:</span>
                <span className="font-bold">Q{initialTotal.toFixed(2)}</span>
              </div>
              {formData.tipo_entrega === 'domicilio' && (
                <div className={`flex justify-between ${styles.summaryText} font-semibold`}>
                  <span>Costo de Envío:</span>
                  <span className="font-bold">Q{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className={`flex justify-between items-center text-xl font-black ${styles.summaryText} mt-4 pt-4 border-t-2`} style={{ borderColor: theme === 'amanecer' ? '#cbd5e1' : 'rgba(138, 43, 226, 0.3)' }}>
                <span>Total a Pagar:</span>
                <span className={`text-3xl ${styles.summaryTotal}`}>Q{displayTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={onBack}
                className={`flex-1 px-6 py-4 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${styles.backButton}`}
              >
                <ArrowLeft size={20} />
                VOLVER AL CARRITO
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-4 rounded-2xl font-black text-white border-2 border-transparent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${styles.submitButton}`}
                style={{ boxShadow: styles.submitButtonShadow }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    PROCESANDO...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    CONFIRMAR COMPRA
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'amanecer' ? 'rgba(226, 232, 240, 0.5)' : 'rgba(22, 33, 62, 0.5)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'amanecer' ? 'rgba(74, 144, 226, 0.5)' : 'rgba(138, 43, 226, 0.5)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'amanecer' ? 'rgba(74, 144, 226, 0.8)' : 'rgba(138, 43, 226, 0.8)'};
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CheckoutForm;