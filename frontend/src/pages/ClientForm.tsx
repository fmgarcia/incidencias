import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { clientsApi, CreateClientData } from "../api/clients";

export default function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateClientData>({
    name: "",
    legal_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "España",
    notes: "",
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadClient(id);
    }
  }, [id]);

  const loadClient = async (clientId: string) => {
    try {
      setLoading(true);
      const client = await clientsApi.getById(clientId);
      setFormData({
        name: client.name,
        legal_name: client.legal_name || "",
        contact_name: client.contact_name || "",
        contact_email: client.contact_email || "",
        contact_phone: client.contact_phone || "",
        address: client.address || "",
        city: client.city || "",
        province: client.province || "",
        postal_code: client.postal_code || "",
        country: client.country || "España",
        notes: client.notes || "",
        is_active: client.is_active,
      });
    } catch (error) {
      console.error("Error loading client:", error);
      setError("Error al cargar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await clientsApi.update(id, formData);
      } else {
        await clientsApi.create(formData);
      }
      navigate("/clients");
    } catch (error: any) {
      console.error("Error saving client:", error);
      setError(error.response?.data?.message || "Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link
            to="/clients"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Volver a clientes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Editar Cliente" : "Nuevo Cliente"}
          </h1>
          <p className="text-gray-600 mt-1">
            {id
              ? "Modifica los datos del cliente"
              : "Completa el formulario para crear un nuevo cliente"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Cliente *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="legal_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre Legal / CIF
              </label>
              <input
                type="text"
                id="legal_name"
                name="legal_name"
                className="input"
                value={formData.legal_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="contact_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Persona de Contacto
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                className="input"
                value={formData.contact_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="contact_email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email de Contacto
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                className="input"
                value={formData.contact_email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="contact_phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                className="input"
                value={formData.contact_phone}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="input"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Provincia
              </label>
              <input
                type="text"
                id="province"
                name="province"
                className="input"
                value={formData.province}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="postal_code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código Postal
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                className="input"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                País
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="input"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                className="input"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Cliente activo
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Guardando..."
                : id
                  ? "Actualizar Cliente"
                  : "Crear Cliente"}
            </button>
            <Link to="/clients" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
