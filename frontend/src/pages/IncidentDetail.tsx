import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { incidentsApi, Incident } from '../api/incidents';

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadIncident(id);
    }
  }, [id]);

  const loadIncident = async (incidentId: string) => {
    try {
      setLoading(true);
      const data = await incidentsApi.getById(incidentId);
      setIncident(data);
    } catch (error) {
      console.error('Error loading incident:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!incident) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Incidencia no encontrada</p>
          <Link
            to="/incidents"
            className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
          >
            ← Volver a incidencias
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Link
            to="/incidents"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Volver a incidencias
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {incident.reference}
                </h1>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(
                    incident.priority?.name
                  )}`}
                >
                  {incident.priority?.name}
                </span>
                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                  {incident.status?.name}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{incident.title}</p>
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Descripción
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {incident.description}
          </p>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <Link
                  to={`/clients/${incident.client_id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-1"
                >
                  {incident.client?.name}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prioridad</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {incident.priority?.name}
                </p>
              </div>
              {incident.severity && (
                <div>
                  <p className="text-sm text-gray-600">Severidad</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {incident.severity.name}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {incident.status?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fechas</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Fecha de reporte</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date(incident.reported_date).toLocaleString()}
                </p>
              </div>
              {incident.due_date && (
                <div>
                  <p className="text-sm text-gray-600">Fecha límite</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(incident.due_date).toLocaleString()}
                  </p>
                </div>
              )}
              {incident.closed_at && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de cierre</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(incident.closed_at).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Reportado por</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {incident.reportedUser?.name || 'Usuario desconocido'}
                </p>
              </div>
              {incident.assignedUser && (
                <div>
                  <p className="text-sm text-gray-600">Asignado a</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {incident.assignedUser.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resolución */}
        {incident.resolution && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resolución
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {incident.resolution}
            </p>
          </div>
        )}

        {/* Comentarios */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comentarios ({incident._count?.comments || 0})
          </h2>
          <p className="text-center text-gray-500 py-8">
            Funcionalidad de comentarios próximamente
          </p>
        </div>

        {/* Archivos adjuntos */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Archivos Adjuntos ({incident._count?.attachments || 0})
          </h2>
          <p className="text-center text-gray-500 py-8">
            Funcionalidad de archivos próximamente
          </p>
        </div>

        {/* Registro de tiempos */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Registro de Tiempos ({incident._count?.timeEntries || 0})
          </h2>
          <p className="text-center text-gray-500 py-8">
            Funcionalidad de tiempos próximamente
          </p>
        </div>
      </div>
    </Layout>
  );
}
