import { useState, useEffect } from "react";
import { commentsApi, Comment, CreateCommentData } from "../api/comments";

interface CommentsListProps {
  incidentId: string;
  onUpdate?: () => void;
}

export default function CommentsList({
  incidentId,
  onUpdate,
}: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateCommentData>({
    content: "",
    visibility: "public",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadComments();
  }, [incidentId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsApi.getByIncident(incidentId);
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.content.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    try {
      await commentsApi.create(incidentId, formData);
      setFormData({
        content: "",
        visibility: "public",
      });
      setShowForm(false);
      loadComments();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error creating comment:", error);
      setError(error.response?.data?.message || "Error al crear el comentario");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este comentario?")) return;

    try {
      await commentsApi.delete(id);
      loadComments();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Error al eliminar el comentario");
    }
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
        <p className="text-gray-500">Cargando comentarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Comentarios</h3>
          <p className="text-sm text-gray-600">
            {comments.length}{" "}
            {comments.length === 1 ? "comentario" : "comentarios"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm"
        >
          {showForm ? "Cancelar" : "+ Agregar Comentario"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4">Nuevo Comentario</h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="label">Comentario *</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Escribe tu comentario aquí..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label">Visibilidad</label>
              <select
                className="input"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility: e.target.value as "public" | "internal",
                  })
                }
              >
                <option value="public">Público</option>
                <option value="internal">Interno</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Los comentarios internos solo son visibles para el equipo
              </p>
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
              Publicar Comentario
            </button>
          </div>
        </form>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No hay comentarios</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`card ${
                comment.visibility === "internal"
                  ? "border-yellow-200 bg-yellow-50"
                  : "hover:border-blue-200"
              } transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {comment.user && (
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user.full_name || comment.user.username}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDateTime(comment.created_at)}
                    </span>
                    {comment.visibility === "internal" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                        🔒 Interno
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-4"
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
