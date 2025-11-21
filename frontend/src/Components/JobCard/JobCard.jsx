import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const chipList = (loc = "") =>
  String(loc)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const cities = chipList(job.location);

  const handleApply = () => {
    navigate(`/careers/job/${job.slug}`);
  };

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-6 flex flex-col justify-between transition hover:shadow-lg bg-white cursor-pointer" onClick={handleApply}>
      {/* Job Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-yellow-600 transition">{job.title}</h2>

      {/* Location chips */}
      <div className="mb-3">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          Locations
        </div>
        <div className="flex flex-wrap gap-2">
          {cities.length ? (
            cities.map((c, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border"
              >
                {c}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">—</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-6 line-clamp-3">{job.description}</p>

      {/* Right Aligned CTA */}
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleApply();
          }}
          className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
