import React, { useEffect, useState } from "react";
import JobCard from "../JobCard/JobCard";
import { API_BASE } from "../../config";

const normalize = (s = "") => s.trim().toLowerCase();

const CareerList = ({ officeFilter = "All", categoryFilter = "All" }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}api/jobs`);
        if (res.ok) {
          const data = await res.json();
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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

  if (loading) {
    return (
      <div id="all-jobs" className="max-w-4xl mx-auto px-4 pb-12 scroll-mt-24">
        <div className="text-center py-12">
          <div className="h-8 w-8 animate-spin border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="all-jobs" className="max-w-4xl mx-auto px-4 pb-12 scroll-mt-24">
      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
          {filteredJobs.map((job) => (
            <JobCard key={job._id || job.slug} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerList;
