// roshi_fit/src/components/common/TopProductsCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTopSellingProducts } from '../../api/productApi';
import { type TopProduct } from '../../types/Product';

const TopProductsCarousel: React.FC = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSellingProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (precio: string | number): number => {
    if (typeof precio === 'number') return precio;
    return parseFloat(precio) || 0;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (loading) {
    return <p className="text-text-gray text-center py-6">Cargando productos...</p>;
  }

  if (products.length === 0) {
    return <p className="text-text-gray text-center py-6">No hay productos vendidos aún.</p>;
  }

  // Mostrar todos si ≤ 3
  if (products.length <= 3) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/productos"
            className="inline-block px-6 py-3 bg-primary text-text-light font-semibold rounded-lg hover:bg-gold transition-colors"
          >
            Ver más productos
          </Link>
        </div>
      </>
    );
  }

  // Carrusel: 3 visibles
  const visibleProducts = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % products.length;
    visibleProducts.push(products[index]);
  }

  return (
    <div className="relative">
      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-accent/70 hover:bg-accent text-text-light p-2 rounded-full"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-accent/70 hover:bg-accent text-text-light p-2 rounded-full"
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Carrusel */}
      <div className="flex justify-center gap-8 overflow-hidden">
        {visibleProducts.map((product, idx) => (
          <div key={`${product.id}-${idx}`} className="flex-shrink-0 w-full max-w-xs">
            <ProductCard product={product} formatPrice={formatPrice} />
          </div>
        ))}
      </div>

      {/* Botón "Ver más" */}
      <div className="text-center mt-8">
        <Link
          to="/productos"
          className="inline-block px-6 py-3 bg-primary text-text-light font-semibold rounded-lg hover:bg-gold transition-colors"
        >
          Ver más productos
        </Link>
      </div>
    </div>
  );
};

// Tarjeta individual
const ProductCard: React.FC<{
  product: TopProduct;
  formatPrice: (precio: string | number) => number;
}> = ({ product, formatPrice }) => {
  const price = formatPrice(product.precio_venta_q);

  return (
    <div className="bg-accent/50 rounded-xl overflow-hidden border border-accent shadow-lg hover:shadow-xl transition-shadow">
      {product.imagen_principal ? (
        <img
          src={`../../../public/assets/products/${product.imagen_principal}`}
          alt={product.nombre}
          className="w-full h-48 object-cover"
          onError={(e) => (e.currentTarget.src = '/assets/placeholder.jpg')}
        />
      ) : (
        <div className="w-full h-48 bg-secondary flex items-center justify-center text-text-gray">
          Sin imagen
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-text-light mb-1">{product.nombre}</h3>
        <p className="text-sm text-text-gray mb-2 line-clamp-2">{product.descripcion}</p>
        <p className="text-xs text-text-gray mb-2">SKU: {product.sku || 'N/A'}</p>
        <p className="text-2xl font-extrabold text-gold mb-3">Q{price.toFixed(2)}</p>
        <Link
          to={`/productos/${product.id}`}
          className="w-full block text-center py-2 bg-primary text-text-light font-semibold rounded-lg hover:bg-gold transition-colors"
        >
          Ir
        </Link>
      </div>
    </div>
  );
};

export default TopProductsCarousel;