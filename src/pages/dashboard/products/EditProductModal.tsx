// roshi_fit/src/pages/dashboard/products/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import { fetchCategoriesProducts } from '../../../api/categoryApi';
import { fetchProductById, updateProduct } from '../../../api/productApi';
import { uploadProductImage } from '../../../api/uploadApi';
import { type Category } from '../../../types/Product';
import { X, Save, Package, Edit, Image, Tag, Hash, DollarSign, Box, Activity } from 'lucide-react';

interface EditProductModalProps {
  productId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ productId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    sku: '',
    precio_venta_q: '',
    stock: '',
    estado: 'activo',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(productId);
        setFormData({
          nombre: product.nombre,
          descripcion: product.descripcion || '',
          categoria_id: product.categoria_id.toString(),
          sku: product.sku || '',
          precio_venta_q: product.precio_venta_q.toString(),
          stock: (product.stock ?? 0).toString(),
          estado: product.estado,
        });
        setCurrentImage(product.imagen_principal);
        const cats = await fetchCategoriesProducts();
        setCategories(cats);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

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

    try {
      let imagen_principal = currentImage;

      if (imageFile) {
        const filename = await uploadProductImage(imageFile);
        imagen_principal = filename;
      }

      await updateProduct(productId, {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        categoria_id: parseInt(formData.categoria_id),
        sku: formData.sku || undefined,
        precio_venta_q: parseFloat(formData.precio_venta_q),
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        estado: formData.estado,
        imagen_principal: imagen_principal || undefined,
      });

      onUpdate();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el producto.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-black p-8 rounded-2xl w-full max-w-md border-2 border-dashboard-accent/50">
          <div className="flex justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dashboard-primary"></div>
            <p className="text-dashboard-text font-semibold">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/20 rounded-lg">
              <Edit size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EDITAR PRODUCTO</h2>
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
              {/* Nombre */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Package size={16} className="text-cyan-400" />
                  NOMBRE DEL PRODUCTO
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
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

              {/* Descripción */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Edit size={16} className="text-cyan-400" />
                  DESCRIPCIÓN
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                    resize-vertical
                  "
                  placeholder="Describe el producto..."
                />
              </div>

              {/* Categoría */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-cyan-400" />
                  CATEGORÍA
                </label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  required
                  className=" bg-black
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                    cursor-pointer
                  "
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
              {/* SKU */}
              <div>
                <label className="text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Hash size={16} className="text-cyan-400" />
                  SKU (OPCIONAL)
                </label>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                  "
                  placeholder="Código de referencia..."
                />
              </div>

              {/* Precio */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-cyan-400" />
                  PRECIO DE VENTA (Q)
                </label>
                <input
                  name="precio_venta_q"
                  type="number"
                  step="0.01"
                  value={formData.precio_venta_q}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                  "
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Box size={16} className="text-cyan-400" />
                  STOCK ACTUAL
                </label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className="
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                  "
                  placeholder="Cantidad en inventario..."
                />
              </div>

              {/* Estado */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-cyan-400" />
                  ESTADO DEL PRODUCTO
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className=" bg-black
                    w-full p-4 bg-dashboard-bg text-dashboard-text 
                    rounded-xl border-2 border-dashboard-accent/50
                    focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                    hover:border-cyan-400/50 transition-all duration-300
                    cursor-pointer
                  "
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="border-t border-dashboard-accent/50 pt-6">
            <h3 className="text-lg font-bold text-dashboard-text mb-4 flex items-center gap-2">
              <Image size={20} className="text-cyan-400" />
              IMÁGENES DEL PRODUCTO
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagen actual */}
              {currentImage && (
                <div>
                  <label className=" text-sm font-bold text-dashboard-text mb-3">
                    IMAGEN ACTUAL
                  </label>
                  <div className="p-4 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50">
                    <img
                      src={`/assets/products/${currentImage}`}
                      alt="Imagen actual"
                      className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-dashboard-accent/50"
                    />
                  </div>
                </div>
              )}

              {/* Nueva imagen */}
              <div>
                <label className=" text-sm font-bold text-dashboard-text mb-3">
                  NUEVA IMAGEN (OPCIONAL)
                </label>
                <div className="p-4 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50 border-dashed">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="
                      w-full p-3 bg-dashboard-bg text-dashboard-text 
                      rounded-lg border-2 border-dashboard-accent/50
                      focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                      hover:border-cyan-400/50 transition-all duration-300
                      cursor-pointer
                    "
                  />
                  <p className="text-xs text-dashboard-text-secondary mt-2 text-center">
                    Selecciona una nueva imagen para reemplazar la actual
                  </p>
                </div>
              </div>
            </div>
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
                flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 
                text-white font-bold rounded-xl 
                hover:from-cyan-700 hover:to-cyan-800
                disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  GUARDANDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  GUARDAR CAMBIOS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;