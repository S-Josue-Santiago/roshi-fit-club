// roshi_fit/src/components/common/TopProductsCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTopSellingProducts } from '../../api/productApi';
import { type TopProduct } from '../../types/Product';

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      setTheme(bodyClass.includes('futurista') ? 'futurista' : 'original');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const TopProductsCarousel: React.FC = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

  const getLoadingStyle = () => {
    return theme === 'futurista'
      ? 'text-gray-600 text-lg font-light'
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Cargando productos...</p>;
  }

  if (products.length === 0) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>No hay productos vendidos aún.</p>;
  }

  // Mostrar todos si ≤ 3
  if (products.length <= 3) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} formatPrice={formatPrice} theme={theme} />
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

  const getButtonStyle = () => {
    if (theme === 'futurista') {
      return {
        background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
        boxShadow: '0 4px 15px rgba(0, 120, 255, 0.4)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)'
    };
  };

  const getIndicatorStyle = (isActive: boolean) => {
    if (theme === 'futurista') {
      return isActive 
        ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50' 
        : 'bg-blue-200';
    }
    return isActive 
      ? 'bg-primary scale-125 shadow-lg shadow-primary/50' 
      : 'bg-orange-300/60';
  };

  const getLinkStyle = () => {
    if (theme === 'futurista') {
      return 'inline-block px-8 py-3 font-black text-white rounded-xl transition-all duration-300 transform hover:scale-105';
    }
    return 'inline-block px-6 py-3 bg-primary text-text-light font-semibold rounded-lg hover:bg-gold transition-colors';
  };

  const getLinkInlineStyle = () => {
    if (theme === 'futurista') {
      return {
        background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
        boxShadow: '0 6px 20px rgba(0, 120, 255, 0.3)'
      };
    }
    return {};
  };

  return (
    <div className="relative py-6">
      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10
                   text-white w-10 h-10 rounded-full flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
        aria-label="Anterior"
      >
        <span className="text-xl font-bold">‹</span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10
                   text-white w-10 h-10 rounded-full flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
        aria-label="Siguiente"
      >
        <span className="text-xl font-bold">›</span>
      </button>

      {/* Carrusel */}
      <div className="flex justify-center gap-8 overflow-hidden px-10">
        {visibleProducts.map((product, idx) => (
          <div 
            key={`${product.id}-${idx}`} 
            className={`
              flex-shrink-0 w-full max-w-xs transform transition-all duration-300
              ${idx === 1 ? 'scale-105' : 'scale-100'}
            `}
          >
            <ProductCard product={product} formatPrice={formatPrice} theme={theme} />
          </div>
        ))}
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${getIndicatorStyle(index === currentIndex)}
            `}
          />
        ))}
      </div>

      {/* Botón "Ver más" */}
      <div className="text-center mt-10">
        <Link
          to="/productos"
          className={getLinkStyle()}
          style={getLinkInlineStyle()}
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
  theme: 'original' | 'futurista';
}> = ({ product, formatPrice, theme }) => {
  const price = formatPrice(product.precio_venta_q);

  const getCardStyle = () => {
    if (theme === 'futurista') {
      return {
        container: 'rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
        containerStyle: {
          background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
          boxShadow: '-8px -8px 16px rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        imageContainer: 'w-full h-48 flex items-center justify-center',
        imageContainerStyle: { background: 'linear-gradient(135deg, #e8f0f7, #f0f4f8)' },
        imagePlaceholderText: 'text-gray-500',
        contentContainer: 'p-4',
        title: 'text-xl font-bold text-gray-800 mb-1',
        description: 'text-sm text-gray-600 mb-2 line-clamp-2',
        sku: 'text-xs text-gray-400 mb-2',
        price: 'text-2xl font-extrabold text-blue-600 mb-3',
        link: 'w-full block text-center py-2 font-bold text-white rounded-lg transition-all duration-300 transform hover:scale-105',
        linkStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          boxShadow: '0 4px 15px rgba(0, 120, 255, 0.3)'
        }
      };
    }
    // Tema Original
    return {
      container: 'rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      imageContainer: 'w-full h-48 bg-secondary flex items-center justify-center',
      imageContainerStyle: {},
      imagePlaceholderText: 'text-text-gray',
      contentContainer: 'p-4',
      title: 'text-xl font-bold text-text-light mb-1',
      description: 'text-sm text-text-gray mb-2 line-clamp-2',
      sku: 'text-xs text-text-gray mb-2',
      price: 'text-2xl font-extrabold text-gold mb-3',
      link: 'w-full block text-center py-2 bg-primary text-text-light font-semibold rounded-lg hover:bg-gold transition-colors',
      linkStyle: {}
    };
  };

  const styles = getCardStyle();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      {product.imagen_principal ? (
        <img
          src={`/assets/products/${product.imagen_principal}`}
          alt={product.nombre}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      ) : (
        <div className={styles.imageContainer} style={styles.imageContainerStyle}>
          Sin imagen
        </div>
      )}
      <div className={styles.contentContainer}>
        <h3 className={styles.title}>{product.nombre}</h3>
        <p className={styles.description}>{product.descripcion}</p>
        <p className={styles.sku}>SKU: {product.sku || 'N/A'}</p>
        <p className={styles.price}>Q{price.toFixed(2)}</p>
        <Link
          to={`/productos/${product.id}`}
          className={styles.link}
          style={styles.linkStyle}
        >
          Ir
        </Link>
      </div>
    </div>
  );
};

export default TopProductsCarousel;