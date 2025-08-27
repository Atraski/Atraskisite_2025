import React, { useState } from "react";
import ApplicationModal from "./ApplicationModal";
import { MapPin } from "lucide-react";

const JobCard = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="border border-gray-200 shadow-md rounded-xl p-6 flex flex-col justify-between transition hover:shadow-lg bg-white">
        {/* Job Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin size={16} className="mr-1" />
          {job.location}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-6">{job.description}</p>

        {/* Right Aligned CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {isOpen && (
        <ApplicationModal isOpen={isOpen} onClose={() => setIsOpen(false)} job={job} />
      )}
    </>
  );
};

export default JobCard;
