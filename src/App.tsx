// roshi_fit/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import WelcomeRoshi from './pages/WelcomeRoshi';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ClienteDashboard from './pages/dashboard/ClienteDashboard'; // ← NUEVO
import './styles/base.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('userToken');
  if (!token) return <Navigate to="/" />;
  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route
            path="/"
            element={
              <Layout>
                <WelcomeRoshi />
              </Layout>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cliente"
            element={
              <ProtectedRoute>
                <ClienteDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;