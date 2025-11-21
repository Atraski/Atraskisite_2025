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

  // Motivational quotes when no jobs
  const motivationalQuotes = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      quote: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      quote: "Don't be afraid to give up the good to go for the great.",
      author: "John D. Rockefeller"
    }
  ];

  return (
    <div id="all-jobs" className="max-w-4xl mx-auto px-4 pb-12 scroll-mt-24">
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          {/* Catchy No Jobs Found Section */}
          <div className="relative mb-12">
            <div className="inline-block">
              <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4">
                No Open Positions Right Now
              </h2>
              <div className="absolute -top-2 -right-2 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-yellow-500 rounded-full opacity-20 blur-3xl"></div>
            </div>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              We're always looking for amazing talent! Check back soon or reach out to us directly.
            </p>
          </div>

          {/* Motivational Quotes Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">
              💡 Stay Inspired
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {motivationalQuotes.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-gray-800 text-lg font-medium italic mb-3">
                    "{item.quote}"
                  </p>
                  <p className="text-gray-600 text-sm font-semibold">
                    — {item.author}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <p className="text-gray-700 mb-4">
              Want to be the first to know about new opportunities?
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Get Notified
            </button>
          </div>
        </div>
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
