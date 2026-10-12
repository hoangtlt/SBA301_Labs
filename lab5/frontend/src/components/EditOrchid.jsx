import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createOrchid, getOrchid, updateOrchid } from "../services/orchidApi";

const emptyForm = {
  orchidName: "",
  natural: false,
  orchidDescription: "",
  orchidCategory: "",
  attractive: false,
  orchidURL: "",
};

export default function EditOrchid({ createMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!createMode);

  useEffect(() => {
    if (!createMode && id) {
      setLoading(true);
      getOrchid(id)
        .then((r) => setForm(r.data))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [createMode, id]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (createMode) await createOrchid(form);
      else await updateOrchid(id, form);
      navigate("/");
    } catch (e) {
      setError(e.message);
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

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="mb-3">
        <Link to="/" className="text-decoration-none text-secondary small">
          &larr; Back to Catalog List
        </Link>
      </div>

      <div className="panel-card p-4 p-lg-5">
        <div className="border-bottom pb-3 mb-4">
          <h2 className="form-section-title">
            {createMode ? "Create New Orchid" : `Edit Orchid #${id}`}
          </h2>
          <p className="form-section-desc">
            {createMode
              ? "Fill in the required information to add an orchid species to the database."
              : "Update properties and attributes for this orchid record."}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4 shadow-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="row g-4">
            {/* Left Column: Form Fields */}
            <div className="col-12 col-lg-7">
              <div className="mb-3">
                <label className="form-label-clean">
                  Orchid Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-clean"
                  placeholder="e.g. Taichung Beauty"
                  name="orchidName"
                  value={form.orchidName ?? ""}
                  onChange={change}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label-clean">Category</label>
                <input
                  type="text"
                  className="form-control form-control-clean"
                  placeholder="e.g. Cattleya, Phalaenopsis, Dendrobium"
                  name="orchidCategory"
                  value={form.orchidCategory ?? ""}
                  onChange={change}
                />
              </div>

              <div className="mb-3">
                <label className="form-label-clean">Description</label>
                <textarea
                  className="form-control form-control-clean"
                  rows="3"
                  placeholder="Provide characteristic details, blooming season, origin..."
                  name="orchidDescription"
                  value={form.orchidDescription ?? ""}
                  onChange={change}
                />
              </div>

              <div className="mb-4">
                <label className="form-label-clean">Image URL</label>
                <input
                  type="text"
                  className="form-control form-control-clean"
                  placeholder="https://example.com/orchid-photo.jpg"
                  name="orchidURL"
                  value={form.orchidURL ?? ""}
                  onChange={change}
                />
              </div>

              {/* Attributes Toggles */}
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div className="form-check-card">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="natural"
                        id="naturalCheck"
                        checked={!!form.natural}
                        onChange={change}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="naturalCheck">
                        Natural Species
                      </label>
                      <div className="text-muted small" style={{ fontSize: "0.775rem" }}>
                        Wild or naturally occurring species
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="form-check-card">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="attractive"
                        id="attractiveCheck"
                        checked={!!form.attractive}
                        onChange={change}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="attractiveCheck">
                        Attractive Orchid
                      </label>
                      <div className="text-muted small" style={{ fontSize: "0.775rem" }}>
                        Featured or premium bloom appeal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Preview Panel */}
            <div className="col-12 col-lg-5">
              <label className="form-label-clean">Live Image Preview</label>
              <div className="form-preview-frame mb-3">
                {form.orchidURL ? (
                  <img
                    src={form.orchidURL}
                    alt="Orchid Preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="form-preview-empty">
                    Enter an image URL on the left to preview the photo
                  </div>
                )}
              </div>

              <div className="p-3 bg-light rounded border small text-secondary">
                <div className="fw-semibold text-dark mb-1">Entry Summary</div>
                <div>Name: {form.orchidName || "Not specified"}</div>
                <div>Category: {form.orchidCategory || "Uncategorized"}</div>
                <div>Status: {form.natural ? "Natural" : "Hybrid"}</div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="col-12 pt-3 border-top d-flex justify-content-end gap-2">
              <Link to="/" className="btn btn-outline-secondary px-4">
                Cancel
              </Link>
              <button type="submit" className="btn btn-brand-primary px-4">
                Save Orchid
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
