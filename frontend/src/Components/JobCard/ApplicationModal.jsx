import React, { useMemo, useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { API_BASE } from "../../config";

const MAX_FILE_MB = 5;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

// "Delhi, Kolkata" -> ["Delhi","Kolkata"]
const getLocations = (s = "") =>
  String(s)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

const ApplicationModal = ({ isOpen, onClose, job }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  // Locations: uniform dropdown UI (single => disabled)
  const locations = useMemo(() => getLocations(job?.location), [job]);
  const [selectedLoc, setSelectedLoc] = useState(locations[0] || "");
  useEffect(() => {
    setSelectedLoc(locations[0] || "");
  }, [locations]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const disabled = isSubmitting || isSubmitted;

  if (!isOpen) return null;

  const validateFile = (f) => {
    if (!f) return "Please attach your resume.";
    if (!ALLOWED_TYPES.includes(f.type)) return "Only PDF, DOC, DOCX, JPG, PNG allowed.";
    if (f.size > MAX_FILE_MB * 1024 * 1024) return `Max size ${MAX_FILE_MB} MB.`;
    return null;
  };

  const onPickFile = (f) => {
    const err = validateFile(f);
    setFileError(err);
    if (!err) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) onPickFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const err = validateFile(file);
    setFileError(err);
    if (err) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contactNumber", contact);
      formData.append("whatsappNumber", whatsapp);
      formData.append("message", message);
      formData.append("file", file);
      formData.append("jobTitle", job?.title ?? "");

      // 👇 exactly as required
      formData.append("Location", selectedLoc || "");
      formData.append("jobLocationLabel", job?.location ?? ""); // optional

      const res = await fetch(`${API_BASE}api/applications/apply`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Failed"));

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative p-6">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black disabled:opacity-50"
          onClick={onClose}
          disabled={disabled}
          aria-disabled={disabled}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Apply for {job?.title}</h2>

        {isSubmitting && !isSubmitted && (
          <div className="mb-3 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
            <span className="h-3 w-3 animate-spin border-2 border-blue-700 border-t-transparent rounded-full" />
            Sending your application…
          </div>
        )}
        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
        )}

        {isSubmitted ? (
          <div className="text-green-700 bg-green-50 border border-green-200 rounded text-center py-6 font-medium">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full border-2 border-green-600 flex items-center justify-center">✓</div>
            Application submitted successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSubmitting}>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md disabled:bg-gray-100"
              disabled={disabled}
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md disabled:bg-gray-100"
              disabled={disabled}
            />
            <input
              type="text"
              required
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-2 border rounded-md disabled:bg-gray-100"
              disabled={disabled}
            />
            <input
              type="text"
              required
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2 border rounded-md disabled:bg-gray-100"
              disabled={disabled}
            />
            <textarea
              required
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md disabled:bg-gray-100"
              rows={4}
              disabled={disabled}
            />

            {/* --- LOCATION: Always dropdown. Single -> disabled --- */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={16} /> Location
                </span>
              </label>

              <select
                value={selectedLoc}
                onChange={(e) => setSelectedLoc(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white disabled:bg-gray-100 
              ${locations.length <= 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={disabled || locations.length <= 1}
                required
              >
                {locations.length ? (
                  locations.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))
                ) : (
                  <option value="">No location</option>
                )}
              </select>


              {locations.length === 1 && (
                <p className="text-xs text-gray-500">This role is available in {locations[0]}.</p>
              )}
            </div>
            {/* --- /LOCATION --- */}

            {/* --- FILE UPLOADER --- */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`rounded-md border-2 border-dashed p-4 transition ${fileError ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-gray-400"
                } ${disabled ? "opacity-60" : ""}`}
            >
              <label htmlFor="resume" className="block text-sm font-medium mb-2">
                Resume <span className="text-gray-400 font-normal">(PDF/DOC/DOCX/JPG/PNG, ≤ {MAX_FILE_MB} MB)</span>
              </label>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="resume"
                  role="button"
                  className="px-3 py-2 bg-black text-white rounded-md cursor-pointer hover:bg-gray-800 disabled:opacity-60"
                >
                  {file ? "Change file" : "Upload file"}
                </label>

                <input
                  id="resume"
                  name="resume"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  disabled={disabled}
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />

                <div className="text-sm text-gray-700 truncate flex-1">
                  {file ? file.name : "Drag & drop your resume here, or click Upload file"}
                </div>

                {file && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFileError(null);
                    }}
                    className="text-xs text-gray-500 underline hover:text-gray-700"
                    disabled={disabled}
                  >
                    Clear
                  </button>
                )}
              </div>

              {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
            </div>
            {/* --- /FILE UPLOADER --- */}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={disabled}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  Submitting…
                </>
              ) : (
                "Submit Application"
              )}
            </button>

            {!isSubmitting && (
              <p className="text-xs text-gray-500 text-center">
                You’ll see a confirmation right after you click submit.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
