import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { clientsApi, Client } from '../api/clients';
import { incidentsApi, Incident } from '../api/incidents';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadClientData(id);
    }
  }, [id]);

  const loadClientData = async (clientId: string) => {
    try {
      setLoading(true);
      const [clientData, incidentsData] = await Promise.all([
        clientsApi.getById(clientId),
        incidentsApi.getAll({ clientId }),
      ]);
      setClient(clientData);
      setIncidents(incidentsData.data);
    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Cliente no encontrado</p>
          <Link to="/clients" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ← Volver a clientes
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Link to="/clients" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Volver a clientes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-600 mt-1">Información del cliente</p>
        </div>

        {/* Información del cliente */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">CIF</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{client.cif}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {client.is_active ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            {client.email && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{client.email}</p>
              </div>
            )}
            {client.phone && (
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{client.phone}</p>
              </div>
            )}
            {client.address && (
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{client.address}</p>
              </div>
            )}
            {client.city && (
              <div>
                <p className="text-sm text-gray-600">Ciudad</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.city} {client.postal_code && `(${client.postal_code})`}
                </p>
              </div>
            )}
            {client.contact_name && (
              <div>
                <p className="text-sm text-gray-600">Persona de contacto</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{client.contact_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Incidencias del cliente */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Incidencias ({incidents.length})
            </h2>
            <Link
              to="/incidents/new"
              state={{ clientId: client.id }}
              className="btn-primary text-sm"
            >
              Nueva incidencia
            </Link>
          </div>
          <div className="space-y-3">
            {incidents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay incidencias para este cliente</p>
            ) : (
              incidents.map((incident) => (
                <Link
                  key={incident.id}
                  to={`/incidents/${incident.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{incident.reference}</p>
                      <p className="text-sm text-gray-600 mt-1">{incident.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(incident.reported_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          incident.priority?.name === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : incident.priority?.name === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : incident.priority?.name === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {incident.priority?.name}
                      </span>
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                        {incident.status?.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
