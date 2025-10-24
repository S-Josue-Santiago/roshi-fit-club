// roshi_fit/src/pages/dashboard/suppliers/SupplierList.tsx
import React, { useState, useEffect } from 'react';
import { fetchSuppliers } from '../../../api/supplierApi';
import { type Supplier, type SupplierFilters } from '../../../types/Supplier';
import SupplierFiltersComponent from './SupplierFilters';
import SupplierActions from './SupplierActions';
import CreateSupplierModal from './CreateSupplierModal';
import EditSupplierModal from './EditSupplierModal';
import { Building, User, Mail, Phone, Activity } from 'lucide-react';

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SupplierFilters>({ search: '', estado: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);

  useEffect(() => {
    const loadSuppliers = async () => {
      setLoading(true);
      try {
        const data = await fetchSuppliers(filters);
        setSuppliers(data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSuppliers();
  }, [filters]);

  const handleAddSupplier = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '', estado: '' });
  const handleEdit = (id: number) => setEditingSupplierId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-600 font-bold bg-green-600/20 px-3 py-1 rounded-full border border-green-600/30">✅ Activo</span>
      : <span className="text-yellow-600 font-bold bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-600/30">⏸️ Inactivo</span>;
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <SupplierFiltersComponent onFilterChange={setFilters} onAddSupplier={handleAddSupplier} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          {/* Tabla responsiva */}
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-orange-400" />
                        EMPRESA
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-orange-400" />
                        CONTACTO
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-orange-400" />
                        EMAIL
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-orange-400" />
                        TELÉFONO
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-orange-400" />
                        ESTADO
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm 
                      font-black text-dashboard-text uppercase tracking-wider
                    ">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {suppliers.map(supplier => (
                    <tr 
                      key={supplier.id} 
                      className="
                        transition-all duration-300 
                        hover:bg-black hover:bg-opacity-80
                        group bg-dashboard-accent/5
                      "
                    >
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm 
                        text-dashboard-text font-semibold group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-orange-400 group-hover:text-orange-300" />
                          {supplier.nombre_empresa}
                        </div>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm 
                        text-dashboard-text group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {supplier.contacto_nombre || (
                          <span className="text-dashboard-text-secondary/50 italic">
                            No especificado
                          </span>
                        )}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm 
                        text-dashboard-text group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {supplier.email}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm 
                        text-dashboard-text group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {supplier.telefono || (
                          <span className="text-dashboard-text-secondary/50 italic">
                            No especificado
                          </span>
                        )}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm 
                        border-r border-dashboard-accent/30
                      ">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          {formatStatus(supplier.estado)}
                        </div>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm
                      ">
                        <SupplierActions
                          supplier={supplier}
                          onEdit={handleEdit}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {suppliers.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">🏭</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron proveedores</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateSupplierModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingSupplierId && (
        <EditSupplierModal
          supplierId={editingSupplierId}
          onClose={() => setEditingSupplierId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default SupplierList;