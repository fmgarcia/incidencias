import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { incidentsApi, CreateIncidentData } from '../api/incidents';
import { clientsApi, Client } from '../api/clients';

export default function IncidentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateIncidentData>({
    title: '',
    description: '',
    client_id: (location.state as any)?.clientId || '',
    priority_id: 2, // Media por defecto
    status_id: 1, // Abierto por defecto
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsApi.getAll();
      setClients(data.filter((c) => c.is_active));
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const incident = await incidentsApi.create(formData);
      navigate(`/incidents/${incident.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la incidencia');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'priority_id' || name === 'status_id'
          ? Number(value)
          : value,
    }));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nueva Incidencia
          </h1>
          <p className="text-gray-600 mt-1">
            Registra una nueva incidencia en el sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="card">
            <div className="space-y-4">
              <div>
                <label className="label">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  name="client_id"
                  className="input"
                  value={formData.client_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Breve descripción del problema"
                />
              </div>

              <div>
                <label className="label">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  className="input"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe el problema en detalle..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Prioridad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority_id"
                    className="input"
                    value={formData.priority_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">Baja</option>
                    <option value="2">Media</option>
                    <option value="3">Alta</option>
                    <option value="4">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="label">Severidad</label>
                  <select
                    name="severity_id"
                    className="input"
                    value={formData.severity_id || ''}
                    onChange={handleChange}
                  >
                    <option value="">No especificada</option>
                    <option value="1">Minor</option>
                    <option value="2">Major</option>
                    <option value="3">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Tipo de Problema</label>
                  <select
                    name="problem_type_id"
                    className="input"
                    value={formData.problem_type_id || ''}
                    onChange={handleChange}
                  >
                    <option value="">No especificado</option>
                    <option value="1">Red</option>
                    <option value="2">Software</option>
                    <option value="3">Hardware</option>
                    <option value="4">Seguridad</option>
                  </select>
                </div>

                <div>
                  <label className="label">Categoría</label>
                  <select
                    name="category_id"
                    className="input"
                    value={formData.category_id || ''}
                    onChange={handleChange}
                  >
                    <option value="">No especificada</option>
                    <option value="1">Infraestructura</option>
                    <option value="2">Aplicación</option>
                    <option value="3">Servicio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Fecha Límite</label>
                <input
                  type="datetime-local"
                  name="due_date"
                  className="input"
                  value={formData.due_date || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Incidencia'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
