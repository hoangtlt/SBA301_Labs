import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrchids, deleteOrchid } from "../services/orchidApi";

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getOrchids();
      setOrchids(response.data);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete orchid "${name || id}"?`)) return;
    try {
      await deleteOrchid(id);
      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const filteredOrchids = orchids.filter((o) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (o.orchidName || "").toLowerCase().includes(term);
    const catMatch = (o.orchidCategory || "").toLowerCase().includes(term);
    return nameMatch || catMatch;
  });

  const totalCount = orchids.length;
  const naturalCount = orchids.filter((o) => o.natural).length;
  const attractiveCount = orchids.filter((o) => o.attractive).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-secondary small">Loading orchid catalog...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}

      {/* Header Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="page-title">Orchids</h1>
          <p className="page-subtitle">Manage and browse all orchid species in the catalog</p>
        </div>
        <Link className="btn btn-brand-primary" to="/orchids/new">
          Create Orchid
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="metric-box shadow-sm">
            <div className="metric-label">Total Catalog</div>
            <div className="metric-number">{totalCount}</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="metric-box shadow-sm">
            <div className="metric-label">Natural Species</div>
            <div className="metric-number">{naturalCount}</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="metric-box shadow-sm">
            <div className="metric-label">Attractive Orchids</div>
            <div className="metric-number">{attractiveCount}</div>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="panel-card">
        {/* Search & Counter Filter */}
        <div className="p-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2 bg-white">
          <div style={{ maxWidth: "340px", width: "100%" }}>
            <input
              type="text"
              className="form-control form-control-clean"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-secondary small">
            Showing <strong>{filteredOrchids.length}</strong> of {totalCount} items
          </div>
        </div>

        {/* Table Content */}
        {filteredOrchids.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="fw-semibold text-secondary">No orchids found</h5>
            <p className="text-muted small mb-3">
              {searchTerm
                ? "Try searching with a different term."
                : "No orchids have been created yet."}
            </p>
            {!searchTerm && (
              <Link className="btn btn-brand-primary" to="/orchids/new">
                Create First Orchid
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table orchid-table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>ID</th>
                  <th>Name & Details</th>
                  <th>Category</th>
                  <th>Origin</th>
                  <th>Highlight</th>
                  <th style={{ width: "220px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrchids.map((o) => (
                  <tr key={o.orchidId}>
                    <td className="fw-semibold text-muted">#{o.orchidId}</td>
                    <td>
                      <Link
                        to={`/orchids/${o.orchidId}`}
                        className="d-flex align-items-center gap-3 text-decoration-none"
                      >
                        {o.orchidURL ? (
                          <img
                            src={o.orchidURL}
                            alt={o.orchidName}
                            className="table-orchid-img"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="table-orchid-img-placeholder">IMG</div>
                        )}
                        <div>
                          <div className="fw-semibold text-dark">{o.orchidName}</div>
                          {o.orchidDescription && (
                            <div
                              className="text-muted small text-truncate"
                              style={{ maxWidth: "260px" }}
                            >
                              {o.orchidDescription}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span className="badge-clean badge-clean-category">
                        {o.orchidCategory || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      {o.natural ? (
                        <span className="badge-clean badge-clean-natural">Natural</span>
                      ) : (
                        <span className="badge-clean badge-clean-hybrid">Hybrid</span>
                      )}
                    </td>
                    <td>
                      {o.attractive ? (
                        <span className="badge-clean badge-clean-attractive">Attractive</span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="d-inline-flex gap-2">
                        <Link
                          className="btn-action btn-action-view-clean"
                          to={`/orchids/${o.orchidId}`}
                        >
                          Detail
                        </Link>
                        <Link
                          className="btn-action btn-action-edit-clean"
                          to={`/orchids/${o.orchidId}/edit`}
                        >
                          Edit
                        </Link>
                        <button
                          className="btn-action btn-action-delete-clean border-0"
                          onClick={() => handleDelete(o.orchidId, o.orchidName)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
