import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrchid, deleteOrchid } from "../services/orchidApi";

export default function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orchid, setOrchid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getOrchid(id)
      .then((res) => {
        setOrchid(res.data);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.status === 404 ? "Orchid not found." : err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!orchid) return;
    if (!window.confirm(`Are you sure you want to delete "${orchid.orchidName}"?`)) return;
    try {
      await deleteOrchid(orchid.orchidId);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-secondary small">Loading orchid details...</p>
      </div>
    );
  }

  if (error || !orchid) {
    return (
      <div className="panel-card p-5 text-center">
        <h4 className="fw-semibold text-danger mb-2">Error</h4>
        <p className="text-secondary mb-4">{error || "Orchid record could not be loaded."}</p>
        <Link to="/" className="btn btn-outline-secondary">
          &larr; Back to Catalog List
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-3">
        <Link to="/" className="text-decoration-none text-secondary small">
          &larr; Back to Catalog List
        </Link>
      </div>

      <div className="panel-card p-4 p-lg-5">
        <div className="row g-4 align-items-start">
          {/* Left Column: Image */}
          <div className="col-12 col-md-5">
            <div
              className="border rounded-3 overflow-hidden bg-light d-flex align-items-center justify-content-center"
              style={{ minHeight: "320px", maxHeight: "420px" }}
            >
              {orchid.orchidURL ? (
                <img
                  src={orchid.orchidURL}
                  alt={orchid.orchidName}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-muted small p-4 text-center">
                  No image available for this orchid
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information & Details */}
          <div className="col-12 col-md-7">
            {/* Badges Bar */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge-clean badge-clean-category">
                {orchid.orchidCategory || "Uncategorized"}
              </span>
              {orchid.natural ? (
                <span className="badge-clean badge-clean-natural">Natural Species</span>
              ) : (
                <span className="badge-clean badge-clean-hybrid">Hybrid Cultivar</span>
              )}
              {orchid.attractive && (
                <span className="badge-clean badge-clean-attractive">Attractive Bloom</span>
              )}
            </div>

            {/* Title & ID */}
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <h1 className="page-title mb-0">{orchid.orchidName}</h1>
              <span className="text-muted fw-semibold">#{orchid.orchidId}</span>
            </div>

            {/* Description */}
            <div className="my-4">
              <div className="text-uppercase small fw-bold text-muted mb-2" style={{ letterSpacing: "0.05em" }}>
                Description
              </div>
              <p className="text-secondary" style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
                {orchid.orchidDescription || "No detailed description provided for this species."}
              </p>
            </div>

            {/* Details Table */}
            <div className="border rounded-3 p-3 bg-light mb-4">
              <div className="row g-3 small">
                <div className="col-sm-6">
                  <div className="text-muted fw-semibold">Category</div>
                  <div className="text-dark fw-bold mt-1">{orchid.orchidCategory || "—"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted fw-semibold">Origin Status</div>
                  <div className="text-dark fw-bold mt-1">
                    {orchid.natural ? "Natural (Wild species)" : "Hybrid (Artificially cultivated)"}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted fw-semibold">Visual Highlight</div>
                  <div className="text-dark fw-bold mt-1">
                    {orchid.attractive ? "Featured bloom appeal" : "Standard species"}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted fw-semibold">Catalog ID</div>
                  <div className="text-dark fw-bold mt-1">ID #{orchid.orchidId}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 pt-2 border-top">
              <Link to={`/orchids/${orchid.orchidId}/edit`} className="btn btn-action-edit-clean px-4 py-2 text-decoration-none">
                Edit Orchid
              </Link>
              <button onClick={handleDelete} className="btn btn-action-delete-clean px-4 py-2 border-0">
                Delete Orchid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
