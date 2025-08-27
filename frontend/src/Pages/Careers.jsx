import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import CareersCarousal from "../Components/CareersCarousal/CareersCarousal";
import CareerList from "../Components/CareerList/CareerList";
import Filters from "../Components/Filters/Filters";
import Voices from "../Components/Filters/Voices";
import Footer from "../Components/Footer/Footer";

const Careers = () => {
  // State to track selected filters
  const [officeFilter, setOfficeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  return (
    <>
      <Navbar />
      <CareersCarousal />
      
      <section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold  text-white">Careers at ATRASKI</h1>
          <p className="mt-4 text-lg text-white">
            Join us in our mission to revolutionize the world of digital marketing and social media management.
          </p>
          <p className="mt-2 text-md text-gray-100">
            Explore our current job openings and become a part of our dynamic team.
          </p>
        </div>
      </section>

      {/* <Voices /> */}

      {/* Filters Component */}
      <Filters setOfficeFilter={setOfficeFilter} setCategoryFilter={setCategoryFilter} />
      
      {/* Career List with filters applied */}
      <CareerList officeFilter={officeFilter} categoryFilter={categoryFilter} />


      <Footer />
    </>
  );
};

export default Careers;
