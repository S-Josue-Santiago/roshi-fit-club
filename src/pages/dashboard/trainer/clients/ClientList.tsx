// src/pages/dashboard/trainer/clients/ClientList.tsx
import React, { useState, useEffect } from 'react';
import { fetchClients } from '../../../../api/trainingApi';
import type { Client } from '../../../../types/Training';
import { Link } from 'react-router-dom';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients().then(setClients).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <h2 className="text-xl font-bold text-dashboard-text mb-4">Mis Clientes</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-dashboard-accent/50">
                  <td className="py-2 px-4">{client.nombre_completo}</td>
                  <td className="py-2 px-4">{client.email}</td>
                  <td className="py-2 px-4">
                    <Link 
                      to={`/dashboard/entrenador/clientes/${client.id}`}
                      className="text-dashboard-primary hover:underline"
                    >
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientList;