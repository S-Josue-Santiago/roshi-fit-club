// roshi_fit/src/pages/dashboard/products/CreateProductModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchCategoriesProducts } from '../../../api/categoryApi';
import { createProduct } from '../../../api/productApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { type Category } from '../../../types/Category';

interface CreateProductModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    sku: '',
    precio_venta_q: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoriesProducts().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.nombre || !formData.categoria_id || !formData.precio_venta_q) {
      setError('Los campos Nombre, Categoría y Precio son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      let imagen_principal: string | undefined = undefined;

      // Subir imagen si se seleccionó
      if (imageFile) {
        imagen_principal = await uploadProductImage(imageFile);
      }

      // Crear producto
      await createProduct({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        categoria_id: parseInt(formData.categoria_id),
        sku: formData.sku || undefined,
        precio_venta_q: parseFloat(formData.precio_venta_q),
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        imagen_principal,
      });

      onCreate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el producto.';
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
          <h2 className="text-xl font-bold text-dashboard-text">Crear Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="text-dashboard-text hover:text-dashboard-primary text-2xl"
          >
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          <select
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <input
            name="sku"
            placeholder="SKU (opcional)"
            value={formData.sku}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          <input
            name="precio_venta_q"
            type="number"
            step="0.01"
            placeholder="Precio de venta (Q)"
            value={formData.precio_venta_q}
            onChange={handleChange}
            required
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock inicial"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />

          {/* Subir imagen */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">
              Imagen del producto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;