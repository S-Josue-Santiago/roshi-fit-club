// roshi_fit/src/pages/dashboard/client/ClientHeader.tsx
import React, { useState, useEffect } from 'react';
import { useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import { ShoppingCart, LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../../../api/purchaseApi';
import CartModal from './CartModal';

interface ClientHeaderProps {
  subscriptionStatus: string;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ subscriptionStatus }) => {
  const { theme, toggleTheme } = useDashboardTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const loadCartCount = async () => {
      if (userData?.id) {
        try {
          const cart = await getCart(userData.id);
          setCartCount(cart.items.reduce((sum, item) => sum + item.cantidad, 0));
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
        }
      }
    };
    loadCartCount();
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return 'text-green-400';
      case 'vencida': return 'text-yellow-400';
      case 'cancelada': return 'text-red-400';
      case 'suspendida': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      activa: '✅ Activa',
      vencida: '⚠️ Vencida',
      cancelada: '❌ Cancelada',
      suspendida: '⏸️ Suspendida'
    };
    return texts[status] || status;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 shadow-md bg-dashboard-bg border-b border-dashboard-accent">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">🐉</span>
        <h1 className="text-xl font-bold text-dashboard-text">ROSHI FIT</h1>
      </div>

      <div className="flex items-center space-x-6">
        {userData && (
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-dashboard-text font-medium">
              👤 {userData.nombre.split(' ')[0]}
            </span>
            <span className={getStatusColor(subscriptionStatus)}>
              {getStatusText(subscriptionStatus)}
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 text-dashboard-text hover:text-dashboard-primary"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-dashboard-sidebar transition-colors"
          title={`Cambiar a tema ${theme === 'nocturno' ? 'Amanecer' : 'Nocturno'}`}
        >
          {theme === 'nocturno' ? <Sun size={20} className="text-dashboard-text" /> : <Moon size={20} className="text-dashboard-text" />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 p-2 rounded-lg hover:bg-red-500/20 transition-colors text-dashboard-text"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      {isCartOpen && userData && (
        <CartModal
          usuarioId={userData.id}
          onClose={() => setIsCartOpen(false)}
          onCheckoutSuccess={() => {
            setIsCartOpen(false);
            setCartCount(0);
          }}
        />
      )}
    </header>
  );
};

export default ClientHeader;