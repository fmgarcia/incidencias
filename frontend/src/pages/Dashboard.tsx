import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { incidentsApi, IncidentSummary, Incident } from '../api/incidents';

export default function Dashboard() {
  const [summary, setSummary] = useState<IncidentSummary | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, incidentsData] = await Promise.all([
        incidentsApi.getSummary(),
        incidentsApi.getAll({ limit: 5 }),
      ]);
      setSummary(summaryData);
      setRecentIncidents(incidentsData.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen de incidencias</p>
        </div>

        {/* Resumen de estados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.total || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Abiertas</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{summary?.open || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600">En Progreso</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{summary?.in_progress || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Resueltas</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{summary?.resolved || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Cerradas</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{summary?.closed || 0}</p>
          </div>
        </div>

        {/* Por prioridad */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Prioridad</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summary?.byPriority &&
              Object.entries(summary.byPriority).map(([priority, count]) => (
                <div key={priority} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{priority}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Incidencias recientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Incidencias Recientes</h2>
            <Link to="/incidents" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay incidencias</p>
            ) : (
              recentIncidents.map((incident) => (
                <Link
                  key={incident.id}
                  to={`/incidents/${incident.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{incident.reference}</p>
                      <p className="text-sm text-gray-600 mt-1">{incident.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{incident.client?.name}</p>
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
