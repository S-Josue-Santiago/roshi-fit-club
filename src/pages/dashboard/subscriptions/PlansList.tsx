// roshi_fit/src/pages/dashboard/subscriptions/PlansList.tsx
import React, { useState, useEffect } from 'react';
import { fetchPlansWithActiveUsers } from '../../../api/planApi';
import type { Plan, PlanFilters } from '../../../types/Plan';
import PlansFiltersComponent from './PlansFilters';
import PlanActions from './PlanActions';
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';

const PlansList: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PlanFilters>({ search: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await fetchPlansWithActiveUsers(filters);
        setPlans(data);
      } catch (error) {
        console.error('Error al cargar planes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [filters]);

  const handleAddPlan = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '' });
  const handleEdit = (id: number) => setEditingPlanId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(precio);
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <PlansFiltersComponent
        onFilterChange={setFilters}
        onAddPlan={handleAddPlan}
        onViewMemberships={() => alert('Funcionalidad de "Ver Membresías" en desarrollo.')}
      />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando planes...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">PLANES</th>
                <th className="py-3 px-4 text-left">PRECIO</th>
                <th className="py-3 px-4 text-left">DURACIÓN</th>
                <th className="py-3 px-4 text-left">USUARIOS ACTIVOS</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4 font-medium">{plan.nombre}</td>
                  <td className="py-3 px-4 text-dashboard-primary font-bold">
                    {formatPrice(Number(plan.precio_q))}
                  </td>
                  <td className="py-3 px-4">{plan.duracion_dias} días</td>
                  <td className="py-3 px-4">{plan.usuarios_activos}</td>
                  <td className="py-3 px-4">
                    <PlanActions plan={plan} onEdit={handleEdit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {plans.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron planes.</p>
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