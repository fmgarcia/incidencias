import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { incidentsApi, Incident } from "../api/incidents";
import { statusesApi, Status } from "../api/statuses";
import TimeEntriesList from "../components/TimeEntriesList";
import CommentsList from "../components/CommentsList";

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      loadIncident(id);
    }
    loadStatuses();
  }, [id]);

  const loadStatuses = async () => {
    try {
      const data = await statusesApi.getAll();
      setStatuses(data);
    } catch (error) {
      console.error("Error loading statuses:", error);
    }
  };

  const loadIncident = async (incidentId: string) => {
    try {
      setLoading(true);
      const data = await incidentsApi.getById(incidentId);
      setIncident(data);
    } catch (error) {
      console.error("Error loading incident:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    if (id) {
      loadIncident(id);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "¿Está seguro de eliminar esta incidencia? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await incidentsApi.delete(id!);
      navigate("/incidents");
    } catch (error) {
      console.error("Error deleting incident:", error);
      alert("Error al eliminar la incidencia");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = async () => {
    const resolution = prompt(
      "¿Desea agregar una resolución antes de cerrar la incidencia? (Opcional)"
    );

    // Si el usuario cancela el prompt, no hacer nada
    if (resolution === null) {
      return;
    }

    try {
      setClosing(true);
      await incidentsApi.close(id!, resolution || undefined);
      // Recargar la incidencia para mostrar el estado actualizado
      if (id) {
        loadIncident(id);
      }
    } catch (error) {
      console.error("Error closing incident:", error);
      alert("Error al cerrar la incidencia");
    } finally {
      setClosing(false);
    }
  };

  const handleStatusChange = async (newStatusId: number) => {
    if (!id) return;

    try {
      setChangingStatus(true);
      await incidentsApi.changeStatus(id, newStatusId);
      // Recargar la incidencia
      loadIncident(id);
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Error al cambiar el estado");
    } finally {
      setChangingStatus(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

                {/* Selector de estado */}
                <div className="relative">
                  <select
                    value={incident.status_id}
                    onChange={(e) => handleStatusChange(Number(e.target.value))}
                    disabled={changingStatus}
                    className="appearance-none rounded-full bg-gray-100 px-4 py-1 pr-8 text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                  >
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mt-1">{incident.title}</p>
            </div>
            <div className="flex gap-2">
              {!incident.status?.is_closed && (
                <button
                  onClick={handleClose}
                  disabled={closing}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {closing ? "Cerrando..." : "Cerrar"}
                </button>
              )}
              <Link
                to={`/incidents/${id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
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
                  {incident.reportedUser?.name || "Usuario desconocido"}
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
          <CommentsList incidentId={id!} onUpdate={handleUpdate} />
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
          <TimeEntriesList incidentId={id!} onUpdate={handleUpdate} />
        </div>
      </div>
    </Layout>
  );
}
