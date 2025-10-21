// roshi_fit/src/pages/dashboard/suppliers/SupplierList.tsx
import React, { useState, useEffect } from 'react';
import { fetchSuppliers } from '../../../api/supplierApi';
import { type Supplier, type SupplierFilters } from '../../../types/Supplier';
import SupplierFiltersComponent from './SupplierFilters';
import SupplierActions from './SupplierActions';
import CreateSupplierModal from './CreateSupplierModal';
import EditSupplierModal from './EditSupplierModal';

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
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <SupplierFiltersComponent onFilterChange={setFilters} onAddSupplier={handleAddSupplier} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando proveedores...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">EMPRESA</th>
                <th className="py-3 px-4 text-left">CONTACTO</th>
                <th className="py-3 px-4 text-left">EMAIL</th>
                <th className="py-3 px-4 text-left">TELÉFONO</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4 font-medium">{supplier.nombre_empresa}</td>
                  <td className="py-3 px-4">{supplier.contacto_nombre || '—'}</td>
                  <td className="py-3 px-4">{supplier.email}</td>
                  <td className="py-3 px-4">{supplier.telefono || '—'}</td>
                  <td className="py-3 px-4">{formatStatus(supplier.estado)}</td>
                  <td className="py-3 px-4">
                    <SupplierActions
                      supplier={supplier}
                      onEdit={handleEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {suppliers.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron proveedores.</p>
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