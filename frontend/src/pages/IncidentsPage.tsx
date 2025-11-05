import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { incidentsApi, Incident, IncidentFilters } from '../api/incidents';
import { clientsApi, Client } from '../api/clients';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IncidentFilters>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  const loadClients = async () => {
    try {
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsApi.getAll(filters);
      setIncidents(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof IncidentFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset to page 1 when changing other filters
    }));
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incidencias</h1>
            <p className="text-gray-600 mt-1">
              {pagination.total} incidencias encontradas
            </p>
          </div>
          <Link to="/incidents/new" className="btn-primary">
            Nueva incidencia
          </Link>
        </div>

        {/* Filtros */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Cliente</label>
              <select
                className="input"
                value={filters.clientId || ''}
                onChange={(e) =>
                  handleFilterChange('clientId', e.target.value || undefined)
                }
              >
                <option value="">Todos los clientes</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Estado</label>
              <select
                className="input"
                value={filters.statusId || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'statusId',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">Todos los estados</option>
                <option value="1">Abierto</option>
                <option value="2">En Progreso</option>
                <option value="3">Esperando Cliente</option>
                <option value="4">Resuelto</option>
                <option value="5">Cerrado</option>
                <option value="6">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="label">Prioridad</label>
              <select
                className="input"
                value={filters.priorityId || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'priorityId',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">Todas las prioridades</option>
                <option value="1">Baja</option>
                <option value="2">Media</option>
                <option value="3">Alta</option>
                <option value="4">Urgente</option>
              </select>
            </div>

            <div>
              <label className="label">Buscar</label>
              <input
                type="text"
                className="input"
                placeholder="Título o descripción..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              />
            </div>
          </div>
        </div>

        {/* Lista de incidencias */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {incidents.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-500">No se encontraron incidencias</p>
                </div>
              ) : (
                incidents.map((incident) => (
                  <Link
                    key={incident.id}
                    to={`/incidents/${incident.id}`}
                    className="card hover:border-blue-300 hover:shadow-md transition-all block"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-semibold text-blue-600">
                            {incident.reference}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(
                              incident.priority?.name
                            )}`}
                          >
                            {incident.priority?.name}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mt-2">
                          {incident.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {incident.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>{incident.client?.name}</span>
                          <span>•</span>
                          <span>
                            {new Date(incident.reported_date).toLocaleDateString()}
                          </span>
                          {incident._count && (
                            <>
                              <span>•</span>
                              <span>{incident._count.comments} comentarios</span>
                              <span>•</span>
                              <span>{incident._count.attachments} archivos</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                          {incident.status?.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => handleFilterChange('page', page)}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
