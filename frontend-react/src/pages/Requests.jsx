import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

const CONDITIONS = ["WORKING", "DAMAGED", "DEAD"];
const DEVICE_TYPES = ["Laptop", "Mobile", "Tablet", "Desktop", "Monitor", "Printer", "Battery", "Other"];
const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  PICKED_UP: "Picked Up",
  RECYCLED: "Recycled",
  REJECTED: "Rejected",
  OTHER: "Other"
};
const STATUS_DETAILS = {
  SUBMITTED: "Your pickup request is created and waiting for assignment.",
  PICKUP_SCHEDULED: "Pickup partner has been assigned for your request.",
  PICKED_UP: "Your device has been collected and moved for processing.",
  RECYCLED: "Recycling is completed for this request.",
  REJECTED: "This request was rejected. Please review details and resubmit.",
  OTHER: "Status has been updated."
};
const FORM_STEPS = [
  { id: 1, title: "Device", hint: "Tell us what you want to recycle" },
  { id: 2, title: "Pickup", hint: "Set where and how to collect it" },
  { id: 3, title: "Review", hint: "Confirm details and submit" }
];

export default function Requests({ mode = "all" }) {
  const navigate = useNavigate();
  const isSubmitOnly = mode === "submit";
  const isViewOnly = mode === "view";

  const [form, setForm] = useState({
    deviceType: "Laptop",
    customDeviceType: "",
    brand: "",
    model: "",
    condition: "WORKING",
    quantity: 1,
    pickupAddress: "",
    additionalRemarks: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [requests, setRequests] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationInfo, setLocationInfo] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [editingRequest, setEditingRequest] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    deviceType: "Laptop",
    customDeviceType: "",
    brand: "",
    model: "",
    condition: "WORKING",
    quantity: 1,
    pickupAddress: "",
    additionalRemarks: ""
  });
  const [updateImageFile, setUpdateImageFile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (!isSubmitOnly) {
      fetchMyRequests();
    }
  }, [isSubmitOnly]);

  const fetchMyRequests = async () => {
    const token = localStorage.getItem("token");
    setListLoading(true);
    setError("");
    try {
      const data = await apiRequest("/requests/mine", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setListLoading(false);
    }
  };

  const statusClassName = (status) => {
    switch (status) {
      case "RECYCLED":
        return "status-badge status-recycled";
      case "REJECTED":
        return "status-badge status-rejected";
      case "PICKED_UP":
        return "status-badge status-picked";
      case "PICKUP_SCHEDULED":
        return "status-badge status-scheduled";
      case "OTHER":
        return "status-badge status-other";
      default:
        return "status-badge status-submitted";
    }
  };

  const readableStatus = (status) => STATUS_LABELS[status] || STATUS_LABELS.OTHER;
  const readableStatusDetail = (status) => STATUS_DETAILS[status] || STATUS_DETAILS.OTHER;

  const openUpdateModal = (request) => {
    setUpdateError("");
    setUpdateImageFile(null);
    const knownDeviceType = DEVICE_TYPES.includes(request.deviceType) ? request.deviceType : "Other";
    setUpdateForm({
      deviceType: knownDeviceType,
      customDeviceType: knownDeviceType === "Other" ? request.deviceType || "" : "",
      brand: request.brand || "",
      model: request.model || "",
      condition: request.condition || "WORKING",
      quantity: request.quantity || 1,
      pickupAddress: request.pickupAddress || "",
      additionalRemarks: request.additionalRemarks || ""
    });
    setEditingRequest(request);
  };

  const closeUpdateModal = () => {
    setEditingRequest(null);
    setUpdateError("");
    setUpdateImageFile(null);
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    if (name === "quantity") {
      setUpdateForm((prev) => ({
        ...prev,
        quantity: Number(value)
      }));
      return;
    }
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUpdateForm = () => {
    if (!updateForm.deviceType?.trim()) return "Please select a device type.";
    if (updateForm.deviceType === "Other" && !updateForm.customDeviceType?.trim()) return "Please specify the device type.";
    if (!updateForm.brand?.trim()) return "Please enter device brand.";
    if (!updateForm.model?.trim()) return "Please enter device model.";
    if (!updateForm.condition?.trim()) return "Please select device condition.";
    if (!Number.isFinite(updateForm.quantity) || updateForm.quantity < 1) return "Quantity should be at least 1.";
    if (!updateForm.pickupAddress?.trim()) return "Please provide pickup address.";
    return "";
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!editingRequest) return;

    const validationMessage = validateUpdateForm();
    if (validationMessage) {
      setUpdateError(validationMessage);
      return;
    }

    setUpdateError("");
    setUpdateLoading(true);
    const token = localStorage.getItem("token");
    const payload = new FormData();
    const finalDeviceType =
      updateForm.deviceType === "Other"
        ? updateForm.customDeviceType.trim()
        : updateForm.deviceType.trim();

    payload.append("deviceType", finalDeviceType);
    payload.append("brand", updateForm.brand.trim());
    payload.append("model", updateForm.model.trim());
    payload.append("condition", updateForm.condition);
    payload.append("quantity", String(updateForm.quantity));
    payload.append("pickupAddress", updateForm.pickupAddress.trim());
    if (updateForm.additionalRemarks.trim()) {
      payload.append("additionalRemarks", updateForm.additionalRemarks.trim());
    }
    if (updateImageFile) {
      payload.append("image", updateImageFile);
    }

    try {
      const updated = await apiRequest(`/requests/${editingRequest.id}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });
      setRequests((prev) => prev.map((request) => (request.id === updated.id ? updated : request)));
      closeUpdateModal();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return requests.filter((request) => {
      if (statusFilter !== "ALL" && request.status !== statusFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const searchable = [
        request.id,
        request.brand,
        request.model,
        request.deviceType,
        request.condition,
        STATUS_LABELS[request.status],
        request.status
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [requests, searchQuery, statusFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStepError("");
    if (name === "quantity") {
      setForm((prev) => ({
        ...prev,
        quantity: Number(value)
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    setDeletingId(requestId);
    setError("");

    try {
      await apiRequest(`/requests/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const fetchReadableAddress = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    if (!data?.display_name) {
      throw new Error("No address found");
    }

    return data.display_name;
  };

  const handleFetchLiveLocation = async () => {
    setLocationError("");
    setLocationInfo("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    setLocationLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const fallback = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;

      try {
        const address = await fetchReadableAddress(latitude, longitude);
        setForm((prev) => ({
          ...prev,
          pickupAddress: address
        }));
        setStepError("");
        setLocationInfo("Pickup address auto-filled from your current location.");
      } catch {
        setForm((prev) => ({
          ...prev,
          pickupAddress: fallback
        }));
        setStepError("");
        setLocationInfo("Exact address not found. Coordinates were added instead.");
      }
    } catch (geoError) {
      if (geoError?.code === 1) {
        setLocationError("Location permission denied. Allow access and try again.");
      } else if (geoError?.code === 2) {
        setLocationError("Location is currently unavailable. Please try again.");
      } else if (geoError?.code === 3) {
        setLocationError("Location request timed out. Please try again.");
      } else {
        setLocationError("Unable to fetch your current location.");
      }
    } finally {
      setLocationLoading(false);
    }
  };

  const validateStepData = (stepId) => {
    if (stepId === 1) {
      if (!form.deviceType?.trim()) return "Please select a device type.";
      if (form.deviceType === "Other" && !form.customDeviceType?.trim()) return "Please specify the device type.";
      if (!form.brand?.trim()) return "Please enter device brand.";
      if (!form.model?.trim()) return "Please enter device model.";
      return "";
    }
    if (stepId === 2) {
      if (!form.condition?.trim()) return "Please select device condition.";
      if (!Number.isFinite(form.quantity) || form.quantity < 1) return "Quantity should be at least 1.";
      if (!form.pickupAddress?.trim()) return "Please provide pickup address.";
      return "";
    }
    if (stepId === 3) {
      if (!imageFile) return "Please upload an image.";
    }
    return "";
  };

  const handleNextStep = () => {
    const validationMessage = validateStepData(currentStep);
    if (validationMessage) {
      setStepError(validationMessage);
      return;
    }
    setStepError("");
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
  };

  const handlePreviousStep = () => {
    setStepError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setShowSuccess(false);
    setStepError("");

    for (const stepId of [1, 2, 3]) {
      const validationMessage = validateStepData(stepId);
      if (validationMessage) {
        setCurrentStep(stepId);
        setStepError(validationMessage);
        return;
      }
    }

    const token = localStorage.getItem("token");
    const payload = new FormData();
    const finalDeviceType =
      form.deviceType === "Other"
        ? form.customDeviceType.trim()
        : form.deviceType.trim();
    if (!finalDeviceType) {
      setError("Please enter device type");
      return;
    }

    payload.append("deviceType", finalDeviceType);
    payload.append("brand", form.brand.trim());
    payload.append("model", form.model.trim());
    payload.append("condition", form.condition);
    payload.append("quantity", String(form.quantity));
    payload.append("pickupAddress", form.pickupAddress.trim());
    if (form.additionalRemarks.trim()) {
      payload.append("additionalRemarks", form.additionalRemarks.trim());
    }
    payload.append("image", imageFile);

    setLoading(true);
    try {
      await apiRequest("/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });
      setShowSuccess(true);
      setForm({
        deviceType: "Laptop",
        customDeviceType: "",
        brand: "",
        model: "",
        condition: "WORKING",
        quantity: 1,
        pickupAddress: "",
        additionalRemarks: ""
      });
      setLocationInfo("");
      setLocationError("");
      setImageFile(null);
      setCurrentStep(1);
      setStepError("");
      if (!isSubmitOnly) {
        await fetchMyRequests();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finalDeviceType = form.deviceType === "Other" ? form.customDeviceType.trim() : form.deviceType.trim();

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">E-Waste Requests</div>
          <div className="page-subtitle">
            {isSubmitOnly
              ? "Submit your e-waste pickup request"
              : isViewOnly
                ? "View your submitted requests"
                : "Submit and view your requests"}
          </div>
        </div>
        <Link className="btn ghost" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      {!isViewOnly && (
        <div className="content-card request-card request-form-card">
          <div className="page-title">Submit Request</div>
          <div className="page-subtitle">A guided 3-step flow to submit your e-waste pickup request</div>
          {error && <div className="form-error">{error}</div>}

          <form className="request-wizard" onSubmit={handleSubmit}>
            <div className="request-stepper">
              {FORM_STEPS.map((step, index) => (
                <div key={step.id} className="request-stepper-item">
                  <div className={`request-step-badge ${currentStep >= step.id ? "is-active" : ""}`}>{step.id}</div>
                  <div className="request-step-copy">
                    <div className="request-step-title">{step.title}</div>
                    <div className="request-step-hint">{step.hint}</div>
                  </div>
                  {index < FORM_STEPS.length - 1 && <div className={`request-step-divider ${currentStep > step.id ? "is-done" : ""}`} />}
                </div>
              ))}
            </div>

            <div className="request-step-card">
              <div className="request-step-card-head">
                <div className="request-step-card-kicker">Step {currentStep}</div>
                <div className="request-step-card-title">{FORM_STEPS[currentStep - 1].title}</div>
              </div>

              {stepError && <div className="form-error">{stepError}</div>}

              {currentStep === 1 && (
                <div className="profile-grid">
                  <div className="input-group">
                    <label>Device Type</label>
                    <select name="deviceType" value={form.deviceType} onChange={handleChange}>
                      {DEVICE_TYPES.map((deviceType) => (
                        <option key={deviceType} value={deviceType}>
                          {deviceType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.deviceType === "Other" && (
                    <div className="input-group">
                      <label>Specify Device Type</label>
                      <input
                        name="customDeviceType"
                        value={form.customDeviceType}
                        onChange={handleChange}
                        placeholder="Enter device type"
                      />
                    </div>
                  )}

                  <div className="input-group">
                    <label>Brand</label>
                    <input name="brand" value={form.brand} onChange={handleChange} placeholder="HP, Dell, Samsung..." />
                  </div>

                  <div className="input-group">
                    <label>Model</label>
                    <input name="model" value={form.model} onChange={handleChange} placeholder="Model name" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="profile-grid">
                  <div className="input-group">
                    <label>Condition</label>
                    <select name="condition" value={form.condition} onChange={handleChange}>
                      {CONDITIONS.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Quantity</label>
                    <input name="quantity" type="number" min={1} max={1000} value={form.quantity} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Pickup Address</label>
                    <div className="pickup-address-actions">
                      <button className="btn ghost btn-location" type="button" onClick={handleFetchLiveLocation} disabled={locationLoading}>
                        {locationLoading ? "Fetching location..." : "Use Current Location"}
                      </button>
                    </div>
                    <textarea
                      name="pickupAddress"
                      rows={3}
                      value={form.pickupAddress}
                      onChange={handleChange}
                      placeholder="Enter pickup address"
                    />
                    {locationError && <div className="field-error">{locationError}</div>}
                    {locationInfo && <div className="location-info">{locationInfo}</div>}
                  </div>

                  <div className="input-group">
                    <label>Additional Remarks (Optional)</label>
                    <textarea
                      name="additionalRemarks"
                      rows={3}
                      value={form.additionalRemarks}
                      onChange={handleChange}
                      placeholder="Any notes for pickup team"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="review-layout">
                  <div className="review-card">
                    <div className="review-title">Request Summary</div>
                    <div className="review-item">
                      <span>Device</span>
                      <strong>{finalDeviceType || "-"}</strong>
                    </div>
                    <div className="review-item">
                      <span>Brand / Model</span>
                      <strong>{form.brand.trim() ? `${form.brand} / ${form.model || "-"}` : "-"}</strong>
                    </div>
                    <div className="review-item">
                      <span>Condition</span>
                      <strong>{form.condition}</strong>
                    </div>
                    <div className="review-item">
                      <span>Quantity</span>
                      <strong>{form.quantity}</strong>
                    </div>
                    <div className="review-item review-item-column">
                      <span>Pickup Address</span>
                      <strong>{form.pickupAddress || "-"}</strong>
                    </div>
                  </div>

                  <div className="review-card">
                    <div className="review-title">Upload Proof Image</div>
                    <div className="input-group">
                      <label>Image (max 5MB)</label>
                      <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                    </div>
                    <div className="review-upload-state">{imageFile ? `Selected: ${imageFile.name}` : "No image selected yet."}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="request-step-actions">
              <button className="btn ghost" type="button" onClick={handlePreviousStep} disabled={currentStep === 1 || loading}>
                Previous
              </button>
              {currentStep < FORM_STEPS.length ? (
                <button className="btn primary" type="button" onClick={handleNextStep} disabled={loading}>
                  Continue
                </button>
              ) : (
                <button className="btn primary" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {!isSubmitOnly && (
        <div className="content-card request-card request-list-card">
          <div className="page-title">My Requests</div>
          {error && <div className="form-error">{error}</div>}

          {!listLoading && requests.length > 0 && (
            <div className="request-list-toolbar">
              <div className="request-filter-header">
                <div className="request-filter-title">Filter requests</div>
                <div className="request-filter-summary">
                  Showing {filteredRequests.length} of {requests.length}
                </div>
              </div>
              <div className="request-filters">
                <div className="input-group">
                  <label>Search</label>
                  <input
                    className="request-search-input"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by ID, brand, model, or device type"
                  />
                </div>
                <div className="input-group">
                  <label>Status</label>
                  <select
                    className="request-status-select"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.keys(STATUS_LABELS).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="request-filter-actions">
                  <button
                    className="btn ghost btn-clear"
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                    }}
                    disabled={!searchQuery && statusFilter === "ALL"}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {listLoading ? (
            <div className="loading">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="loading">No requests submitted yet.</div>
          ) : filteredRequests.length === 0 ? (
            <div className="loading">No requests match your filters.</div>
          ) : (
            <div className="fk-list-shell">
              {filteredRequests.map((request) => (
                <article className="fk-list-item" key={request.id}>
                  <div className="fk-list-product">
                    <div className="fk-list-thumb">{(request.deviceType || "EW").slice(0, 2).toUpperCase()}</div>
                    <div className="fk-list-meta">
                      <div className="fk-list-title">
                        {request.brand} {request.model}
                      </div>
                      <div className="fk-list-subtitle">
                        {request.deviceType} - {request.condition} - Qty {request.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="fk-list-delivery">
                    <div className="fk-section-head">Pickup Address</div>
                    <p>{request.pickupAddress || "-"}</p>
                    <div className="fk-delivery-divider" />
                    <div className="fk-meta-line">
                      <strong>Created:</strong> {request.createdAt ? new Date(request.createdAt).toLocaleString() : "-"}
                    </div>
                    <div className="fk-meta-line">
                      <strong>Last Updated:</strong> {request.updatedAt ? new Date(request.updatedAt).toLocaleString() : "-"}
                    </div>
                  </div>

                  <div className="fk-list-status">
                    <span className={statusClassName(request.status)}>{readableStatus(request.status)}</span>
                    <div className="fk-list-status-copy">{readableStatusDetail(request.status)}</div>
                    <div className="fk-list-actions">
                      {request.status === "SUBMITTED" && (
                        <button className="btn ghost btn-track" type="button" onClick={() => openUpdateModal(request)}>
                          Update
                        </button>
                      )}
                      <button className="btn ghost btn-track" type="button" onClick={() => navigate(`/requests/track/${request.id}`)}>
                        Track
                      </button>
                      <button
                        className="btn ghost btn-track btn-delete"
                        type="button"
                        onClick={() => setPendingDeleteId(request.id)}
                        disabled={deletingId === request.id}
                      >
                        {deletingId === request.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Request Submitted</h2>
            <p>Your e-waste pickup request has been submitted successfully.</p>
            <button className="btn primary" onClick={() => setShowSuccess(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {pendingDeleteId !== null && (
        <div className="popup-overlay">
          <div className="popup-box delete-popup-box">
            <h2>Delete Request</h2>
            <p>Are you sure you want to delete this request?</p>
            <div className="profile-actions" style={{ justifyContent: "center" }}>
              <button className="btn ghost" onClick={() => setPendingDeleteId(null)}>
                Cancel
              </button>
              <button
                className="btn primary btn-danger"
                onClick={async () => {
                  const requestId = pendingDeleteId;
                  setPendingDeleteId(null);
                  await handleDeleteRequest(requestId);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRequest && (
        <div className="popup-overlay">
          <div className="popup-box update-popup-box">
            <h2>Update Request</h2>
            <p>Only submitted requests can be updated.</p>
            {updateError && <div className="form-error">{updateError}</div>}
            <form className="update-form" onSubmit={handleUpdateSubmit}>
              <div className="update-form-grid">
                <div className="input-group">
                  <label>Device Type</label>
                  <select name="deviceType" value={updateForm.deviceType} onChange={handleUpdateChange}>
                    {DEVICE_TYPES.map((deviceType) => (
                      <option key={deviceType} value={deviceType}>
                        {deviceType}
                      </option>
                    ))}
                  </select>
                </div>

                {updateForm.deviceType === "Other" && (
                  <div className="input-group">
                    <label>Specify Device Type</label>
                    <input
                      name="customDeviceType"
                      value={updateForm.customDeviceType}
                      onChange={handleUpdateChange}
                      placeholder="Enter device type"
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>Brand</label>
                  <input name="brand" value={updateForm.brand} onChange={handleUpdateChange} placeholder="HP, Dell, Samsung..." />
                </div>

                <div className="input-group">
                  <label>Model</label>
                  <input name="model" value={updateForm.model} onChange={handleUpdateChange} placeholder="Model name" />
                </div>

                <div className="input-group">
                  <label>Condition</label>
                  <select name="condition" value={updateForm.condition} onChange={handleUpdateChange}>
                    {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    min={1}
                    max={1000}
                    value={updateForm.quantity}
                    onChange={handleUpdateChange}
                  />
                </div>

                <div className="input-group update-form-full">
                  <label>Pickup Address</label>
                  <textarea
                    name="pickupAddress"
                    rows={3}
                    value={updateForm.pickupAddress}
                    onChange={handleUpdateChange}
                    placeholder="Enter pickup address"
                  />
                </div>

                <div className="input-group update-form-full">
                  <label>Additional Remarks (Optional)</label>
                  <textarea
                    name="additionalRemarks"
                    rows={3}
                    value={updateForm.additionalRemarks}
                    onChange={handleUpdateChange}
                    placeholder="Any notes for pickup team"
                  />
                </div>

                <div className="input-group update-form-full">
                  <label>Update Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={(event) => setUpdateImageFile(event.target.files?.[0] || null)} />
                  <div className="update-image-note">
                    {updateImageFile ? `Selected: ${updateImageFile.name}` : "Leave empty to keep existing image."}
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn ghost" type="button" onClick={closeUpdateModal} disabled={updateLoading}>
                  Cancel
                </button>
                <button className="btn primary" type="submit" disabled={updateLoading}>
                  {updateLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
