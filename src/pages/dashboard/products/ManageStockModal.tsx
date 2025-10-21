// roshi_fit/src/pages/dashboard/products/ManageStockModal.tsx
import React, { useState } from 'react';
import { updateProductStock } from '../../../api/productApi';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Gestionar Stock</h2>
          <button
            onClick={onClose}
            className="text-dashboard-text hover:text-dashboard-primary text-2xl"
          >
            &times;
          </button>
        </div>

        <p className="text-dashboard-text mb-4">
          Producto: <span className="font-semibold">{productName}</span>
        </p>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">
              Stock actual: {currentStock}
            </label>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              required
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            />
          </div>

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
              {loading ? 'Actualizando...' : 'Actualizar Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStockModal;