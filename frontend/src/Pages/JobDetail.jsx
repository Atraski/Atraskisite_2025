import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Briefcase, Calendar } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer/Footer";
import { API_BASE } from "../config";
import "./JobDetail.css";

const MAX_FILE_MB = 5;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const getLocations = (s = "") =>
  String(s)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

const JobDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}api/jobs/${slug}`);
        if (!res.ok) {
          navigate("/careers");
          return;
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
        navigate("/careers");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [slug, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) return null;

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
      formData.append("jobTitle", job.title);

      formData.append("Location", selectedLoc || "");
      formData.append("jobLocationLabel", job.location ?? "");

      const res = await fetch(`${API_BASE}api/applications/apply`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Failed"));

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
        // Reset form
        setName("");
        setEmail("");
        setContact("");
        setWhatsapp("");
        setMessage("");
        setFile(null);
      }, 3000);
    } catch (err) {
      setError("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const cities = getLocations(job.location);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            to="/careers"
            className="inline-flex items-center text-white hover:text-gray-100 mb-6 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Careers
          </Link>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center">
                <MapPin size={20} className="mr-2" />
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase size={20} className="mr-2" />
                <span className="font-medium">{job.category}</span>
              </div>
              {job.experience && (
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2" />
                  <span className="font-medium">{job.experience}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Description */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
                <div
                  className="job-description text-gray-700 space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: job.fullDescription || `<p>${job.description}</p>`,
                  }}
                  style={{
                    lineHeight: "1.8",
                  }}
                />
              </div>

              {/* Location Details */}
              {cities.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin size={24} className="mr-2" />
                    Available Locations
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {cities.map((city, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-medium border border-yellow-200"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply Now</h2>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-green-600 flex items-center justify-center">
                      <span className="text-3xl text-green-600">✓</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Application Submitted!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for your interest. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSubmitting && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                        <span className="h-4 w-4 animate-spin border-2 border-blue-700 border-t-transparent rounded-full" />
                        Submitting your application…
                      </div>
                    )}
                    
                    {error && (
                      <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                        disabled={disabled}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                        disabled={disabled}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 1234567890"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                        disabled={disabled}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 1234567890"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                        disabled={disabled}
                      />
                    </div>

                    {locations.length > 1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Location <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedLoc}
                          onChange={(e) => setSelectedLoc(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                          disabled={disabled}
                          required
                        >
                          {locations.map((loc, i) => (
                            <option key={i} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-gray-500 text-xs">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="Tell us why you're interested in this role..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                        rows={4}
                        disabled={disabled}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume <span className="text-red-500">*</span>
                        <span className="text-gray-500 text-xs font-normal ml-2">
                          (PDF/DOC/DOCX/JPG/PNG, ≤ {MAX_FILE_MB} MB)
                        </span>
                      </label>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`rounded-md border-2 border-dashed p-4 transition ${
                          fileError
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300 hover:border-yellow-400"
                        } ${disabled ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="resume"
                            role="button"
                            className="px-4 py-2 bg-black text-white rounded-md cursor-pointer hover:bg-gray-800 disabled:opacity-60 text-sm font-medium"
                          >
                            {file ? "Change File" : "Upload File"}
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
                            {file ? file.name : "Drag & drop or click to upload"}
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
                        {fileError && (
                          <p className="mt-2 text-sm text-red-600">{fileError}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
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
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default JobDetail;

