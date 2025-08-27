import React from "react";
import { assets } from "../assets/assets";
import CountUp from "react-countup";

const News = () => {
  return (
    <section className=" w-full bg-[#f1f1f1] text-gray-800" id="lead-stories">

      {/* --- SECTION 1: AT Stay | Baidyanath | Afaqs (3-column on desktop) --- */}
      <div className="bg-white px-4 sm:px-6 lg:px-12 pt-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* AT Stay Block */}
          <div className="relative rounded-lg overflow-hidden shadow">
            <img
              src={assets.atstay}
              alt="At stay launch"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex justify-center items-end pb-6 z-20">
              {/* <div className="bg-white bg-opacity-80 px-4 py-2 rounded shadow-md backdrop-blur-sm text-gray-800 text-sm sm:text-base text-center font-bold"> */}
                {/* <p>Ready to launch in July, 2025. <br className="sm:hidden" />Find out more...</p> */}
              {/* </div> */}
            </div>
          </div>

{/* Baidyanath Content */}
<div className="h-full flex flex-col justify-center">
  <div className="flex flex-wrap gap-2 mb-4">
    {["New Business", "Latest Stories"].map((tag, i) => (
      <span
        key={i}
        className="bg-yellow-500 text-xs font-semibold text-black px-2 py-1 rounded text-center"
      >
        {tag}
      </span>
    ))}
  </div>

  <div>
    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
      Baidyanath partners with Atraski to  expand its digital presence
    </h3>
    <p className="text-base text-gray-700 leading-relaxed">
      The alliance will focus on product marketing, highlighting the brand's diverse product
      portfolio while crafting brand narratives to resonate across age groups.
    </p>
  </div>
</div>



          {/* Afaqs Logo */}
<div className="flex items-center justify-end mt-6 md:mt-0">
  <img
    src={assets.afaqslogo}
    alt="Afaqs Logo"
    className="h-20 w-auto md:h-24 object-contain"
  />
</div>

        </div>
      </div>

      {/* --- Spacer (grey divider) --- */}
      <div className="w-full h-6 bg-[#F1F1F1]"></div>

      {/* --- SECTION 2: Stats Grid + Team Image (2-column on desktop) --- */}
      <div className="bg-white px-4 sm:px-6 lg:px-12 pt-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <p className="font-bold text-3xl"><CountUp end={200} duration={4} />+</p>
              <img src={assets.partner} alt="Partners Icon" className="w-30 h-22 my-2" />
              <p className="text-blue-600 text-xl">Happy Partners</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <p className="font-bold text-3xl"><CountUp end={50} duration={4} />+</p>
              <img src={assets.event} alt="Events Icon" className="w-30 h-22 my-2" />
              <p className="text-blue-600 text-xl">Successful Events</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <p className="font-bold text-3xl"><CountUp end={60} duration={6} />+</p>
              <img src={assets.employee} alt="Employees Icon" className="w-30 h-22 my-2" />
              <p className="text-blue-600 text-xl">Happy Employees</p>
            </div>
          </div>

          {/* Team Image */}
          <div className="flex justify-center md:justify-end items-center">
            <img
              src={assets.illustration}
              alt="Team illustration"
              className="w-64 sm:w-80 md:w-full max-w-[400px] object-contain"
            />
          </div>
        </div>
      </div><br />
    </section>
  );
};

export default News;
