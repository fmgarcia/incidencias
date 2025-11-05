import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { clientsApi, Client } from '../api/clients';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cif.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">{clients.length} clientes registrados</p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="card">
          <input
            type="text"
            placeholder="Buscar por nombre, CIF o email..."
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No se encontraron clientes</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="card hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">CIF: {client.cif}</p>
                    {client.email && (
                      <p className="text-sm text-gray-600 mt-1">{client.email}</p>
                    )}
                    {client.phone && (
                      <p className="text-sm text-gray-600 mt-1">{client.phone}</p>
                    )}
                    {client.city && (
                      <p className="text-sm text-gray-500 mt-2">{client.city}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      client.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {client.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
