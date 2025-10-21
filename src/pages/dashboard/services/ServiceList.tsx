// roshi_fit/src/pages/dashboard/services/ServiceList.tsx
import React, { useState, useEffect } from 'react';
import { fetchServices } from '../../../api/serviceApi';
import type { Service, ServiceFilters } from '../../../types/Service';
import ServiceFiltersComponent from './ServiceFilters';
import ServiceActions from './ServiceActions';
import CreateServiceModal from './CreateServiceModal';
import EditServiceModal from './EditServiceModal';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    estado: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices(filters);
        setServices(data);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [filters]);

  const handleAddService = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '', estado: '' });
  const handleEdit = (id: number) => setEditingServiceId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(precio);
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <ServiceFiltersComponent onFilterChange={setFilters} onAddService={handleAddService} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando servicios...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">IMAGEN</th>
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">DURACIÓN</th>
                <th className="py-3 px-4 text-left">PRECIO</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4">
                    {service.imagen ? (
                      <img
                        src={`/public/assets/products/${service.imagen}`}
                        alt={service.nombre} 
                        className="w-12 h-12 object-cover rounded border border-dashboard-accent"
                        onError={(e) => (e.currentTarget.src = '/public/assets/placeholder.jpg')}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-dashboard-accent rounded flex items-center justify-center text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{service.nombre}</td>
                  <td className="py-3 px-4">{service.duracion_minutos} min</td>
                  <td className="py-3 px-4 text-dashboard-primary font-bold">
                    {formatPrice(service.precio_q)}
                  </td>
                  <td className="py-3 px-4">{formatStatus(service.estado)}</td>
                  <td className="py-3 px-4">
                    <ServiceActions
                      service={service}
                      onEdit={handleEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {services.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron servicios.</p>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateServiceModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingServiceId && (
        <EditServiceModal
          serviceId={editingServiceId}
          onClose={() => setEditingServiceId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ServiceList;