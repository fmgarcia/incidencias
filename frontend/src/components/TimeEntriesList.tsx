import { useState, useEffect } from "react";
import {
  timeEntriesApi,
  TimeEntry,
  CreateTimeEntryData,
} from "../api/timeEntries";

interface TimeEntriesListProps {
  incidentId: string;
  onUpdate?: () => void;
}

export default function TimeEntriesList({
  incidentId,
  onUpdate,
}: TimeEntriesListProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateTimeEntryData>({
    start_time: "",
    end_time: "",
    minutes: 0,
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadTimeEntries();
  }, [incidentId]);

  const loadTimeEntries = async () => {
    try {
      setLoading(true);
      const data = await timeEntriesApi.getByIncident(incidentId);
      setTimeEntries(data.timeEntries || []);
      setTotalMinutes(data.totalMinutes || 0);
    } catch (error) {
      console.error("Error loading time entries:", error);
      setTimeEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.start_time) {
      setError("La fecha de inicio es obligatoria");
      return;
    }

    if (formData.minutes <= 0) {
      setError("Los minutos deben ser mayor a 0");
      return;
    }

    try {
      await timeEntriesApi.create(incidentId, formData);
      setFormData({
        start_time: "",
        end_time: "",
        minutes: 0,
        description: "",
      });
      setShowForm(false);
      loadTimeEntries();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error creating time entry:", error);
      setError(error.response?.data?.message || "Error al crear el registro");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este registro de tiempo?")) return;

    try {
      await timeEntriesApi.delete(id);
      loadTimeEntries();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting time entry:", error);
      alert("Error al eliminar el registro");
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Cargando registros de tiempo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tiempo Dedicado
          </h3>
          <p className="text-sm text-gray-600">
            Total:{" "}
            <span className="font-semibold text-blue-600">
              {formatDuration(totalMinutes)}
            </span>{" "}
            ({timeEntries.length}{" "}
            {timeEntries.length === 1 ? "registro" : "registros"})
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm"
        >
          {showForm ? "Cancelar" : "+ Agregar Tiempo"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4">
            Nuevo Registro de Tiempo
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha y Hora de Inicio *</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.start_time}
                onChange={(e) => {
                  const newStartTime = e.target.value;
                  setFormData((prev) => {
                    const updated = { ...prev, start_time: newStartTime };
                    // Calcular minutos si hay fecha de fin
                    if (newStartTime && prev.end_time) {
                      const start = new Date(newStartTime);
                      const end = new Date(prev.end_time);
                      const diffMs = end.getTime() - start.getTime();
                      const diffMins = Math.round(diffMs / 60000);
                      if (diffMins > 0) {
                        updated.minutes = diffMins;
                      }
                    }
                    return updated;
                  });
                }}
                required
              />
            </div>

            <div>
              <label className="label">Fecha y Hora de Fin</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.end_time}
                onChange={(e) => {
                  const newEndTime = e.target.value;
                  setFormData((prev) => {
                    const updated = { ...prev, end_time: newEndTime };
                    // Calcular minutos si hay fecha de inicio
                    if (prev.start_time && newEndTime) {
                      const start = new Date(prev.start_time);
                      const end = new Date(newEndTime);
                      const diffMs = end.getTime() - start.getTime();
                      const diffMins = Math.round(diffMs / 60000);
                      if (diffMins > 0) {
                        updated.minutes = diffMins;
                      }
                    }
                    return updated;
                  });
                }}
              />
            </div>

            <div>
              <label className="label">Duración (minutos) *</label>
              <input
                type="number"
                className="input"
                min="1"
                value={formData.minutes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minutes: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
              {formData.start_time && formData.end_time && (
                <p className="text-xs text-gray-500 mt-1">
                  Calculado automáticamente desde las fechas
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea
                className="input"
                rows={3}
                placeholder="Describe el trabajo realizado..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Registro
            </button>
          </div>
        </form>
      )}

      {/* Lista de registros */}
      <div className="space-y-2">
        {timeEntries.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No hay registros de tiempo</p>
          </div>
        ) : (
          timeEntries.map((entry) => (
            <div
              key={entry.id}
              className="card hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {formatDuration(entry.minutes)}
                    </span>
                    {entry.user && (
                      <span className="text-sm text-gray-600">
                        {entry.user.full_name || entry.user.username}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Inicio:</span>{" "}
                      {formatDateTime(entry.start_time)}
                    </p>
                    {entry.end_time && (
                      <p>
                        <span className="font-medium">Fin:</span>{" "}
                        {formatDateTime(entry.end_time)}
                      </p>
                    )}
                  </div>

                  {entry.description && (
                    <p className="mt-2 text-sm text-gray-700">
                      {entry.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  title="Eliminar"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
