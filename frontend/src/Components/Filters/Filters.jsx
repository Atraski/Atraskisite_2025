import React from "react";

const Filters = ({ setOfficeFilter, setCategoryFilter }) => {
  return (
    <div className="max-w-4xl mx-auto mt-20 mb-12 relative px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Office Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-1/2">
            <label className="text-sm font-medium text-gray-700">🏢 Office:</label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setOfficeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Delhi</option>
              <option>Kolkata</option>
              <option>Mumbai</option>
              <option>Work From Home</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Freelance</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-1/2">
            <label className="text-sm font-medium text-gray-700">📂 Category:</label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All</option>
              <option>Marketing</option>
              <option>Engineering</option>
              <option>Social Media</option>
              <option>Graphics Design</option>
              <option>Production</option>
              <option>Human Resource</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
