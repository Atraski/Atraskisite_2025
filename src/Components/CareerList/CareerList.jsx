import React, { useEffect, useState } from "react";
import JobCard from "../JobCard/JobCard";
import "./CareerList.css";

const mockJobs = [
  {
    id: 1,
    title: "Business Development Executive",
    location: "Available in 2 locations (Delhi, Kolkata)",
    category: "Marketing",
    description: "Be an authoritative marketing voice..."
  },
  {
    id: 2,
    title: "Mern Full Stack Developer",
    location: "Delhi, India",
    category: "Engineering",
    description: "Collaborate with teams to gather requirements..."
  },
  {
    id: 2,
    title: "Motion Graphics Designer",
    location: "Delhi, India",
    category: "Graphics Design",
    description: "Collaborate with teams to gather requirements..."
  }
];

const CareerList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setJobs(mockJobs);
    }, 1000);
  }, []);

  return (
    <div className="career-list">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default CareerList;
