import React, { useEffect, useState } from "react";
import JobCard from "../JobCard/JobCard";

const mockJobs = [
  {
    id: 1,
    title: "Business Development Executive",
    location: "Delhi, Kolkata",
    category: "Marketing",
    description: "Join our marketing team.",
  },
  {
    id: 2,
    title: "MERN Full Stack Developer",
    location: "Delhi",
    category: "Engineering",
    description: "Collaborate to build scalable web apps.",
  },
  {
    id: 3,
    title: "Motion Graphics Designer",
    location: "Mumbai",
    category: "Graphics Design",
    description: "Create stunning motion graphics.",
  },
  {
    id: 4,
    title: "Social Media Manager",
    location: "Remote",
    category: "Marketing",
    description: "Manage our social media presence.",
  },
];

const normalize = (s = "") => s.trim().toLowerCase();

const CareerList = ({ officeFilter = "All", categoryFilter = "All" }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setJobs(mockJobs), 300);
    return () => clearTimeout(t);
  }, []);

  // Filter: support multi-city like "Delhi, Kolkata"
  const filteredJobs = jobs.filter((job) => {
    const isCategoryMatch =
      categoryFilter === "All" || job.category === categoryFilter;

    if (officeFilter === "All") return isCategoryMatch;

    const jobCities = String(job.location)
      .split(",")
      .map((c) => normalize(c));

    const want = normalize(officeFilter);
    const isOfficeMatch =
      jobCities.includes(want) || normalize(job.location) === want;

    return isCategoryMatch && isOfficeMatch;
  });

  return (
    <div id="all-jobs" className="max-w-4xl mx-auto px-4 pb-12 scroll-mt-24">
      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerList;
