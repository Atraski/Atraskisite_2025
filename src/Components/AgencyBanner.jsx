import React from "react";
import { assets } from "../assets/assets";

const AgencyBanner = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black" id="social-media">
      {/* Responsive Background Images */}
      <div className="absolute inset-0 z-0">
        {/* Mobile Image */}
        <img
          src={assets.ideaa}
          alt="Agency Mobile Background"
          className="w-full h-full object-cover md:hidden"
        />
        {/* Desktop Image */}
        <img
          src={assets.idea}
          alt="Agency Desktop Background"
          className="w-full h-full object-cover hidden md:block"
        />
      </div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10">
        <div className="w-full max-w-5xl flex flex-col items-center text-center text-white">

          {/* Title Image */}
          <img
            src={assets.text}
            alt="Agency Title"
            className="w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/3 mb-6 max-w-[300px] sm:max-w-[400px]"
          />

          {/* Paragraph */}
          <p className="text-sm sm:text-base md:text-lg max-w-md sm:max-w-xl md:max-w-2xl leading-relaxed sm:leading-loose">
            We started with blank pages, big dreams, and raw vision. Today,{" "}
            <br className="hidden sm:inline-block" />
            our work speaks in experiences, values, and culture. We're still
            writing our story — but every chapter leaves a mark.
          </p>

          {/* Down Arrow */}
          <div className="mt-8 sm:mt-10">
            <img
              src={assets.arrowicon}
              alt="Scroll Down"
              className="w-6 sm:w-8 h-auto animate-bounce"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyBanner;
