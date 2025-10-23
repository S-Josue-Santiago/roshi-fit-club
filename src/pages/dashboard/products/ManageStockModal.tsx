// roshi_fit/src/pages/dashboard/products/ManageStockModal.tsx
import React, { useState } from 'react';
import { updateProductStock } from '../../../api/productApi';
import { X, Save, Package, TrendingUp, Box } from 'lucide-react';

interface ManageStockModalProps {
  productId: number;
  currentStock: number;
  productName: string;
  onClose: () => void;
  onUpdate: () => void;
}

const ManageStockModal: React.FC<ManageStockModalProps> = ({
  productId,
  currentStock,
  productName,
  onClose,
  onUpdate
}) => {
  const [newStock, setNewStock] = useState<string>(currentStock.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0.');
      setLoading(false);
      return;
    }

    try {
      await updateProductStock(productId, stockValue);
      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el stock.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-dashboard-accent/95 p-6 rounded-2xl shadow-2xl w-full max-w-md border-2 border-dashboard-accent/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Package size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">GESTIONAR STOCK</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Información del producto */}
        <div className="mb-6 p-4 bg-dashboard-accent/30 rounded-xl border border-dashboard-accent/50">
          <p className="text-dashboard-text font-semibold flex items-center gap-2 mb-2">
            <Box size={18} className="text-green-400" />
            PRODUCTO:
          </p>
          <p className="text-dashboard-text-secondary text-lg font-bold pl-6">
            {productName}
          </p>
        </div>

        {/* Stock actual */}
        <div className="mb-6 p-4 bg-blue-600/10 rounded-xl border border-blue-600/30">
          <p className="text-dashboard-text font-semibold flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-blue-400" />
            STOCK ACTUAL:
          </p>
          <p className="text-blue-400 text-2xl font-black pl-6">
            {currentStock} unidades
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              NUEVO STOCK
            </label>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              required
              className="
                w-full p-4 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                hover:border-green-400/50 transition-all duration-300
                text-lg font-semibold
              "
              placeholder="Ingresa la nueva cantidad..."
            />
            <p className="text-xs text-dashboard-text-secondary mt-2">
              Ingresa un número entero mayor o igual a 0
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashboard-accent/50">
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
                  ACTUALIZANDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  ACTUALIZAR STOCK
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStockModal;