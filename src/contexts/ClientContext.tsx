/** @jsxRuntime automatic */
import React, { createContext, useContext } from 'react';

interface ClientContextType {
  usuarioId: number | null;
  onAddToCart: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode; usuarioId: number | null; onAddToCart: () => void }> = ({ children, usuarioId, onAddToCart }) => {
  const contextValue = { usuarioId, onAddToCart };

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
}; // Temporary comment for recompilation
