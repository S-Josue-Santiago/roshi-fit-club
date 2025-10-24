// roshi_fit/src/pages/dashboard/suppliers/CreateSupplierModal.tsx
import React, { useState } from 'react';
import { createSupplier } from '../../../api/supplierApi';
import { X, Save, Building, User, Mail, Phone, MapPin, FileText, Plus } from 'lucide-react';

interface CreateSupplierModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    contacto_nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    rfc_nit: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.nombre_empresa || !formData.email) {
      setError('Nombre de empresa y email son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      await createSupplier(formData);
      onCreate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el proveedor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Plus size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">CREAR NUEVO PROVEEDOR</h2>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-6">
              {/* Nombre de Empresa */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Building size={16} className="text-green-400" />
                  NOMBRE DE LA EMPRESA *
                </label>
                <input
                  name="nombre_empresa"
                  value={formData.nombre_empresa}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-green-400/50 transition-all duration-300
                  "
                  placeholder="Ingresa el nombre de la empresa..."
                />
              </div>

              {/* Contacto */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <User size={16} className="text-green-400" />
                  NOMBRE DE CONTACTO
                </label>
                <input
                  name="contacto_nombre"
                  value={formData.contacto_nombre}
                  onChange={handleChange}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-green-400/50 transition-all duration-300
                  "
                  placeholder="Persona de contacto..."
                />
              </div>

              {/* Email */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-green-400" />
                  CORREO ELECTRÓNICO *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-green-400/50 transition-all duration-300
                  "
                  placeholder="email@empresa.com"
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
              {/* Teléfono */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Phone size={16} className="text-green-400" />
                  TELÉFONO
                </label>
                <input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-green-400/50 transition-all duration-300
                  "
                  placeholder="Número de contacto..."
                />
              </div>

              {/* RFC/NIT */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-green-400" />
                  RFC / NIT
                </label>
                <input
                  name="rfc_nit"
                  value={formData.rfc_nit}
                  onChange={handleChange}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-green-400/50 transition-all duration-300
                  "
                  placeholder="Número de identificación fiscal..."
                />
              </div>

              {/* Dirección */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-green-400" />
                  DIRECCIÓN
                </label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={4}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-green-400/50 transition-all duration-300
                    resize-vertical
                  "
                  placeholder="Dirección completa de la empresa..."
                />
              </div>
            </div>
          </div>

          {/* Nota de campos obligatorios */}
          <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-600/30">
            <p className="text-sm text-blue-400 font-semibold text-center">
              * Campos obligatorios
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-dashboard-accent/50">
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
                  CREANDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  CREAR PROVEEDOR
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSupplierModal;