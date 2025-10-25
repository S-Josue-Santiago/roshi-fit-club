// roshi_fit/src/pages/dashboard/services/ServiceList.tsx
import React, { useState, useEffect } from 'react';
import { fetchServices } from '../../../api/serviceApi';
import type { Service, ServiceFilters } from '../../../types/Service';
import ServiceFiltersComponent from './ServiceFilters';
import ServiceActions from './ServiceActions';
import CreateServiceModal from './CreateServiceModal';
import EditServiceModal from './EditServiceModal';
import { Dumbbell, Image, Clock, DollarSign, Activity } from 'lucide-react';

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
      ? <span className="text-green-600 font-bold bg-green-600/20 px-3 py-1 rounded-full border border-green-600/30">✅ Activo</span>
      : <span className="text-yellow-600 font-bold bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-600/30">⏸️ Inactivo</span>;
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
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <Dumbbell size={24} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">SERVICIOS</h1>
      </div>

      <ServiceFiltersComponent onFilterChange={setFilters} onAddService={handleAddService} />

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
                      <div className="flex items-center gap-2"><Image size={16} className="text-purple-400" />IMAGEN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Dumbbell size={16} className="text-purple-400" />NOMBRE</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Clock size={16} className="text-purple-400" />DURACIÓN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><DollarSign size={16} className="text-purple-400" />PRECIO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Activity size={16} className="text-purple-400" />ESTADO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {services.map(service => (
                    <tr key={service.id} className="transition-all duration-300 hover:bg-black hover:bg-opacity-80 group bg-dashboard-accent/5">
                      <td className="px-4 py-4 whitespace-nowrap border-r border-dashboard-accent/30">
                        {service.imagen ? (
                          <img
                            src={`/assets/products/${service.imagen}`}
                            alt={service.nombre}
                            className="w-14 h-14 object-cover rounded-lg border-2 border-dashboard-accent/50 group-hover:border-purple-500 transition-all duration-300 group-hover:scale-110"
                            onError={(e) => (e.currentTarget.src = '/assets/placeholderservicios.png')}
                          />
                        ) : (
                          <div className="w-14 h-14 bg-dashboard-accent rounded-lg flex items-center justify-center text-dashboard-text-secondary border-2 border-dashboard-accent/50">
                            <Dumbbell size={24} />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {service.nombre}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">
                        {service.duracion_minutos ? `${service.duracion_minutos} min` : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {formatPrice(Number(service.precio_q))}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-dashboard-accent/30">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          {formatStatus(service.estado)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <ServiceActions
                          service={service}
                          onEdit={handleEdit}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {services.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">🏋️</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron servicios</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda o crea uno nuevo.
              </p>
            </div>
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