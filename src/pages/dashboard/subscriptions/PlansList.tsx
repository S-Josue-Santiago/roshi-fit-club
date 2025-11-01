// roshi_fit/src/pages/dashboard/subscriptions/PlansList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchPlans, togglePlanStatus } from '../../../api/planApi';
import type { Plan, PlanFilters } from '../../../types/Plan';
import PlansFiltersComponent from './PlansFilters';
import PlanActions from './PlanActions';
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';
import { Award, DollarSign, Clock, Users } from 'lucide-react';

const PlansList: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PlanFilters>({ search: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to force data reload

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPlans(filters);
      setPlans(data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
      alert(`Error al cargar planes: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [filters, refreshTrigger]); // Add refreshTrigger to dependencies

  useEffect(() => {
    loadPlans();
  }, [loadPlans, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleAddPlan = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => {
    loadPlans(); // Reload all plans after creation
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }
  const handleEdit = (id: number) => setEditingPlanId(id);
  const handleUpdateSuccess = () => {
    loadPlans(); // Reload all plans after update
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await togglePlanStatus(id);
      loadPlans(); // Reload plans to reflect the status change
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error toggling plan status:', error);
      alert(`Error al cambiar el estado del plan: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(precio);
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-600/20 rounded-lg">
          <Award size={24} className="text-teal-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">PLANES DE SUSCRIPCIÓN</h1>
      </div>

      <PlansFiltersComponent
        onFilterChange={setFilters}
        onAddPlan={handleAddPlan}
        onViewMemberships={() => alert('Funcionalidad de "Ver Membresías" en desarrollo.')}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Award size={16} className="text-teal-400" />PLAN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><DollarSign size={16} className="text-teal-400" />PRECIO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Clock size={16} className="text-teal-400" />DURACIÓN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Users size={16} className="text-teal-400" />USUARIOS ACTIVOS</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {plans.map(plan => (
                    <tr key={plan.id} className="transition-all duration-300 hover:bg-black hover:bg-opacity-80 group bg-dashboard-accent/5">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {plan.nombre}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {formatPrice(Number(plan.precio_q))}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">
                        {plan.duracion_dias} días
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        <div className="flex items-center justify-start gap-2">
                          <Users size={16} className="text-teal-400" />
                          <span>{plan.usuarios_activos}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <PlanActions plan={plan} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {plans.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron planes</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda o crea un nuevo plan.
              </p>
            </div>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreatePlanModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingPlanId && (
        <EditPlanModal
          planId={editingPlanId}
          onClose={() => setEditingPlanId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PlansList;