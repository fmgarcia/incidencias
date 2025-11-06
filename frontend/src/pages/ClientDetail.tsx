import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { clientsApi, Client } from "../api/clients";
import { incidentsApi, Incident } from "../api/incidents";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      setIncidents(incidentsData.incidents || incidentsData.data || []);
    } catch (error) {
      console.error("Error loading client:", error);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!client || !id) return;

    try {
      await clientsApi.update(id, { is_active: !client.is_active });
      setClient({ ...client, is_active: !client.is_active });
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Error al cambiar el estado del cliente");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await clientsApi.delete(id);
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      alert(
        "Error al eliminar el cliente. Asegúrate de que no tenga incidencias asociadas."
      );
      setShowDeleteConfirm(false);
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
          <Link
            to="/clients"
            className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
          >
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
          <Link
            to="/clients"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Volver a clientes
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {client.name}
              </h1>
              <p className="text-gray-600 mt-1">Información del cliente</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/clients/${id}/edit`} className="btn-secondary">
                Editar
              </Link>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  client.is_active
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {client.is_active ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-lg font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Datos del Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.legal_name && (
              <div>
                <p className="text-sm text-gray-600">Nombre Legal / CIF</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.legal_name}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {client.is_active ? "Activo" : "Inactivo"}
              </p>
            </div>
            {client.contact_name && (
              <div>
                <p className="text-sm text-gray-600">Persona de Contacto</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.contact_name}
                </p>
              </div>
            )}
            {client.contact_email && (
              <div>
                <p className="text-sm text-gray-600">Email de Contacto</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.contact_email}
                </p>
              </div>
            )}
            {client.contact_phone && (
              <div>
                <p className="text-sm text-gray-600">Teléfono de Contacto</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.contact_phone}
                </p>
              </div>
            )}
            {client.address && (
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.address}
                </p>
              </div>
            )}
            {client.city && (
              <div>
                <p className="text-sm text-gray-600">Ciudad</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.city} {client.province && `(${client.province})`}{" "}
                  {client.postal_code && `- CP: ${client.postal_code}`}
                </p>
              </div>
            )}
            {client.country && (
              <div>
                <p className="text-sm text-gray-600">País</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.country}
                </p>
              </div>
            )}
            {client.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Notas</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {client.notes}
                </p>
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
              <p className="text-center text-gray-500 py-8">
                No hay incidencias para este cliente
              </p>
            ) : (
              incidents.map((incident) => (
                <Link
                  key={incident.id}
                  to={`/incidents/${incident.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {incident.reference}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {incident.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(incident.reported_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          incident.priority?.name === "urgent"
                            ? "bg-red-100 text-red-800"
                            : incident.priority?.name === "high"
                              ? "bg-orange-100 text-orange-800"
                              : incident.priority?.name === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
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

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmar eliminación
              </h3>
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar este cliente? Esta acción
                no se puede deshacer.
                {incidents.length > 0 && (
                  <span className="block mt-2 text-red-600 font-medium">
                    Advertencia: Este cliente tiene {incidents.length}{" "}
                    incidencia(s) asociada(s).
                  </span>
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
