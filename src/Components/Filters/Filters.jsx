import React from "react";
import "./Filters.css";

const Filters = () => {
  return (
    <div className="filters">
      <label>Search: <input type="text" placeholder="Job title..." /></label>
      <label>Category:
        <select>
          <option>All</option>
          <option>Marketing</option>
          <option>Engineering</option>
          <option>Social Media</option>
          <option>Graphics Design</option>
          <option>Production</option>
          <option>Human Resource</option>
        </select>
      </label>
    </div>
  );
};

export default Filters;
