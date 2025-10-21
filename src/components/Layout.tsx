// roshi_fit/src/components/PublicLayout.tsx
import React, { type ReactNode } from 'react';
import Navbar from './Navbar'; // ← Este debe ser el Navbar público

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 bg-secondary text-text-light">
        {children}
      </main>
    </div>
  );
};

export default Layout;