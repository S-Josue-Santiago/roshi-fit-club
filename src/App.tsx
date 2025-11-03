// roshi_fit/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import WelcomeRoshi from './pages/WelcomeRoshi';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ClienteDashboard from './pages/dashboard/ClienteDashboard'; // ← NUEVO
import EntrenadorDashboard from './pages/dashboard/EntrenadorDashboard'; // ← Importar
import GeneralSettings from './pages/dashboard/settings/GeneralSettings'; // Importar
import SiteContentSettings from './pages/dashboard/settings/SiteContentSettings'; // Importar
import SettingsLayout from './pages/dashboard/settings/SettingsLayout'; // Importar
import SubscriptionsList from './pages/dashboard/subscriptions/SubscriptionsList'; // Importar
import PlansList from './pages/dashboard/subscriptions/PlansList'; // Importar
import SubscriptionsLayout from './pages/dashboard/subscriptions/SubscriptionsLayout'; // Importar
import UserList from './pages/dashboard/users/UserList'; // Importar UserList
import RoleList from './pages/dashboard/roles/RoleList'; // Importar RoleList
import ProductList from './pages/dashboard/products/ProductList'; // Importar ProductList
import SupplierList from './pages/dashboard/suppliers/SupplierList'; // Importar SupplierList
import CategoryList from './pages/dashboard/categories/CategoryList'; // Importar CategoryList
import ExerciseList from './pages/dashboard/exercises/ExerciseList'; // Importar ExerciseList
import ServiceList from './pages/dashboard/services/ServiceList'; // Importar ServiceList
import GalleryList from './pages/dashboard/gallery/GalleryList'; // Importar GalleryList
import SalesList from './pages/dashboard/sales/SalesList'; // Importar SalesList
import EquipmentList from './pages/dashboard/equipments/EquipmentList'; // Importar EquipmentList
import ReportList from './pages/dashboard/reports/ReportList'; // Importar ReportList
import ClientSubscription from './pages/dashboard/client/subscriptions/ClientSubscription'; // Importar ClientSubscription
import ProductListClient from './pages/dashboard/client/products/ProductList'; // Importar ProductList del cliente
import ClientAccount from './pages/dashboard/client/account/ClientAccount'; // Importar ClientAccount
import ClientExerciseList from './pages/dashboard/client/exercises/ClientExerciseList'; // Importar ClientExerciseList
import MyTraining from './pages/dashboard/client/my-training/MyTraining'; // Importar MyTraining

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
          >
            {/* Ruta por defecto para /dashboard/admin */}
            <Route index element={<Navigate to="usuarios" replace />} />
            <Route path="usuarios" element={<UserList />} /> {/* Definir la ruta de usuarios */}

            {/* Rutas para otras secciones principales del dashboard */}
            <Route path="roles" element={<RoleList />} />
            <Route path="productos" element={<ProductList />} />
            <Route path="proveedores" element={<SupplierList />} />
            <Route path="categorias" element={<CategoryList />} />
            <Route path="ejercicios" element={<ExerciseList />} />
            <Route path="servicios" element={<ServiceList />} />
            <Route path="galeria" element={<GalleryList />} />
            <Route path="ventas" element={<SalesList />} />
            <Route path="equipos" element={<EquipmentList />} />
            <Route path="reportes" element={<ReportList />} />

            {/* Rutas anidadas para la sección de Configuración */}
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="site-content" element={<SiteContentSettings />} />
            </Route>

            {/* Rutas anidadas para la sección de Suscripciones */}
            <Route path="suscripciones" element={<SubscriptionsLayout />}>
              <Route index element={<Navigate to="listado" replace />} />
              <Route path="listado" element={<SubscriptionsList />} />
              <Route path="planes" element={<PlansList />} />
            </Route>
            {/* Agrega aquí más rutas anidadas para otras secciones del dashboard */}

          </Route>
          <Route
            path="/dashboard/cliente"
            element={
              <ProtectedRoute>
                <ClienteDashboard />
              </ProtectedRoute>
            }
          >
            {/* Ruta por defecto para /dashboard/cliente */}
            <Route index element={<Navigate to="suscripcion" replace />} />
            {/* <Route path="dashboard" element={<div>Bienvenido al Dashboard del Cliente!</div>} /> Contenido por defecto o un componente de resumen */}
            <Route path="suscripcion" element={<ClientSubscription />} />
            <Route path="productos" element={<ProductListClient />} />
            <Route path="ejercicios" element={<ClientExerciseList />} />
            <Route path="cuenta" element={<ClientAccount />} />
            <Route path="entrenamientos" element={<MyTraining />} />

          </Route>
                  <Route
            path="/dashboard/entrenador"
            element={
              <ProtectedRoute>
                <EntrenadorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;